// src/viewmodels/tabs/useConfigViewModel.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert, Share } from 'react-native';
import { router } from 'expo-router';
import { AuthService } from '../../services/auth/AuthService';
import { UserSettingsService } from '../../services/firestore/UserSettingsService';
import { TransactionService } from '../../services/firestore/TransactionService';
import { BudgetService } from '../../services/firestore/BudgetService';
import { GoalService } from '../../services/firestore/GoalService';
import { UserSettings } from '../../models/UserSettings';
import { Transaction } from '../../models/Transaction';
import { Budget } from '../../models/Budget';
import { Goal } from '../../models/Goal';

export const useConfigViewModel = () => {
  const [currentUser] = useState(AuthService.getCurrentUser());
  const [settings, setSettings] = useState<Partial<UserSettings>>({
    pushNotifications: true,
    goalDeadlineNotifications: true,
    budgetExceededNotifications: true,
    dailyReminder: false,
    hideAmounts: false,
    biometricAuth: false,
  });
  const [loading, setLoading] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!currentUser) return;

    try {
      const userSettings = await UserSettingsService.getUserSettings(currentUser.uid);
      if (userSettings) {
        setSettings({
          pushNotifications: userSettings.pushNotifications,
          goalDeadlineNotifications: userSettings.goalDeadlineNotifications,
          budgetExceededNotifications: userSettings.budgetExceededNotifications,
          dailyReminder: userSettings.dailyReminder,
          hideAmounts: userSettings.hideAmounts,
          biometricAuth: userSettings.biometricAuth,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleToggleSetting = async (settingKey: keyof UserSettings) => {
    if (!currentUser) return;

    const newValue = !settings[settingKey];

    try {
      // Actualizar localmente
      setSettings((prev) => ({
        ...prev,
        [settingKey]: newValue,
      }));

      // Si se desactivan las notificaciones push, desactivar todas las demás
      if (settingKey === 'pushNotifications' && !newValue) {
        setSettings((prev) => ({
          ...prev,
          pushNotifications: false,
          goalDeadlineNotifications: false,
          budgetExceededNotifications: false,
          dailyReminder: false,
        }));

        await UserSettingsService.updateSettings(currentUser.uid, {
          pushNotifications: false,
          goalDeadlineNotifications: false,
          budgetExceededNotifications: false,
          dailyReminder: false,
        });
      } else {
        // Actualizar en Firebase
        await UserSettingsService.updateSetting(
          currentUser.uid,
          settingKey,
          newValue
        );
      }
    } catch (error) {
      console.error('Error toggling setting:', error);
      Alert.alert('Error', 'No se pudo actualizar la configuración');
      
      // Revertir cambio local
      setSettings((prev) => ({
        ...prev,
        [settingKey]: !newValue,
      }));
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await AuthService.signOut();
              router.replace('/(auth)');
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro? Esta acción es permanente y eliminará todos tus datos.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (!currentUser) return;

            try {
              setLoading(true);

              // Aquí deberías implementar la lógica para eliminar todos los datos del usuario
              // Por ahora solo mostramos un mensaje
              Alert.alert(
                'Confirmación final',
                'Escribe "ELIMINAR" para confirmar',
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel',
                  },
                  {
                    text: 'Confirmar',
                    style: 'destructive',
                    onPress: async () => {
                      // Implementar eliminación de datos y cuenta
                      await AuthService.signOut();
                      router.replace('/(auth)');
                      Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada exitosamente');
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'No se pudo eliminar la cuenta');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      // Obtener todos los datos del usuario
      const [transactions, budgets, goals] = await Promise.all([
        TransactionService.getUserTransactions(currentUser.uid),
        BudgetService.getUserBudgets(currentUser.uid),
        GoalService.getUserGoals(currentUser.uid),
      ]);

      // Crear CSV de transacciones
      const csvContent = generateCSV(transactions, budgets, goals);

      // Compartir o descargar el archivo
      await Share.share({
        message: csvContent,
        title: 'Exportar datos de MONET',
      });

      Alert.alert('Éxito', 'Datos exportados correctamente');
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'No se pudieron exportar los datos');
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = (
    transactions: Transaction[],
    budgets: Budget[],
    goals: Goal[]
  ): string => {
    let csv = 'Resumen de datos MONET\n\n';

    // Transacciones
    csv += 'TRANSACCIONES\n';
    csv += 'Fecha,Tipo,Categoría,Monto,Descripción\n';
    transactions.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString('es-CO');
      csv += `${date},${t.type},${t.category || 'Sin categoría'},${t.amount},${t.description || ''}\n`;
    });

    csv += '\n';

    // Presupuestos
    csv += 'PRESUPUESTOS\n';
    csv += 'Categoría,Límite,Gastado,Período\n';
    budgets.forEach((b) => {
      csv += `${b.categoryName || 'Sin categoría'},${b.amount},${b.spent},${b.period}\n`;
    });

    csv += '\n';

    // Objetivos
    csv += 'OBJETIVOS\n';
    csv += 'Título,Meta,Actual,Progreso,Fecha límite\n';
    goals.forEach((g) => {
      const deadline = g.deadline ? new Date(g.deadline).toLocaleDateString('es-CO') : 'Sin fecha';
      const progress = ((g.currentAmount / g.targetAmount) * 100).toFixed(1);
      csv += `${g.title},${g.targetAmount},${g.currentAmount},${progress}%,${deadline}\n`;
    });

    return csv;
  };

  return {
    currentUser,
    settings,
    loading,
    handleToggleSetting,
    handleLogout,
    handleDeleteAccount,
    handleExportData,
  };
};

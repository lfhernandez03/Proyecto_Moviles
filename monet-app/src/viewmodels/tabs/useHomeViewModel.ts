// src/viewmodels/tabs/useHomeViewModel.ts
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { AuthService } from '@/src/services/auth/AuthService';
import { TransactionService } from '@/src/services/firestore/TransactionService';
import { Transaction, TransactionSummary } from '@/src/models/Transaction';
import { formatCurrency } from '@/src/utils/currency';
import { NotificationHelper } from '@/src/utils/notificationHelper';
import { UserSettingsService } from '@/src/services/firestore/UserSettingsService';

export const useHomeViewModel = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    monthSavings: 0,
    monthExpenses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const currentUser = AuthService.getCurrentUser();

  /**
   * Carga la configuración del usuario
   */
  const loadUserSettings = async () => {
    if (!currentUser) return;

    try {
      const userSettings = await UserSettingsService.getUserSettings(currentUser.uid);
      if (userSettings) {
        // Invertir hideAmounts porque balanceVisible es lo opuesto
        setBalanceVisible(!userSettings.hideAmounts);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  };

  /**
   * Carga las transacciones del usuario
   */
  const loadTransactions = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userTransactions = await TransactionService.getUserTransactions(
        currentUser.uid,
        10
      );
      setTransactions(userTransactions);

      // Calcular resumen del mes
      const monthTransactions = await TransactionService.getMonthTransactions(
        currentUser.uid
      );
      calculateSummary(monthTransactions);

      // Verificar notificaciones en segundo plano
      NotificationHelper.checkAllNotifications(currentUser.uid).catch(error => {
        console.error('Error al verificar notificaciones:', error);
      });
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calcula el resumen financiero
   */
  const calculateSummary = (monthTransactions: Transaction[]) => {
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setSummary({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      monthSavings: income - expenses,
      monthExpenses: expenses,
    });
  };

  /**
   * Alterna la visibilidad del balance
   */
  const toggleBalanceVisibility = async () => {
    if (!currentUser) return;

    const newValue = !balanceVisible;
    setBalanceVisible(newValue);

    try {
      // Guardar en Firebase (invertir porque hideAmounts es lo opuesto a balanceVisible)
      await UserSettingsService.updateSetting(
        currentUser.uid,
        'hideAmounts',
        !newValue
      );
    } catch (error) {
      console.error('Error al actualizar visibilidad:', error);
      // Revertir si falla
      setBalanceVisible(!newValue);
    }
  };

  /**
   * Navega a agregar ingreso
   */
  const navigateToAddIncome = () => {
    router.push('/(tabs)/transactions?type=income');
  };

  /**
   * Navega a registrar gasto
   */
  const navigateToAddExpense = () => {
    router.push('/(tabs)/transactions?type=expense');
  };

  /**
   * Navega a presupuesto
   */
  const navigateToBudget = () => {
    router.push('/(tabs)/budget');
  };

  /**
   * Navega a estadísticas
   */
  const navigateToReports = () => {
    router.push('/(tabs)/reports');
  };

  /**
   * Navega al detalle de una transacción
   */
  const navigateToTransactionDetail = (transactionId: string) => {
    router.push({
      pathname: '/transaction/[id]',
      params: { id: transactionId },
    });
  };

  /**
   * Formatea el monto para mostrar
   */
  const formatAmount = (amount: number): string => {
    return balanceVisible ? formatCurrency(amount, false) : '****';
  };

  // Cargar datos al montar
  useEffect(() => {
    loadUserSettings();
    loadTransactions();
  }, []);

  return {
    // Estado
    transactions,
    summary,
    loading,
    balanceVisible,
    currentUser,

    // Métodos
    toggleBalanceVisibility,
    navigateToAddIncome,
    navigateToAddExpense,
    navigateToBudget,
    navigateToReports,
    navigateToTransactionDetail,
    formatAmount,
    refreshData: loadTransactions,
  };
};
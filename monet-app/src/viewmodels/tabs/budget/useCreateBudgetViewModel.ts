import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { AuthService } from '@/src/services/auth/AuthService';
import { BudgetService } from '@/src/services/firestore/BudgetService';
import { CategoryService } from '@/src/services/firestore/CategoryService';
import { Category } from '@/src/models/Category';
import { NotificationHelper } from '@/src/utils/notificationHelper';

export const useCreateBudgetViewModel = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const currentUser = AuthService.getCurrentUser();

  /**
   * Carga las categorías de gastos
   */
  const loadCategories = async () => {
    if (!currentUser) return;

    try {
      setLoadingCategories(true);
      // Solo categorías de gastos para presupuestos
      const expenseCategories = await CategoryService.getCategoriesByType(
        currentUser.uid,
        'expense'
      );
      setCategories(expenseCategories);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  /**
   * Formatea el monto mientras se escribe
   */
  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    setAmount(cleaned);
  };

  /**
   * Selecciona una categoría
   */
  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  /**
   * Navega a crear nueva categoría
   */
  const navigateToCreateCategory = () => {
    router.push({
      pathname: '/category/create-category',
      params: { type: 'expense', returnTo: 'budget' },
    });
  };

  /**
   * Obtiene los datos de la categoría seleccionada
   */
  const getSelectedCategoryData = (): Category | undefined => {
    return categories.find(c => c.name === selectedCategory);
  };

  /**
   * Valida el formulario antes de guardar
   */
  const validateForm = (): string | null => {
    if (!amount || parseFloat(amount) <= 0) {
      return 'Ingresa un monto válido';
    }

    if (!description.trim()) {
      return 'Ingresa una descripción';
    }

    if (!selectedCategory) {
      return 'Selecciona una categoría';
    }

    return null;
  };

  /**
   * Guarda el presupuesto en Firebase
   */
  const handleSave = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Debes iniciar sesión');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Error', validationError);
      return;
    }

    setLoading(true);
    try {
      const categoryData = getSelectedCategoryData();
      
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      await BudgetService.createBudget({
        userId: currentUser.uid,
        category: selectedCategory,
        categoryName: categoryData?.displayName || selectedCategory,
        amount: parseFloat(amount),
        color: categoryData?.color || '#6B7280',
        period: 'monthly',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      // Verificar notificaciones de presupuesto después de crear
      NotificationHelper.checkBudgetExceeded(currentUser.uid).catch((error: Error) => {
        console.error('Error al verificar presupuesto:', error);
      });

      Alert.alert(
        '¡Éxito!',
        'Presupuesto creado correctamente',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error al guardar presupuesto:', error);
      Alert.alert('Error', 'No se pudo guardar el presupuesto. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierra la pantalla
   */
  const handleClose = () => {
    if (amount || description || selectedCategory) {
      Alert.alert(
        'Descartar cambios',
        '¿Estás seguro de que quieres salir? Se perderán los cambios.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Descartar', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  // Cargar categorías al montar
  useEffect(() => {
    loadCategories();
  }, []);

  return {
    amount,
    description,
    setDescription,
    selectedCategory,
    categories,
    loading,
    loadingCategories,
    handleAmountChange,
    handleCategorySelect,
    handleSave,
    handleClose,
    navigateToCreateCategory,
    refreshCategories: loadCategories,
  };
};
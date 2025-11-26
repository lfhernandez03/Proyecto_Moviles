// src/viewmodels/tabs/transactions/useAddTransactionViewModel.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { AuthService } from '@/src/services/auth/AuthService';
import { TransactionService } from '@/src/services/firestore/TransactionService';
import { CategoryService } from '@/src/services/firestore/CategoryService';
import { Category } from '@/src/models/Category';

type TransactionType = 'expense' | 'income';

export const useAddTransactionViewModel = () => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const currentUser = AuthService.getCurrentUser();

  /**
   * Carga las categorías del usuario
   */
  const loadCategories = async () => {
    if (!currentUser) return;

    try {
      setLoadingCategories(true);
      const userCategories = await CategoryService.getCategoriesByType(
        currentUser.uid,
        type
      );
      setCategories(userCategories);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  /**
   * Cambia el tipo de transacción
   */
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setSelectedCategory('');
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
      params: { type },
    });
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

    if (type === 'expense' && !selectedCategory) {
      return 'Selecciona una categoría';
    }

    return null;
  };

  /**
   * Guarda la transacción en Firebase
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
      // Preparar datos con todos los campos requeridos
      const transactionData: any = {
        userId: currentUser.uid,
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        category: type === 'expense' ? selectedCategory : (selectedCategory || 'salary'),
        icon: type === 'income' ? 'cash' : 'cart',
        date: new Date().toISOString(),
      };

      console.log('Enviando transacción:', transactionData);

      await TransactionService.createTransaction(transactionData);

      Alert.alert(
        '¡Éxito!',
        `${type === 'income' ? 'Ingreso' : 'Gasto'} guardado correctamente`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error al guardar transacción:', error);
      Alert.alert('Error', 'No se pudo guardar la transacción. Intenta de nuevo.');
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

  // Cargar categorías cuando cambia el tipo
  useEffect(() => {
    loadCategories();
  }, [type]);

  return {
    type,
    amount,
    description,
    setDescription,
    selectedCategory,
    categories,
    loading,
    loadingCategories,
    handleTypeChange,
    handleAmountChange,
    handleCategorySelect,
    handleSave,
    handleClose,
    navigateToCreateCategory,
    refreshCategories: loadCategories,
  };
};
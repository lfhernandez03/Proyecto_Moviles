import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { AuthService } from '@/src/services/auth/AuthService';
import { TransactionService } from '@/src/services/firestore/TransactionService';

type TransactionType = 'expense' | 'income';

interface Category {
  name: string;
  color: string;
  icon: string;
}

export const useAddTransactionViewModel = () => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const currentUser = AuthService.getCurrentUser();

  const categories: Category[] = [
    { name: 'food', color: '#F59E0B', icon: '🍔' },
    { name: 'transport', color: '#3B82F6', icon: '🚗' },
    { name: 'shopping', color: '#EF4444', icon: '🛍️' },
    { name: 'entertainment', color: '#8B5CF6', icon: '🎬' },
    { name: 'bills', color: '#EC4899', icon: '📱' },
    { name: 'health', color: '#EF4444', icon: '⚕️' },
    { name: 'other', color: '#6B7280', icon: '📝' },
  ];

  /**
   * Cambia el tipo de transacción
   */
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    // Si cambia a ingreso, limpiar la categoría seleccionada
    if (newType === 'income') {
      setSelectedCategory('');
    }
  };

  /**
   * Formatea el monto mientras se escribe
   */
  const handleAmountChange = (value: string) => {
    // Solo permitir números y punto decimal
    const cleaned = value.replace(/[^0-9.]/g, '');
    
    // Evitar múltiples puntos decimales
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return;
    }
    
    setAmount(cleaned);
  };

  /**
   * Selecciona una categoría
   */
  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  /**
   * Obtiene el ícono de la categoría seleccionada
   */
  const getSelectedCategoryIcon = (): string => {
    const category = categories.find(c => c.name === selectedCategory);
    return category?.icon || '📝';
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

    // Solo validar categoría si es un gasto
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

    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Error', validationError);
      return;
    }

    setLoading(true);
    try {
      const transactionData: any = {
        userId: currentUser.uid,
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        date: new Date().toISOString(),
      };

      // Solo agregar categoría e ícono si es un gasto
      if (type === 'expense') {
        transactionData.category = selectedCategory;
        transactionData.icon = getSelectedCategoryIcon();
      } else {
        // Para ingresos, usar valores por defecto
        transactionData.category = 'salary';
        transactionData.icon = '💵';
      }

      await TransactionService.createTransaction(transactionData);

      Alert.alert(
        '¡Éxito!',
        `${type === 'income' ? 'Ingreso' : 'Gasto'} guardado correctamente`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
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
          { 
            text: 'Descartar', 
            style: 'destructive',
            onPress: () => router.back() 
          },
        ]
      );
    } else {
      router.back();
    }
  };

  /**
   * Formatea el nombre de categoría para mostrar
   */
  const formatCategoryName = (categoryName: string): string => {
    const translations: { [key: string]: string } = {
      food: 'Alimentación',
      transport: 'Transporte',
      shopping: 'Compras',
      entertainment: 'Entretenimiento',
      bills: 'Servicios',
      health: 'Salud',
      other: 'Otro',
    };
    return translations[categoryName] || categoryName;
  };

  return {
    // Estado
    type,
    amount,
    description,
    setDescription,
    selectedCategory,
    categories,
    loading,

    // Métodos
    handleTypeChange,
    handleAmountChange,
    handleCategorySelect,
    handleSave,
    handleClose,
    formatCategoryName,
  };
};
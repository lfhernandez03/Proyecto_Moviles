import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { AuthService } from '@/src/services/auth/AuthService';
import { GoalService } from '@/src/services/firestore/GoalService';
import { Goal } from '@/src/models/Goal';
import { checkGoalDeadlines } from '../../../utils/notificationHelper';

interface FormData {
  title: string;
  description: string;
  targetAmount: string;
  currentAmount: string;
  deadline: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  targetAmount?: string;
  deadline?: string;
}

export const useCreateGoalViewModel = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const currentUser = AuthService.getCurrentUser();

  /**
   * Maneja cambios en los inputs
   */
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Convierte fecha DD/MM/AAAA a ISO string
   */
  const convertToISODate = (dateString: string): string => {
    const [day, month, year] = dateString.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
  };

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Título
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    // Descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    // Monto objetivo
    const targetAmount = parseFloat(formData.targetAmount);
    if (!formData.targetAmount || isNaN(targetAmount)) {
      newErrors.targetAmount = 'El monto objetivo es obligatorio';
    } else if (targetAmount <= 0) {
      newErrors.targetAmount = 'El monto debe ser mayor a 0';
    } else if (targetAmount < 1000) {
      newErrors.targetAmount = 'El monto debe ser al menos $1,000';
    }

    // Validar que el monto inicial no sea mayor al objetivo
    const currentAmount = parseFloat(formData.currentAmount || '0');
    if (currentAmount > targetAmount) {
      newErrors.targetAmount = 'El monto inicial no puede ser mayor al objetivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Debes iniciar sesión para crear un objetivo');
      return;
    }

    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setLoading(true);

      const goalData: Omit<Goal, 'id'> = {
        userId: currentUser.uid,
        title: formData.title.trim(),
        description: formData.description.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || '0'),
        icon: '🎯',
        deadline: formData.deadline ? convertToISODate(formData.deadline) : undefined,
      };

      await GoalService.createGoal(goalData);

      // Verificar notificaciones de plazos después de crear
      checkGoalDeadlines(currentUser.uid).catch((error: Error) => {
        console.error('Error al verificar plazos:', error);
      });

      Alert.alert(
        '¡Éxito!',
        'Tu objetivo ha sido creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error al crear objetivo:', error);
      Alert.alert(
        'Error',
        'No se pudo crear el objetivo. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
  };
};

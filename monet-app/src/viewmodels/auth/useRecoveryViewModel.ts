import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { AuthService } from '@/src/services/auth/AuthService';
import { Validators } from '@/src/utils/validators';

export const useRecoveryViewModel = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Valida el email ingresado
   */
  const validateEmail = (): string | null => {
    if (!email.trim()) {
      return 'Por favor ingresa tu correo electrónico';
    }

    if (!Validators.isValidEmail(email)) {
      return 'Por favor ingresa un correo electrónico válido';
    }

    return null;
  };

  /**
   * Maneja el envío del correo de recuperación
   */
  const handlePasswordReset = async () => {
    // Validar email
    const validationError = validateEmail();
    if (validationError) {
      Alert.alert('Error', validationError);
      return;
    }

    setLoading(true);
    try {
      // Enviar correo de recuperación
      await AuthService.sendPasswordReset(email);

      // Mostrar mensaje de éxito
      Alert.alert(
        '¡Correo enviado!',
        'Se ha enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada y spam.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(auth)'),
          },
        ]
      );
    } catch (error) {
      const err = error as FirebaseError;
      let message = 'Error al enviar el correo de recuperación';

      switch (err.code) {
        case 'auth/user-not-found':
          message = 'No existe una cuenta con este correo electrónico';
          break;
        case 'auth/invalid-email':
          message = 'Correo electrónico inválido';
          break;
        case 'auth/network-request-failed':
          message = 'Error de conexión. Verifica tu internet';
          break;
        case 'auth/too-many-requests':
          message = 'Demasiados intentos. Por favor intenta más tarde';
          break;
        default:
          message = `Error: ${err.message}`;
      }

      Alert.alert('Error', message);
      console.error('Error de recuperación:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    loading,
    setEmail,
    handlePasswordReset,
  };
};
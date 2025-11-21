// src/viewmodels/auth/useRegisterViewModel.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { AuthService } from '@/src/services/auth/AuthService';
import { UserService } from '@/src/services/firestore/UserService';
import { Validators } from '@/src/utils/validators';

export const useRegisterViewModel = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Valida todos los campos del formulario
   */
  const validateForm = (): string | null => {
    if (!Validators.isValidName(fullname)) {
      return 'Debes ingresar un nombre válido';
    }

    if (!email.trim()) {
      return 'Debes ingresar un correo electrónico';
    }

    if (!Validators.isValidEmail(email)) {
      return 'Correo electrónico inválido';
    }

    if (!Validators.isValidPassword(password)) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!Validators.passwordsMatch(password, confirmPassword)) {
      return 'Las contraseñas no coinciden';
    }

    return null;
  };

  /**
   * Maneja el registro del usuario
   */
  const handleSignUp = async () => {
    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Error', validationError);
      return;
    }

    setLoading(true);
    try {
      // 1. Crear usuario en Firebase Auth
      const user = await AuthService.signUp(email, password, fullname);

      // 2. Guardar información adicional en Firestore
      await UserService.createUser({
        uid: user.uid,
        fullname: fullname.trim(),
        email: email.toLowerCase().trim(),
      });

      // 3. Mostrar mensaje de éxito
      Alert.alert(
        '¡Éxito!',
        'Cuenta creada exitosamente',
        [
          {
            text: 'OK',
            onPress: () => {
              // La navegación se manejará automáticamente por el _layout.tsx
            },
          },
        ]
      );
    } catch (error) {
      const err = error as FirebaseError;
      let message = 'Error al crear la cuenta';

      switch (err.code) {
        case 'auth/email-already-in-use':
          message = 'Este correo ya está registrado';
          break;
        case 'auth/invalid-email':
          message = 'Correo electrónico inválido';
          break;
        case 'auth/weak-password':
          message = 'La contraseña es muy débil';
          break;
        case 'auth/network-request-failed':
          message = 'Error de conexión. Verifica tu internet';
          break;
        case 'permission-denied':
          message = 'Error de permisos. Contacta al administrador';
          break;
        default:
          message = `Error: ${err.message}`;
      }

      Alert.alert('Error', message);
      console.error('Error completo:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    fullname,
    email,
    password,
    confirmPassword,
    loading,
    setFullname,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSignUp,
  };
};
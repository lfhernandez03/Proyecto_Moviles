import { useState } from 'react';
import { router } from 'expo-router';
import { AuthService } from '@/src/services/auth/AuthService';
import { FirebaseError } from 'firebase/app';

export const useLoginViewModel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const signIn = async () => {
    setError(null);

    // Validaciones
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      setError('Correo electrónico inválido');
      return;
    }

    setLoading(true);
    try {
      await AuthService.signIn(email.trim().toLowerCase(), password);
      router.replace('/(tabs)/home');
    } catch (error) {
      const err = error as FirebaseError;
      let message = 'Error al iniciar sesión';

      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Credenciales incorrectas';
          break;
        case 'auth/invalid-email':
          message = 'Correo electrónico inválido';
          break;
        case 'auth/network-request-failed':
          message = 'Error de conexión';
          break;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    signIn,
  };
};
// src/hooks/useProtectedRoute.ts
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

interface UseProtectedRouteProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useProtectedRoute = ({ isAuthenticated, isLoading }: UseProtectedRouteProps) => {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      // Usuario autenticado intentando acceder a páginas de auth
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated && !inAuthGroup) {
      // Usuario no autenticado intentando acceder a páginas protegidas
      router.replace('/(auth)');
    }
  }, [isAuthenticated, segments, isLoading]);
};
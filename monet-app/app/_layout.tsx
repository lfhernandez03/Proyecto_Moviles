// app/_layout.tsx
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import { useAuthViewModel } from '@/src/viewmodels/auth/useAuthViewModel';
import { useProtectedRoute } from '@/hooks/routes/useProtectedRoutes';
import { ActivityIndicator } from 'react-native';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  // ViewModel: Maneja el estado de autenticación
  const { user, initializing, isAuthenticated } = useAuthViewModel();

  // Hook: Maneja la navegación protegida
  useProtectedRoute({ 
    isAuthenticated, 
    isLoading: initializing 
  });

  // Vista: Muestra loading mientras se inicializa
  if (initializing) {
    return <ActivityIndicator size="large" color="#10B981" />;
  }

  // Vista: Renderiza la navegación
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
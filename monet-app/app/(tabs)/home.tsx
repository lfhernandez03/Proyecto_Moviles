import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/FirebaseConfig';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

export default function TabOneScreen() {

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace('/index');
      }
    });

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // El onAuthStateChanged detectará el cambio y redirigirá automáticamente
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">¡Bienvenido!</ThemedText>
      <ThemedText style={styles.subtitle}>Has iniciado sesión correctamente</ThemedText>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSignOut}
      >
        <ThemedText style={styles.buttonText}>Cerrar Sesión</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
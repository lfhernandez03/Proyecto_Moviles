import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { AuthService } from '@/src/services/auth/AuthService';
import { CategoryService } from '@/src/services/firestore/CategoryService';
import { Category } from '@/src/models/Category';

export const useCreateCategoryViewModel = (type: 'income' | 'expense') => {
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [selectedIcon, setSelectedIcon] = useState('cart-outline');
  const [loading, setLoading] = useState(false);

  const currentUser = AuthService.getCurrentUser();

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre interno es obligatorio');
      return false;
    }

    if (name.trim().length < 2) {
      Alert.alert('Error', 'El nombre interno debe tener al menos 2 caracteres');
      return false;
    }

    // Validar que el nombre interno sea en minúsculas y sin espacios
    if (!/^[a-z0-9_-]+$/.test(name.trim())) {
      Alert.alert(
        'Error',
        'El nombre interno debe ser en minúsculas, sin espacios ni caracteres especiales'
      );
      return false;
    }

    if (!displayName.trim()) {
      Alert.alert('Error', 'El nombre para mostrar es obligatorio');
      return false;
    }

    if (displayName.trim().length < 2) {
      Alert.alert('Error', 'El nombre para mostrar debe tener al menos 2 caracteres');
      return false;
    }

    return true;
  };

  /**
   * Guarda la categoría
   */
  const handleSave = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Debes iniciar sesión para crear una categoría');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Verificar si ya existe una categoría con ese nombre
      const existingCategories = await CategoryService.getCategoriesByType(
        currentUser.uid,
        type
      );

      const categoryExists = existingCategories.some(
        (cat) => cat.name.toLowerCase() === name.trim().toLowerCase()
      );

      if (categoryExists) {
        Alert.alert('Error', 'Ya existe una categoría con ese nombre');
        return;
      }

      const categoryData: Omit<Category, 'id'> = {
        userId: currentUser.uid,
        name: name.trim().toLowerCase(),
        displayName: displayName.trim(),
        type,
        color: selectedColor,
        isCustom: true,
      };

      await CategoryService.createCategory(categoryData);

      Alert.alert(
        '¡Éxito!',
        'Categoría creada correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error al crear categoría:', error);
      Alert.alert('Error', 'No se pudo crear la categoría. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    displayName,
    selectedColor,
    selectedIcon,
    loading,
    setName,
    setDisplayName,
    setSelectedColor,
    setSelectedIcon,
    handleSave,
  };
};
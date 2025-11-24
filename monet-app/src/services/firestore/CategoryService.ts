import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { Category, DEFAULT_CATEGORIES } from '@/src/models/Category';

export class CategoryService {
  private static COLLECTION = 'categories';

  /**
   * Obtiene todas las categorías (predeterminadas + personalizadas del usuario)
   */
  static async getAllCategories(userId: string): Promise<Category[]> {
    try {
      console.log('Obteniendo categorías para usuario:', userId);
      
      // Obtener categorías personalizadas del usuario
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const customCategories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];

      console.log('Categorías personalizadas encontradas:', customCategories.length);

      // Combinar categorías predeterminadas con personalizadas
      return [...DEFAULT_CATEGORIES, ...customCategories];
    } catch (error: any) {
      console.error('Error al obtener categorías:', error);
      
      // Si es error de permisos, informar al usuario
      if (error.code === 'permission-denied') {
        console.warn('Permisos insuficientes para leer categorías. Usando categorías predeterminadas.');
      }
      
      // Si hay error, devolver solo las predeterminadas
      return DEFAULT_CATEGORIES;
    }
  }

  /**
   * Obtiene categorías filtradas por tipo (expense o income)
   */
  static async getCategoriesByType(
    userId: string, 
    type: 'expense' | 'income'
  ): Promise<Category[]> {
    try {
      const allCategories = await this.getAllCategories(userId);
      
      // Filtrar por tipo
      const filtered = allCategories.filter(
        cat => cat.type === type || cat.type === 'both'
      );

      console.log(`Categorías de tipo ${type}:`, filtered.length);
      return filtered;
    } catch (error) {
      console.error('Error al filtrar categorías:', error);
      return DEFAULT_CATEGORIES.filter(
        cat => cat.type === type || cat.type === 'both'
      );
    }
  }

  /**
   * Crea una nueva categoría personalizada
   */
  static async createCategory(
    category: Omit<Category, 'id' | 'createdAt'>
  ): Promise<string> {
    try {
      const categoryData = {
        ...category,
        isCustom: true,
        createdAt: new Date().toISOString(),
      };

      console.log('Creando categoría:', categoryData);

      const docRef = await addDoc(
        collection(db, this.COLLECTION),
        categoryData
      );
      
      console.log('Categoría creada con ID:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('Error al crear categoría:', error);
      
      if (error.code === 'permission-denied') {
        throw new Error('No tienes permisos para crear categorías. Verifica la configuración de Firebase.');
      }
      
      throw error;
    }
  }

  /**
   * Elimina una categoría personalizada
   */
  static async deleteCategory(categoryId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION, categoryId));
      console.log('Categoría eliminada:', categoryId);
    } catch (error: any) {
      console.error('Error al eliminar categoría:', error);
      
      if (error.code === 'permission-denied') {
        throw new Error('No tienes permisos para eliminar esta categoría.');
      }
      
      throw error;
    }
  }

  /**
   * Obtiene una categoría por nombre
   */
  static async getCategoryByName(
    userId: string, 
    categoryName: string
  ): Promise<Category | null> {
    try {
      const allCategories = await this.getAllCategories(userId);
      return allCategories.find(cat => cat.name === categoryName) || null;
    } catch (error) {
      console.error('Error al buscar categoría:', error);
      return DEFAULT_CATEGORIES.find(cat => cat.name === categoryName) || null;
    }
  }

  /**
   * Verifica si una categoría es personalizada
   */
  static async isCustomCategory(userId: string, categoryName: string): Promise<boolean> {
    try {
      const category = await this.getCategoryByName(userId, categoryName);
      return category?.isCustom || false;
    } catch (error) {
      console.error('Error al verificar categoría:', error);
      return false;
    }
  }
}
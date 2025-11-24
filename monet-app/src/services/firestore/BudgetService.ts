import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { Budget } from '@/src/models/Budget';
import { TransactionService } from './TransactionService';

export class BudgetService {
  private static COLLECTION = 'budgets';

  /**
   * Crea un nuevo presupuesto
   */
  static async createBudget(
    budget: Omit<Budget, 'id' | 'createdAt' | 'spent'>
  ): Promise<string> {
    try {
      const budgetData = {
        ...budget,
        spent: 0,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(
        collection(db, this.COLLECTION),
        budgetData
      );
      
      console.log('Presupuesto creado con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error en createBudget:', error);
      throw error;
    }
  }

  /**
   * Obtiene un presupuesto por ID
   */
  static async getBudgetById(id: string): Promise<Budget | null> {
    try {
      const docSnap = await getDoc(doc(db, this.COLLECTION, id));
      if (!docSnap.exists()) return null;
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Budget;
    } catch (error) {
      console.error('Error en getBudgetById:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los presupuestos de un usuario
   */
  static async getUserBudgets(userId: string): Promise<Budget[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const budgets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Budget[];

      // Calcular el gasto actual para cada presupuesto
      const budgetsWithSpent = await Promise.all(
        budgets.map(async (budget) => {
          const spent = await this.calculateSpentAmount(userId, budget);
          return { ...budget, spent };
        })
      );

      return budgetsWithSpent;
    } catch (error) {
      console.error('Error en getUserBudgets:', error);
      throw error;
    }
  }

  /**
   * Calcula el monto gastado en una categoría para el período del presupuesto
   */
  private static async calculateSpentAmount(
    userId: string,
    budget: Budget
  ): Promise<number> {
    try {
      // Obtener transacciones del mes actual
      const transactions = await TransactionService.getMonthTransactions(userId);
      
      // Filtrar por categoría y tipo expense
      const categoryTransactions = transactions.filter(
        t => t.type === 'expense' && t.category === budget.category
      );

      // Sumar los montos
      const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      return total;
    } catch (error) {
      console.error('Error calculando gasto:', error);
      return 0;
    }
  }

  /**
   * Actualiza un presupuesto
   */
  static async updateBudget(
    budgetId: string,
    data: Partial<Budget>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION, budgetId), data);
    } catch (error) {
      console.error('Error en updateBudget:', error);
      throw error;
    }
  }

  /**
   * Elimina un presupuesto
   */
  static async deleteBudget(budgetId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION, budgetId));
    } catch (error) {
      console.error('Error en deleteBudget:', error);
      throw error;
    }
  }
}
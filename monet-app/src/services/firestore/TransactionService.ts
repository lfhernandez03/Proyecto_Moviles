// src/services/firestore/TransactionService.ts
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { Transaction } from '@/src/models/Transaction';

export class TransactionService {
  private static COLLECTION = 'transactions';

  /**
   * Crea una nueva transacción
   */
  static async createTransaction(
    transaction: Omit<Transaction, 'id' | 'createdAt'>
  ): Promise<string> {
    try {
      const transactionData = {
        ...transaction,
        createdAt: new Date().toISOString(),
      };

      console.log('Creando transacción:', transactionData);

      const docRef = await addDoc(
        collection(db, this.COLLECTION),
        transactionData
      );
      
      console.log('Transacción creada con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error en createTransaction:', error);
      throw error;
    }
  }

  /**
   * Obtiene una transacción por ID
   */
  static async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const docSnap = await getDoc(doc(db, this.COLLECTION, id));
      if (!docSnap.exists()) return null;
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Transaction;
    } catch (error) {
      console.error('Error en getTransactionById:', error);
      throw error;
    }
  }

  /**
   * Obtiene las transacciones de un usuario
   */
  static async getUserTransactions(
    userId: string,
    limitCount: number = 50
  ): Promise<Transaction[]> {
    try {
      console.log('Obteniendo transacciones para userId:', userId);
      
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      console.log('Documentos encontrados:', querySnapshot.size);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
    } catch (error) {
      console.error('Error en getUserTransactions:', error);
      throw error;
    }
  }

  /**
   * Obtiene transacciones del mes actual
   */
  static async getMonthTransactions(userId: string): Promise<Transaction[]> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        where('date', '>=', startOfMonth.toISOString()),
        where('date', '<=', endOfMonth.toISOString()),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
    } catch (error) {
      console.error('Error en getMonthTransactions:', error);
      throw error;
    }
  }

  /**
   * Actualiza una transacción
   */
  static async updateTransaction(
    transactionId: string,
    data: Partial<Transaction>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION, transactionId), data);
    } catch (error) {
      console.error('Error en updateTransaction:', error);
      throw error;
    }
  }

  /**
   * Elimina una transacción
   */
  static async deleteTransaction(transactionId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION, transactionId));
    } catch (error) {
      console.error('Error en deleteTransaction:', error);
      throw error;
    }
  }
}
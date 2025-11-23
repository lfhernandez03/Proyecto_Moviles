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
  updateDoc,
  deleteDoc,
  Timestamp
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
    const transactionData = {
      ...transaction,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(
      collection(db, this.COLLECTION),
      transactionData
    );
    return docRef.id;
  }

  /**
   * Obtiene las transacciones de un usuario
   */
  static async getUserTransactions(
    userId: string,
    limitCount: number = 10
  ): Promise<Transaction[]> {
    const q = query(
      collection(db, this.COLLECTION),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
  }

  /**
   * Obtiene transacciones del mes actual
   */
  static async getMonthTransactions(userId: string): Promise<Transaction[]> {
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
  }

  /**
   * Actualiza una transacción
   */
  static async updateTransaction(
    transactionId: string,
    data: Partial<Transaction>
  ): Promise<void> {
    await updateDoc(doc(db, this.COLLECTION, transactionId), data);
  }

  /**
   * Elimina una transacción
   */
  static async deleteTransaction(transactionId: string): Promise<void> {
    await deleteDoc(doc(db, this.COLLECTION, transactionId));
  }
}
// src/services/firestore/GoalService.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { Goal } from '@/src/models/Goal';

export class GoalService {
  private static readonly COLLECTION_NAME = 'goals';

  /**
   * Crea un nuevo objetivo
   */
  static async createGoal(goal: Omit<Goal, 'id'>): Promise<string> {
    try {
      const goalData = {
        ...goal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(
        collection(db, this.COLLECTION_NAME),
        goalData
      );

      console.log('✅ Objetivo creado:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error al crear objetivo:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los objetivos de un usuario
   */
  static async getUserGoals(userId: string): Promise<Goal[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const goals: Goal[] = [];

      querySnapshot.forEach((doc) => {
        goals.push({
          id: doc.id,
          ...doc.data(),
        } as Goal);
      });

      console.log(`✅ ${goals.length} objetivos cargados`);
      return goals;
    } catch (error) {
      console.error('❌ Error al obtener objetivos:', error);
      throw error;
    }
  }

  /**
   * Obtiene un objetivo por ID
   */
  static async getGoalById(goalId: string): Promise<Goal | null> {
    try {
      const goalRef = doc(db, this.COLLECTION_NAME, goalId);
      const goalDoc = await getDoc(goalRef);

      if (goalDoc.exists()) {
        return {
          id: goalDoc.id,
          ...goalDoc.data(),
        } as Goal;
      }

      return null;
    } catch (error) {
      console.error('❌ Error al obtener objetivo:', error);
      throw error;
    }
  }

  /**
   * Actualiza un objetivo
   */
  static async updateGoal(
    goalId: string,
    updates: Partial<Goal>
  ): Promise<void> {
    try {
      const goalRef = doc(db, this.COLLECTION_NAME, goalId);

      await updateDoc(goalRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      console.log('✅ Objetivo actualizado:', goalId);
    } catch (error) {
      console.error('❌ Error al actualizar objetivo:', error);
      throw error;
    }
  }

  /**
   * Agrega fondos a un objetivo
   */
  static async addFunds(goalId: string, amount: number): Promise<void> {
    try {
      const goal = await this.getGoalById(goalId);

      if (!goal) {
        throw new Error('Objetivo no encontrado');
      }

      const newAmount = goal.currentAmount + amount;
      const updates: Partial<Goal> = {
        currentAmount: newAmount,
        updatedAt: new Date().toISOString(),
      };

      // Si alcanzó el objetivo, marcar como completado
      const wasNotCompleted = !goal.completedAt;
      if (newAmount >= goal.targetAmount && wasNotCompleted) {
        updates.completedAt = new Date().toISOString();
        
        // Notificar que se completó el objetivo
        const { NotificationHelper } = await import('../../utils/notificationHelper');
        await NotificationHelper.notifyGoalCompleted(goal.userId, goalId, goal.title);
      }

      await this.updateGoal(goalId, updates);
      console.log('✅ Fondos agregados:', amount);
    } catch (error) {
      console.error('❌ Error al agregar fondos:', error);
      throw error;
    }
  }

  /**
   * Elimina un objetivo
   */
  static async deleteGoal(goalId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, goalId));
      console.log('✅ Objetivo eliminado:', goalId);
    } catch (error) {
      console.error('❌ Error al eliminar objetivo:', error);
      throw error;
    }
  }
}
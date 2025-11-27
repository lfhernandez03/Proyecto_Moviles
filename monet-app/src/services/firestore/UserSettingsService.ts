// src/services/firestore/UserSettingsService.ts
import { db } from '../../../FirebaseConfig';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { UserSettings } from '../../models/UserSettings';

const COLLECTION_NAME = 'userSettings';

export const UserSettingsService = {
  // Crear configuración por defecto para nuevo usuario
  async createDefaultSettings(userId: string): Promise<void> {
    const settingsRef = doc(db, COLLECTION_NAME, userId);
    
    const defaultSettings = {
      userId,
      pushNotifications: true,
      goalDeadlineNotifications: true,
      budgetExceededNotifications: true,
      dailyReminder: false,
      hideAmounts: false,
      biometricAuth: false,
      theme: 'auto',
      language: 'es',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(settingsRef, defaultSettings);
  },

  // Obtener configuración del usuario
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const settingsRef = doc(db, COLLECTION_NAME, userId);
      const settingsSnap = await getDoc(settingsRef);

      if (!settingsSnap.exists()) {
        // Si no existe, crear configuración por defecto
        await this.createDefaultSettings(userId);
        const newSettingsSnap = await getDoc(settingsRef);
        const data = newSettingsSnap.data();
        
        return {
          ...data,
          createdAt: data?.createdAt?.toDate() || new Date(),
          updatedAt: data?.updatedAt?.toDate() || new Date(),
        } as UserSettings;
      }

      const data = settingsSnap.data();
      return {
        ...data,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
      } as UserSettings;
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  },

  // Actualizar configuración
  async updateSettings(
    userId: string,
    settings: Partial<UserSettings>
  ): Promise<void> {
    try {
      const settingsRef = doc(db, COLLECTION_NAME, userId);
      
      await updateDoc(settingsRef, {
        ...settings,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Actualizar una configuración específica
  async updateSetting(
    userId: string,
    settingKey: string,
    value: any
  ): Promise<void> {
    try {
      const settingsRef = doc(db, COLLECTION_NAME, userId);
      
      await updateDoc(settingsRef, {
        [settingKey]: value,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  },
};

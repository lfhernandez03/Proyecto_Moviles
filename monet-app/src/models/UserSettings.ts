// src/models/UserSettings.ts
export interface UserSettings {
  userId: string;
  // Notificaciones
  pushNotifications: boolean;
  goalDeadlineNotifications: boolean;
  budgetExceededNotifications: boolean;
  dailyReminder: boolean;
  // Privacidad
  hideAmounts: boolean;
  // Otros
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  createdAt: Date;
  updatedAt: Date;
}

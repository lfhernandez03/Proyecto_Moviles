// src/models/Notification.ts
export interface Notification {
  id: string;
  userId: string;
  type: 'goal_deadline' | 'budget_exceeded' | 'goal_completed' | 'daily_reminder' | 'other';
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string; // ID del objetivo, presupuesto, etc.
  createdAt: Date;
}

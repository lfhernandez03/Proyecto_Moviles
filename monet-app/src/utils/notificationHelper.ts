import { NotificationService } from '../services/firestore/NotificationService';
import { GoalService } from '../services/firestore/GoalService';
import { BudgetService } from '../services/firestore/BudgetService';
import { UserSettingsService } from '../services/firestore/UserSettingsService';

/**
 * Verificar objetivos vencidos y crear notificaciones
 */
export async function checkGoalDeadlines(userId: string): Promise<void> {
  try {
    // Verificar si las notificaciones están habilitadas
    const settings = await UserSettingsService.getUserSettings(userId);
    if (!settings?.pushNotifications || !settings?.goalDeadlineNotifications) {
      return;
    }

    const goals = await GoalService.getUserGoals(userId);
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    // Obtener notificaciones existentes del usuario para evitar duplicados
    const existingNotifications = await NotificationService.getUserNotifications(userId);
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    for (const goal of goals) {
      // Solo revisar objetivos activos (no completados)
      if (goal.completedAt) continue;

      if (goal.deadline) {
        const deadline = new Date(goal.deadline);
        
        // Verificar si ya existe una notificación reciente para este objetivo
        const hasRecentNotification = existingNotifications.some(
          notif => notif.type === 'goal_deadline' && 
                   notif.relatedId === goal.id && 
                   new Date(notif.createdAt) >= oneDayAgo
        );

        if (hasRecentNotification) continue;
        
        // Objetivo ya vencido
        if (deadline < today && !goal.completedAt) {
          await NotificationService.createNotification(
            userId,
            'goal_deadline',
            'Objetivo vencido',
            `Tu objetivo "${goal.title}" ha pasado su fecha límite. ¡Actualízalo o revisa tu progreso!`,
            goal.id
          );
        }
        // Objetivo próximo a vencer (dentro de 3 días)
        else if (deadline >= today && deadline <= threeDaysFromNow) {
          const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          await NotificationService.createNotification(
            userId,
            'goal_deadline',
            'Objetivo próximo a vencer',
            `Tu objetivo "${goal.title}" vence en ${daysLeft} día${daysLeft !== 1 ? 's' : ''}. ¡Sigue adelante!`,
            goal.id
          );
        }
      }
    }
  } catch (error) {
    console.error('Error checking goal deadlines:', error);
  }
}

/**
 * Verificar presupuestos excedidos y crear notificaciones
 */
export async function checkBudgetExceeded(userId: string): Promise<void> {
  try {
    // Verificar si las notificaciones están habilitadas
    const settings = await UserSettingsService.getUserSettings(userId);
    if (!settings?.pushNotifications || !settings?.budgetExceededNotifications) {
      return;
    }

    const budgets = await BudgetService.getUserBudgets(userId);

    // Obtener notificaciones existentes del usuario para evitar duplicados
    const existingNotifications = await NotificationService.getUserNotifications(userId);
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    for (const budget of budgets) {
      const percentageUsed = (budget.spent / budget.amount) * 100;

      // Verificar si ya existe una notificación reciente para este presupuesto
      const hasRecentNotification = existingNotifications.some(
        notif => notif.type === 'budget_exceeded' && 
                 notif.relatedId === budget.id && 
                 new Date(notif.createdAt) >= oneDayAgo
      );

      if (hasRecentNotification) continue;

      // Presupuesto excedido (>100%)
      if (percentageUsed > 100) {
        await NotificationService.createNotification(
          userId,
          'budget_exceeded',
          'Presupuesto excedido',
          `Has excedido el presupuesto de "${budget.categoryName}" en ${(percentageUsed - 100).toFixed(0)}%.`,
          budget.id
        );
      }
      // Presupuesto por exceder (>90%)
      else if (percentageUsed >= 90) {
        await NotificationService.createNotification(
          userId,
          'budget_exceeded',
          'Presupuesto casi agotado',
          `Has usado el ${percentageUsed.toFixed(0)}% del presupuesto de "${budget.categoryName}".`,
          budget.id
        );
      }
    }
  } catch (error) {
    console.error('Error checking budget exceeded:', error);
  }
}

/**
 * Notificar cuando se completa un objetivo
 */
export async function notifyGoalCompleted(userId: string, goalId: string, goalTitle: string): Promise<void> {
  try {
    const settings = await UserSettingsService.getUserSettings(userId);
    if (!settings?.pushNotifications) {
      return;
    }

    await NotificationService.createNotification(
      userId,
      'goal_completed',
      '¡Objetivo completado!',
      `¡Felicidades! Has completado tu objetivo "${goalTitle}". ¡Sigue así!`,
      goalId
    );
  } catch (error) {
    console.error('Error notifying goal completed:', error);
  }
}

/**
 * Recordatorio diario
 */
export async function sendDailyReminder(userId: string): Promise<void> {
  try {
    const settings = await UserSettingsService.getUserSettings(userId);
    if (!settings?.pushNotifications || !settings?.dailyReminder) {
      return;
    }

    await NotificationService.createNotification(
      userId,
      'daily_reminder',
      'Revisa tus finanzas',
      '¡Buenos días! No olvides revisar tus gastos y mantener tus presupuestos al día.',
      undefined
    );
  } catch (error) {
    console.error('Error sending daily reminder:', error);
  }
}

/**
 * Ejecutar todas las verificaciones de notificaciones
 */
export async function checkAllNotifications(userId: string): Promise<void> {
  try {
    await Promise.all([
      checkGoalDeadlines(userId),
      checkBudgetExceeded(userId),
    ]);
  } catch (error) {
    console.error('Error checking all notifications:', error);
  }
}

// Exportación por defecto para compatibilidad con código existente
export const NotificationHelper = {
  checkGoalDeadlines,
  checkBudgetExceeded,
  notifyGoalCompleted,
  sendDailyReminder,
  checkAllNotifications,
};
// src/services/firestore/NotificationService.ts
import { db } from '../../../FirebaseConfig';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { Notification } from '../../models/Notification';

const COLLECTION_NAME = 'notifications';

export const NotificationService = {
  // Crear notificación
  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    relatedId?: string
  ): Promise<string> {
    try {
      const notificationData = {
        userId,
        type,
        title,
        message,
        isRead: false,
        relatedId: relatedId || null,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), notificationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Obtener notificaciones del usuario
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        } as Notification;
      });
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  },

  // Obtener notificaciones no leídas
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        where('isRead', '==', false),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        } as Notification;
      });
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      throw error;
    }
  },

  // Marcar notificación como leída
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, COLLECTION_NAME, notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Marcar todas como leídas
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const unreadNotifications = await this.getUnreadNotifications(userId);
      
      const updatePromises = unreadNotifications.map((notification) =>
        this.markAsRead(notification.id)
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Eliminar notificación
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Eliminar todas las notificaciones del usuario
  async deleteAllNotifications(userId: string): Promise<void> {
    try {
      const notifications = await this.getUserNotifications(userId);
      
      const deletePromises = notifications.map((notification) =>
        this.deleteNotification(notification.id)
      );

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  },
};

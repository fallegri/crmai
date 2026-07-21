import { Notification } from '../../domain';
export const NOTIFICATION_REPOSITORY_PORT = 'NotificationRepositoryPort';
export interface NotificationRepositoryPort {
  create(data: { userId: string; type: string; title: string; body?: string; channel?: string; metadata?: any }): Promise<Notification>;
  findUnreadByUserId(userId: string): Promise<Notification[]>;
  findByUserId(userId: string, cursor?: string, limit?: number): Promise<{ notifications: Notification[]; nextCursor?: string }>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<number>;
}

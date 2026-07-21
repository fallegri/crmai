import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_REPOSITORY_PORT, NotificationRepositoryPort } from '../ports';
import { Notification } from '../../domain';
@Injectable()
export class NotificationUseCase {
  constructor(@Inject(NOTIFICATION_REPOSITORY_PORT) private readonly repo: NotificationRepositoryPort) {}
  async send(data: { userId: string; type: string; title: string; body?: string; channel?: string; metadata?: any }): Promise<Notification> { return this.repo.create(data); }
  async getUnread(userId: string): Promise<Notification[]> { return this.repo.findUnreadByUserId(userId); }
  async getAll(userId: string, cursor?: string, limit = 20): Promise<{ notifications: Notification[]; nextCursor?: string }> { return this.repo.findByUserId(userId, cursor, limit); }
  async markAsRead(notificationId: string): Promise<void> { await this.repo.markAsRead(notificationId); }
  async markAllAsRead(userId: string): Promise<{ count: number }> { const count = await this.repo.markAllAsRead(userId); return { count }; }
}

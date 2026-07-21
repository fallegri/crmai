import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NotificationRepositoryPort } from '../../application/ports';
import { Notification } from '../../domain';
@Injectable()
export class PrismaNotificationRepositoryAdapter implements NotificationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any): Promise<Notification> { const n = await this.prisma.notification.create({ data }); return this.toDomain(n); }
  async findUnreadByUserId(userId: string): Promise<Notification[]> { const notifs = await this.prisma.notification.findMany({ where: { userId, readAt: null }, orderBy: { createdAt: 'desc' } }); return notifs.map(n => this.toDomain(n)); }
  async findByUserId(userId: string, cursor?: string, limit = 20): Promise<{ notifications: Notification[]; nextCursor?: string }> {
    const query: any = { where: { userId }, take: limit + 1, orderBy: { createdAt: 'desc' as const } };
    if (cursor) { query.cursor = { id: cursor }; query.skip = 1; }
    const notifications = await this.prisma.notification.findMany(query);
    const hasMore = notifications.length > limit; const items = hasMore ? notifications.slice(0, limit) : notifications;
    return { notifications: items.map(n => this.toDomain(n)), nextCursor: hasMore ? items[items.length - 1].id : undefined };
  }
  async markAsRead(notificationId: string): Promise<void> { await this.prisma.notification.update({ where: { id: notificationId }, data: { readAt: new Date() } }); }
  async markAllAsRead(userId: string): Promise<number> { const result = await this.prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } }); return result.count; }
  private toDomain(n: any): Notification { return new Notification(n.id, n.userId, n.type, n.title, n.body, n.channel, n.metadata, n.readAt, n.createdAt); }
}

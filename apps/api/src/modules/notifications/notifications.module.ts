import { Module } from '@nestjs/common';
import { NotificationUseCase } from './application/use-cases';
import { NOTIFICATION_REPOSITORY_PORT } from './application/ports';
import { PrismaNotificationRepositoryAdapter } from './infrastructure/adapters';
import { NotificationController } from './interface/controllers';
@Module({ controllers: [NotificationController], providers: [{ provide: NOTIFICATION_REPOSITORY_PORT, useClass: PrismaNotificationRepositoryAdapter }, NotificationUseCase], exports: [NotificationUseCase] })
export class NotificationsModule {}

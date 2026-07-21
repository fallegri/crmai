import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationUseCase } from '../../application/use-cases';
import { JwtAuthGuard, CurrentUser } from '../../../identity/interface';
import { SendNotificationDto } from '../dto';
@ApiTags('Notifications') @Controller('notifications') @UseGuards(JwtAuthGuard) @ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationUseCase: NotificationUseCase) {}
  @Post() @ApiOperation({ summary: 'Send a notification' }) async send(@Body() dto: SendNotificationDto) { return this.notificationUseCase.send(dto); }
  @Get('unread') @ApiOperation({ summary: 'Get unread notifications' }) async getUnread(@CurrentUser('sub') userId: string) { return this.notificationUseCase.getUnread(userId); }
  @Get() @ApiOperation({ summary: 'Get all notifications' }) async getAll(@CurrentUser('sub') userId: string, @Query('cursor') cursor?: string, @Query('limit') limit = 20) { return this.notificationUseCase.getAll(userId, cursor, +limit); }
  @Put(':id/read') @ApiOperation({ summary: 'Mark notification as read' }) async markAsRead(@Param('id') id: string) { await this.notificationUseCase.markAsRead(id); return { message: 'Marked as read' }; }
  @Put('read-all') @ApiOperation({ summary: 'Mark all notifications as read' }) async markAllAsRead(@CurrentUser('sub') userId: string) { return this.notificationUseCase.markAllAsRead(userId); }
}

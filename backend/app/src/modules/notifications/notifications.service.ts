import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { NotificationResponse } from './dto/notification.response';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByOrder(orderId: string): Promise<NotificationResponse[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });

    return notifications.map((notification) => this.toResponse(notification));
  }

  async record(
    orderId: string,
    type: string,
    message: string,
  ): Promise<NotificationResponse> {
    const created = await this.prisma.notification.create({
      data: { orderId, type, message },
    });

    return this.toResponse(created);
  }

  private toResponse(notification: {
    id: string;
    orderId: string;
    type: string;
    message: string;
    createdAt: Date;
  }): NotificationResponse {
    return {
      id: notification.id,
      orderId: notification.orderId,
      type: notification.type,
      message: notification.message,
      createdAt: notification.createdAt,
    };
  }
}

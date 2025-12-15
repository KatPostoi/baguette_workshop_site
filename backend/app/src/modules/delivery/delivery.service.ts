import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ScheduleDeliveryDto } from './dto/schedule-delivery.dto';
import { DeliveryBookingResponse } from './dto/delivery-response.dto';
import { OrderStatus } from '@prisma/client';
import { MockDeliveryProvider } from './providers/mock-delivery.provider';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly notificationsService: NotificationsService,
    private readonly deliveryProvider: MockDeliveryProvider,
  ) {}

  async schedule(dto: ScheduleDeliveryDto): Promise<DeliveryBookingResponse> {
    await this.ordersService.updateStatus(dto.orderId, OrderStatus.SHIPPED);

    const booking = await this.deliveryProvider.schedule(dto.orderId, dto.courierService);

    await this.notificationsService.record(
      dto.orderId,
      'delivery_scheduled',
      `Delivery scheduled via ${booking.courierService}`,
    );

    return {
      orderId: booking.orderId,
      status: 'scheduled',
      trackingCode: booking.trackingCode,
      courierService: booking.courierService,
      eta: booking.eta,
    };
  }
}

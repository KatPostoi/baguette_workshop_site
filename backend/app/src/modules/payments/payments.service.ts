import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MockPaymentGateway } from './providers/mock-payment.gateway';
import { MockPaymentDto } from './dto/mock-payment.dto';
import { PaymentReceiptResponse } from './dto/payment-response.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly notificationsService: NotificationsService,
    private readonly paymentGateway: MockPaymentGateway,
  ) {}

  async processMockPayment(
    dto: MockPaymentDto,
  ): Promise<PaymentReceiptResponse> {
    const order = await this.ordersService.getById(dto.orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be paid in current status');
    }

    if (dto.amount < order.total) {
      throw new BadRequestException('Amount is less than order total');
    }

    const receipt = await this.paymentGateway.charge(dto.orderId, dto.amount);
    await this.ordersService.updateStatus(dto.orderId, OrderStatus.PAID);

    await this.notificationsService.record(
      dto.orderId,
      'payment_received',
      `Mock payment received: ${dto.amount}`,
    );

    return {
      orderId: dto.orderId,
      status: 'success',
      transactionId: receipt.transactionId,
      processedAt: receipt.processedAt.toISOString(),
      amount: receipt.amount,
      method: receipt.method,
    };
  }
}

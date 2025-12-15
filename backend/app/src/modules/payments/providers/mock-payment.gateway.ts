import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PaymentGateway, PaymentReceipt } from './payment.gateway';

@Injectable()
export class MockPaymentGateway implements PaymentGateway {
  async charge(orderId: string, amount: number): Promise<PaymentReceipt> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return {
      orderId,
      amount,
      transactionId: randomUUID(),
      processedAt: new Date(),
      method: 'mock-terminal',
    };
  }
}

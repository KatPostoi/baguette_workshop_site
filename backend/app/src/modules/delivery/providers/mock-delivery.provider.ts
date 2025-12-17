import { Injectable } from '@nestjs/common';
import { DeliveryBooking, DeliveryProvider } from './delivery-provider';

@Injectable()
export class MockDeliveryProvider implements DeliveryProvider {
  async schedule(
    orderId: string,
    courierService = 'MockExpress',
  ): Promise<DeliveryBooking> {
    await Promise.resolve();
    const trackingCode = `TRK-${orderId.slice(0, 8).toUpperCase()}`;
    return {
      orderId,
      trackingCode,
      courierService,
      eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
}

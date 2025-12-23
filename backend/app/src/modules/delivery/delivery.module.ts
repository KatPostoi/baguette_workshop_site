import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { OrdersModule } from '../orders/orders.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MockDeliveryProvider } from './providers/mock-delivery.provider';

@Module({
  imports: [OrdersModule, NotificationsModule, AuthModule],
  controllers: [DeliveryController],
  providers: [DeliveryService, MockDeliveryProvider],
})
export class DeliveryModule {}

import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { OrdersModule } from '../orders/orders.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MockPaymentGateway } from './providers/mock-payment.gateway';

@Module({
  imports: [OrdersModule, NotificationsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, MockPaymentGateway],
  exports: [MockPaymentGateway],
})
export class PaymentsModule {}

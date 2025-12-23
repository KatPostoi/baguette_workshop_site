import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { OrdersModule } from '../orders/orders.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MockPaymentGateway } from './providers/mock-payment.gateway';

@Module({
  imports: [OrdersModule, NotificationsModule, AuthModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, MockPaymentGateway],
  exports: [MockPaymentGateway],
})
export class PaymentsModule {}

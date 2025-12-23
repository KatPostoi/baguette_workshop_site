import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CatalogModule } from '../catalog/catalog.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';
import { AdminOrdersController } from './admin-orders.controller';
import { AuditModule } from '../audit/audit.module';
import { CustomFramesModule } from '../custom-frames/custom-frames.module';

@Module({
  imports: [
    CatalogModule,
    NotificationsModule,
    AuthModule,
    AuditModule,
    CustomFramesModule,
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

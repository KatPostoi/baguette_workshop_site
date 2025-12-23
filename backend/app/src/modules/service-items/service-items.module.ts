import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ServiceItemsController } from './service-items.controller';
import { ServiceItemsService } from './service-items.service';
import { AdminServiceItemsController } from './admin-service-items.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuthModule, AuditModule],
  controllers: [ServiceItemsController, AdminServiceItemsController],
  providers: [ServiceItemsService],
  exports: [ServiceItemsService],
})
export class ServiceItemsModule {}

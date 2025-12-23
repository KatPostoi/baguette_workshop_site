import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StylesController } from './styles.controller';
import { StylesService } from './styles.service';
import { AdminStylesController } from './admin-styles.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuthModule, AuditModule],
  controllers: [StylesController, AdminStylesController],
  providers: [StylesService],
  exports: [StylesService],
})
export class StylesModule {}

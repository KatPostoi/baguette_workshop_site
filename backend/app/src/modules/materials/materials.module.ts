import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MaterialsController } from './materials.controller';
import { AdminMaterialsController } from './admin-materials.controller';
import { MaterialsService } from './materials.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuthModule, AuditModule],
  controllers: [MaterialsController, AdminMaterialsController],
  providers: [MaterialsService],
  exports: [MaterialsService],
})
export class MaterialsModule {}

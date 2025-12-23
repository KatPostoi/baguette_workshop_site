import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';
import { CustomFramesController } from './custom-frames.controller';
import { CustomFramesService } from './custom-frames.service';

@Module({
  imports: [PrismaModule, AuditModule, AuthModule],
  controllers: [CustomFramesController],
  providers: [CustomFramesService],
  exports: [CustomFramesService],
})
export class CustomFramesModule {}

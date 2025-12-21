import { Module } from '@nestjs/common';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { CatalogModule } from '../catalog/catalog.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CatalogModule, AuthModule],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}

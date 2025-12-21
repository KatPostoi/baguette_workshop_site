import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { envValidationSchema } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './database/prisma.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { StylesModule } from './modules/styles/styles.module';
import { ServiceItemsModule } from './modules/service-items/service-items.module';
import { UsersModule } from './modules/users/users.module';
import { BasketModule } from './modules/basket/basket.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { TeamsModule } from './modules/teams/teams.module';
import { APP_GUARD } from '@nestjs/core';
import { AppAuthGuard } from './modules/auth/app-auth.guard';
import { RolesGuard } from './modules/auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env.backend', '.env'],
      load: [appConfig],
      validationSchema: envValidationSchema,
    }),
    PrismaModule,
    HealthModule,
    CatalogModule,
    MaterialsModule,
    StylesModule,
    ServiceItemsModule,
    UsersModule,
    BasketModule,
    FavoritesModule,
    AuthModule,
    OrdersModule,
    NotificationsModule,
    PaymentsModule,
    DeliveryModule,
    TeamsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

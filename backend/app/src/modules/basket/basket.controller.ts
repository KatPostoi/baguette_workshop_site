import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { DetailedBasketItemResponse } from './dto/basket.dto';
import { UpsertBasketItemDto } from './dto/upsert-basket-item.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { RemoveBasketItemDto } from './dto/remove-basket-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/types';

@UseGuards(JwtAuthGuard)
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get('items')
  listItems(
    @CurrentUser() user: AuthUser,
  ): Promise<DetailedBasketItemResponse[]> {
    return this.basketService.listItems(user.sub);
  }

  @Post('items')
  upsertItem(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertBasketItemDto,
  ): Promise<DetailedBasketItemResponse> {
    return this.basketService.upsertItem(user.sub, dto.catalogItemId);
  }

  @Patch('items')
  updateQuantity(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateQuantityDto,
  ): Promise<DetailedBasketItemResponse> {
    return this.basketService.updateQuantity(
      user.sub,
      dto.catalogItemId,
      dto.quantity,
    );
  }

  @Delete('items')
  @HttpCode(204)
  removeItem(
    @CurrentUser() user: AuthUser,
    @Body() dto: RemoveBasketItemDto,
  ): Promise<void> {
    return this.basketService.removeItem(user.sub, dto.catalogItemId);
  }

  @Delete()
  @HttpCode(204)
  clear(@CurrentUser() user: AuthUser): Promise<void> {
    return this.basketService.clear(user.sub);
  }
}

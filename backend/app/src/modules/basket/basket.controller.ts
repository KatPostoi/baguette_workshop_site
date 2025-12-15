import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { DetailedBasketItemResponse } from './dto/basket.dto';
import { UpsertBasketItemDto } from './dto/upsert-basket-item.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { RemoveBasketItemDto } from './dto/remove-basket-item.dto';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get(':userId/items')
  listItems(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<DetailedBasketItemResponse[]> {
    return this.basketService.listItems(userId);
  }

  @Post(':userId/items')
  upsertItem(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: UpsertBasketItemDto,
  ): Promise<DetailedBasketItemResponse> {
    return this.basketService.upsertItem(userId, dto.catalogItemId);
  }

  @Patch(':userId/items')
  updateQuantity(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: UpdateQuantityDto,
  ): Promise<DetailedBasketItemResponse> {
    return this.basketService.updateQuantity(userId, dto.catalogItemId, dto.quantity);
  }

  @Delete(':userId/items')
  @HttpCode(204)
  removeItem(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: RemoveBasketItemDto,
  ): Promise<void> {
    return this.basketService.removeItem(userId, dto.catalogItemId);
  }

  @Delete(':userId')
  @HttpCode(204)
  clear(@Param('userId', new ParseUUIDPipe()) userId: string): Promise<void> {
    return this.basketService.clear(userId);
  }
}

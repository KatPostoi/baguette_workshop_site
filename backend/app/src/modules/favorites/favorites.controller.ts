import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoriteItemResponse } from './dto/favorite-item.response';
import { ModifyFavoriteDto } from './dto/modify-favorite.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get(':userId')
  list(@Param('userId', new ParseUUIDPipe()) userId: string): Promise<FavoriteItemResponse[]> {
    return this.favoritesService.list(userId);
  }

  @Post(':userId')
  add(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: ModifyFavoriteDto,
  ): Promise<FavoriteItemResponse> {
    return this.favoritesService.add(userId, dto.catalogItemId);
  }

  @Delete(':userId')
  @HttpCode(204)
  remove(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: ModifyFavoriteDto,
  ): Promise<void> {
    return this.favoritesService.remove(userId, dto.catalogItemId);
  }
}

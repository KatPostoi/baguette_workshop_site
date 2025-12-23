import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoriteItemResponse } from './dto/favorite-item.response';
import { ModifyFavoriteDto } from './dto/modify-favorite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/types';

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser): Promise<FavoriteItemResponse[]> {
    return this.favoritesService.list(user.sub);
  }

  @Post()
  add(
    @CurrentUser() user: AuthUser,
    @Body() dto: ModifyFavoriteDto,
  ): Promise<FavoriteItemResponse> {
    return this.favoritesService.add(user.sub, dto);
  }

  @Delete()
  @HttpCode(204)
  remove(
    @CurrentUser() user: AuthUser,
    @Body() dto: ModifyFavoriteDto,
  ): Promise<void> {
    return this.favoritesService.remove(user.sub, dto);
  }
}

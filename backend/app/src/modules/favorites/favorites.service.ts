import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CatalogItemWithRelations,
  CatalogService,
} from '../catalog/catalog.service';
import { FavoriteItemResponse } from './dto/favorite-item.response';
import { CustomFramesService } from '../custom-frames/custom-frames.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalogService: CatalogService,
    private readonly customFramesService: CustomFramesService,
  ) {}

  async list(userId: string): Promise<FavoriteItemResponse[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        catalogItem: {
          include: {
            material: true,
            style: true,
          },
        },
        customFrame: {
          include: {
            material: true,
            style: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((favorite) => {
      const frame =
        favorite.customFrame != null
          ? this.customFramesService.mapToFrameResponse(
              favorite.customFrame as Prisma.CustomFrameGetPayload<{
                include: { material: true; style: true };
              }>,
            )
          : favorite.catalogItem != null
            ? this.catalogService.toResponse(
                favorite.catalogItem as CatalogItemWithRelations,
              )
            : null;

      if (!frame) {
        throw new NotFoundException('Избранное повреждено');
      }

      return {
        id: favorite.id,
        catalogItemId: favorite.catalogItemId ?? undefined,
        customFrameId: favorite.customFrameId ?? undefined,
        source: favorite.customFrameId ? 'custom' : 'default',
        frame,
      };
    });
  }

  async add(
    userId: string,
    params: { catalogItemId?: string; customFrameId?: string },
  ): Promise<FavoriteItemResponse> {
    const { catalogItemId, customFrameId } = params;
    if (!catalogItemId && !customFrameId) {
      throw new BadRequestException('Укажите товар или кастомную раму');
    }
    if (catalogItemId && customFrameId) {
      throw new BadRequestException('Только один источник за раз');
    }

    if (catalogItemId) {
      await this.catalogService.ensureExists(catalogItemId);
    }
    if (customFrameId) {
      await this.customFramesService.ensureOwned(userId, customFrameId);
    }

    const where = customFrameId
      ? { userId_customFrameId: { userId, customFrameId } }
      : { userId_catalogItemId: { userId, catalogItemId: catalogItemId } };

    const favorite = await this.prisma.favorite.upsert({
      where,
      update: {},
      create: {
        userId,
        catalogItemId: catalogItemId ?? null,
        customFrameId: customFrameId ?? null,
        source: customFrameId ? 'CUSTOM' : 'DEFAULT',
      },
      include: {
        catalogItem: {
          include: {
            material: true,
            style: true,
          },
        },
        customFrame: {
          include: {
            material: true,
            style: true,
          },
        },
      },
    });

    const frame =
      favorite.customFrame != null
        ? this.customFramesService.mapToFrameResponse(
            favorite.customFrame as Prisma.CustomFrameGetPayload<{
              include: { material: true; style: true };
            }>,
          )
        : this.catalogService.toResponse(
            favorite.catalogItem as CatalogItemWithRelations,
          );

    return {
      id: favorite.id,
      catalogItemId: favorite.catalogItemId ?? undefined,
      customFrameId: favorite.customFrameId ?? undefined,
      source: favorite.customFrameId ? 'custom' : 'default',
      frame,
    };
  }

  async remove(
    userId: string,
    params: { catalogItemId?: string; customFrameId?: string },
  ): Promise<void> {
    const { catalogItemId, customFrameId } = params;
    const where = catalogItemId
      ? { userId_catalogItemId: { userId, catalogItemId } }
      : customFrameId
        ? { userId_customFrameId: { userId, customFrameId } }
        : null;
    if (!where) {
      throw new BadRequestException('Не указано избранное');
    }

    const existing = await this.prisma.favorite.findUnique({
      where,
    });

    if (!existing) {
      throw new NotFoundException(
        `Избранное не найдено у пользователя ${userId}`,
      );
    }

    await this.prisma.favorite.delete({
      where: { id: existing.id },
    });
  }
}

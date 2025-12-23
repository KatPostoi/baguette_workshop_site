import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FrameSource, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { DetailedBasketItemResponse } from './dto/basket.dto';
import {
  CatalogItemWithRelations,
  CatalogService,
} from '../catalog/catalog.service';
import { CustomFramesService } from '../custom-frames/custom-frames.service';

const basketInclude = Prisma.validator<Prisma.BasketItemInclude>()({
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
});

type BasketWithRelations = Prisma.BasketItemGetPayload<{
  include: typeof basketInclude;
}>;

@Injectable()
export class BasketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalogService: CatalogService,
    private readonly customFramesService: CustomFramesService,
  ) {}

  private readonly include = basketInclude;

  async listItems(userId: string): Promise<DetailedBasketItemResponse[]> {
    const items: BasketWithRelations[] = await this.prisma.basketItem.findMany({
      where: { userId },
      include: this.include,
      orderBy: { createdAt: 'asc' },
    });

    return items.map((item) => this.mapToResponse(item));
  }

  async upsertItem(
    userId: string,
    params: { catalogItemId?: string; customFrameId?: string },
  ): Promise<DetailedBasketItemResponse> {
    const { catalogItemId, customFrameId } = params;
    if (!catalogItemId && !customFrameId) {
      throw new BadRequestException(
        'Укажите товар каталога или кастомную раму',
      );
    }

    if (catalogItemId && customFrameId) {
      throw new BadRequestException('Выберите только один источник');
    }

    if (catalogItemId) {
      await this.catalogService.ensureExists(catalogItemId);
    }
    if (customFrameId) {
      await this.customFramesService.ensureOwned(userId, customFrameId);
    }

    const where = catalogItemId
      ? { userId_catalogItemId: { userId, catalogItemId } }
      : { userId_customFrameId: { userId, customFrameId: customFrameId } };

    const item: BasketWithRelations = await this.prisma.basketItem.upsert({
      where,
      update: { quantity: { increment: 1 } },
      create: {
        userId,
        catalogItemId: catalogItemId ?? null,
        customFrameId: customFrameId ?? null,
        quantity: 1,
        source: catalogItemId ? FrameSource.DEFAULT : FrameSource.CUSTOM,
      },
      include: this.include,
    });

    return this.mapToResponse(item);
  }

  async updateQuantity(
    userId: string,
    params: {
      itemId?: string;
      catalogItemId?: string;
      customFrameId?: string;
      quantity: number;
    },
  ): Promise<DetailedBasketItemResponse> {
    const { quantity, ...whereInput } = params;
    if (quantity <= 0) {
      await this.removeItem(userId, whereInput);
      throw new NotFoundException('Item removed due to non-positive quantity');
    }

    try {
      const where = this.resolveUniqueWhere(userId, whereInput);
      const item: BasketWithRelations = await this.prisma.basketItem.update({
        where,
        data: { quantity },
        include: this.include,
      });

      return this.mapToResponse(item);
    } catch {
      throw new NotFoundException('Basket item not found');
    }
  }

  async removeItem(
    userId: string,
    params: { itemId?: string; catalogItemId?: string; customFrameId?: string },
  ): Promise<void> {
    const where = this.resolveUniqueWhere(userId, params);
    await this.prisma.basketItem.delete({ where }).catch(() => undefined);
  }

  async clear(userId: string): Promise<void> {
    await this.prisma.basketItem.deleteMany({ where: { userId } });
  }

  private mapToResponse(item: BasketWithRelations): DetailedBasketItemResponse {
    const frame =
      item.catalogItem != null
        ? this.catalogService.toResponse(
            item.catalogItem as CatalogItemWithRelations,
          )
        : item.customFrame != null
          ? this.customFramesService.mapToFrameResponse(
              item.customFrame as Prisma.CustomFrameGetPayload<{
                include: { material: true; style: true };
              }>,
            )
          : null;

    if (!frame) {
      throw new NotFoundException('Товар корзины не найден');
    }

    return {
      id: item.id,
      quantity: item.quantity,
      catalogItemId: item.catalogItemId ?? undefined,
      customFrameId: item.customFrameId ?? undefined,
      source:
        item.source === FrameSource.CUSTOM
          ? ('custom' as const)
          : ('default' as const),
      frame,
    };
  }

  private resolveUniqueWhere(
    userId: string,
    params: { itemId?: string; catalogItemId?: string; customFrameId?: string },
  ): Prisma.BasketItemWhereUniqueInput {
    const { itemId, catalogItemId, customFrameId } = params;
    if (itemId) {
      return { id: itemId };
    }
    if (catalogItemId) {
      return { userId_catalogItemId: { userId, catalogItemId } };
    }
    if (customFrameId) {
      return { userId_customFrameId: { userId, customFrameId } };
    }
    throw new BadRequestException('Не указан элемент корзины');
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { DetailedBasketItemResponse } from './dto/basket.dto';
import {
  CatalogItemWithRelations,
  CatalogService,
} from '../catalog/catalog.service';

const basketInclude = Prisma.validator<Prisma.BasketItemInclude>()({
  catalogItem: {
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
    catalogItemId: string,
  ): Promise<DetailedBasketItemResponse> {
    await this.catalogService.ensureExists(catalogItemId);

    const item: BasketWithRelations = await this.prisma.basketItem.upsert({
      where: {
        userId_catalogItemId: { userId, catalogItemId },
      },
      update: { quantity: { increment: 1 } },
      create: { userId, catalogItemId, quantity: 1 },
      include: this.include,
    });

    return this.mapToResponse(item);
  }

  async updateQuantity(
    userId: string,
    catalogItemId: string,
    quantity: number,
  ): Promise<DetailedBasketItemResponse> {
    if (quantity <= 0) {
      await this.removeItem(userId, catalogItemId);
      throw new NotFoundException('Item removed due to non-positive quantity');
    }

    try {
      const item: BasketWithRelations = await this.prisma.basketItem.update({
        where: { userId_catalogItemId: { userId, catalogItemId } },
        data: { quantity },
        include: this.include,
      });

      return this.mapToResponse(item);
    } catch {
      throw new NotFoundException('Basket item not found');
    }
  }

  async removeItem(userId: string, catalogItemId: string): Promise<void> {
    await this.prisma.basketItem
      .delete({
        where: { userId_catalogItemId: { userId, catalogItemId } },
      })
      .catch(() => undefined);
  }

  async clear(userId: string): Promise<void> {
    await this.prisma.basketItem.deleteMany({ where: { userId } });
  }

  private mapToResponse(item: BasketWithRelations): DetailedBasketItemResponse {
    return {
      id: item.id,
      quantity: item.quantity,
      catalogItemId: item.catalogItemId,
      catalogItem: this.catalogService.toResponse(
        item.catalogItem as CatalogItemWithRelations,
      ),
    };
  }
}

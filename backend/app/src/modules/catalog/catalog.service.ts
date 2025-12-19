import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogItemType, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  CatalogItemResponse,
  CatalogItemSummaryResponse,
  CatalogMaterialResponse,
  CatalogStyleResponse,
  CatalogItemTypeResponse,
} from './dto/catalog-item.response';

export type CatalogItemWithRelations = Prisma.CatalogItemGetPayload<{
  include: { material: true; style: true };
}>;

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CatalogItemResponse[]> {
    const items = await this.prisma.catalogItem.findMany({
      include: {
        material: true,
        style: true,
      },
      orderBy: { title: 'asc' },
    });

    return items.map((item) => this.mapToResponse(item));
  }

  async findBySlug(slug: string): Promise<CatalogItemResponse> {
    const item = await this.prisma.catalogItem.findUnique({
      where: { slug },
      include: {
        material: true,
        style: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Товар со слагом ${slug} не найден`);
    }

    return this.mapToResponse(item);
  }

  async getSummaryByIdOrThrow(id: string): Promise<CatalogItemSummaryResponse> {
    const item = await this.prisma.catalogItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Товар ${id} не найден`);
    }

    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      price: item.price,
      image: {
        src: item.imageUrl,
        alt: item.imageAlt,
      },
    };
  }

  async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.catalogItem.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Товар ${id} не найден`);
    }
  }

  toResponse(item: CatalogItemWithRelations): CatalogItemResponse {
    return this.mapToResponse(item);
  }

  private mapToResponse(
    item: Prisma.CatalogItemGetPayload<{
      include: { material: true; style: true };
    }>,
  ): CatalogItemResponse {
    const type: CatalogItemTypeResponse =
      item.type === CatalogItemType.CUSTOM ? 'custom' : 'default';

    const material: CatalogMaterialResponse = {
      id: Number(item.material.id),
      title: item.material.title,
      material: item.material.material,
      description: item.material.description,
      pricePerCm: item.material.pricePerCm,
      image: {
        src: item.material.imageUrl,
        alt: item.material.imageAlt,
      },
    };

    const style: CatalogStyleResponse | null = item.style
      ? {
          id: item.style.id,
          name: item.style.name,
          coefficient: item.style.coefficient,
        }
      : null;

    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      color: item.color,
      type,
      size: {
        widthCm: item.widthCm,
        heightCm: item.heightCm,
      },
      price: item.price,
      stock: item.stock,
      image: {
        src: item.imageUrl,
        alt: item.imageAlt,
      },
      material,
      style,
    };
  }
}

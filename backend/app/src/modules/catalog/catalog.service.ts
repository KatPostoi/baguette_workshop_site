import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogItemType, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  CatalogItemResponse,
  CatalogItemSummaryResponse,
  CatalogMaterialResponse,
  CatalogStyleResponse,
  CatalogItemTypeResponse,
} from './dto/catalog-item.response';
import { AdminUpsertCatalogDto } from './dto/admin-upsert-catalog.dto';

export type CatalogItemWithRelations = Prisma.CatalogItemGetPayload<{
  include: { material: true; style: true };
}>;

@Injectable()
export class CatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll(): Promise<CatalogItemResponse[]> {
    const items = await this.prisma.catalogItem.findMany({
      where: { type: CatalogItemType.DEFAULT },
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
      where: { slug, type: CatalogItemType.DEFAULT },
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

  async findOneById(id: string): Promise<CatalogItemResponse> {
    const item = await this.prisma.catalogItem.findUnique({
      where: { id, type: CatalogItemType.DEFAULT },
      include: { material: true, style: true },
    });
    if (!item) {
      throw new NotFoundException(`Товар ${id} не найден`);
    }
    return this.mapToResponse(item);
  }

  async upsert(dto: AdminUpsertCatalogDto) {
    const id = dto.id || randomUUID();
    const normalizedType =
      typeof dto.type === 'string'
        ? (dto.type.toUpperCase() as CatalogItemType)
        : CatalogItemType.DEFAULT;

    const existing = await this.prisma.catalogItem.findUnique({
      where: { id },
    });
    const data: Prisma.CatalogItemUpsertArgs['create'] = {
      id,
      slug: dto.slug,
      title: dto.title,
      description: dto.description ?? '',
      imageUrl: dto.imageUrl ?? '',
      imageAlt: dto.imageAlt ?? '',
      materialId: dto.materialId,
      styleId: dto.styleId ?? null,
      color: dto.color,
      type: normalizedType,
      widthCm: dto.widthCm,
      heightCm: dto.heightCm,
      price: dto.price,
      stock: dto.stock,
    };

    const saved = await this.prisma.catalogItem.upsert({
      where: { id },
      create: data,
      update: {
        ...data,
      },
      include: { material: true, style: true },
    });

    await this.audit.record({
      action: existing ? 'catalog_update' : 'catalog_create',
      entity: 'CatalogItem',
      entityId: saved.id,
      before: existing,
      after: saved,
    });

    return this.mapToResponse(saved);
  }

  async remove(id: string) {
    const existing = await this.prisma.catalogItem.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Товар ${id} не найден`);
    }
    await this.prisma.catalogItem.delete({ where: { id } });
    await this.audit.record({
      action: 'catalog_delete',
      entity: 'CatalogItem',
      entityId: id,
      before: existing,
    });
    return { success: true };
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
      source: 'default',
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

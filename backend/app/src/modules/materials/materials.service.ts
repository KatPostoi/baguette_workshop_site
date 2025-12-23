import { Injectable, NotFoundException } from '@nestjs/common';
import type { FrameMaterial, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { FrameMaterialResponse } from './dto/frame-material.response';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class MaterialsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll(): Promise<FrameMaterialResponse[]> {
    const materials = await this.prisma.frameMaterial.findMany({
      orderBy: { title: 'asc' },
    });

    return materials.map((material) => this.mapToResponse(material));
  }

  async findOne(
    id: Prisma.FrameMaterialWhereUniqueInput['id'],
  ): Promise<FrameMaterialResponse> {
    const material = await this.prisma.frameMaterial.findUnique({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException(`Material ${id} not found`);
    }

    return this.mapToResponse(material);
  }

  private mapToResponse(material: FrameMaterial): FrameMaterialResponse {
    return {
      id: Number(material.id),
      title: material.title,
      material: material.material,
      description: material.description,
      pricePerCm: material.pricePerCm,
      image: {
        src: material.imageUrl,
        alt: material.imageAlt,
      },
    };
  }

  async create(data: Prisma.FrameMaterialCreateInput) {
    const created = await this.prisma.frameMaterial.create({ data });
    await this.audit.record({
      action: 'material_create',
      entity: 'FrameMaterial',
      entityId: String(created.id),
      after: created,
    });
    return this.mapToResponse(created);
  }

  async update(id: number, data: Prisma.FrameMaterialUpdateInput) {
    const existing = await this.prisma.frameMaterial.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Material ${id} not found`);
    }
    const updated = await this.prisma.frameMaterial.update({
      where: { id },
      data,
    });
    await this.audit.record({
      action: 'material_update',
      entity: 'FrameMaterial',
      entityId: String(id),
      before: existing,
      after: updated,
    });
    return this.mapToResponse(updated);
  }

  async remove(id: number) {
    const existing = await this.prisma.frameMaterial.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Material ${id} not found`);
    }
    await this.prisma.frameMaterial.delete({
      where: { id },
    });
    await this.audit.record({
      action: 'material_delete',
      entity: 'FrameMaterial',
      entityId: String(id),
      before: existing,
    });
    return { success: true };
  }
}

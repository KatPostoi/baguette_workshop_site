import { Injectable, NotFoundException } from '@nestjs/common';
import { FrameMaterial } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { FrameMaterialResponse } from './dto/frame-material.response';

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FrameMaterialResponse[]> {
    const materials = await this.prisma.frameMaterial.findMany({
      orderBy: { title: 'asc' },
    });

    return materials.map((material) => this.mapToResponse(material));
  }

  async findOne(id: string): Promise<FrameMaterialResponse> {
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
      id: material.id,
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
}

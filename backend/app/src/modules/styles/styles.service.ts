import { Injectable, NotFoundException } from '@nestjs/common';
import { FrameStyle } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { FrameStyleResponse } from './dto/frame-style.response';

@Injectable()
export class StylesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FrameStyleResponse[]> {
    const styles = await this.prisma.frameStyle.findMany({
      orderBy: { name: 'asc' },
    });
    return styles.map((style) => this.mapToResponse(style));
  }

  async findOne(id: string): Promise<FrameStyleResponse> {
    const style = await this.prisma.frameStyle.findUnique({ where: { id } });

    if (!style) {
      throw new NotFoundException(`Style ${id} not found`);
    }

    return this.mapToResponse(style);
  }

  private mapToResponse(style: FrameStyle): FrameStyleResponse {
    return {
      id: style.id,
      name: style.name,
      coefficient: style.coefficient,
    };
  }
}

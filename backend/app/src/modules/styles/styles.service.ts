import { Injectable, NotFoundException } from '@nestjs/common';
import { FrameStyle } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { FrameStyleResponse } from './dto/frame-style.response';
import { AuditService } from '../audit/audit.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StylesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

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

  async create(data: Prisma.FrameStyleCreateInput) {
    const created = await this.prisma.frameStyle.create({ data });
    await this.audit.record({
      action: 'style_create',
      entity: 'FrameStyle',
      entityId: created.id,
      after: created,
    });
    return this.mapToResponse(created);
  }

  async update(id: string, data: Prisma.FrameStyleUpdateInput) {
    const existing = await this.prisma.frameStyle.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Style ${id} not found`);
    }
    const updated = await this.prisma.frameStyle.update({
      where: { id },
      data,
    });
    await this.audit.record({
      action: 'style_update',
      entity: 'FrameStyle',
      entityId: id,
      before: existing,
      after: updated,
    });
    return this.mapToResponse(updated);
  }

  async remove(id: string) {
    const existing = await this.prisma.frameStyle.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Style ${id} not found`);
    }
    await this.prisma.frameStyle.delete({ where: { id } });
    await this.audit.record({
      action: 'style_delete',
      entity: 'FrameStyle',
      entityId: id,
      before: existing,
    });
    return { success: true };
  }
}

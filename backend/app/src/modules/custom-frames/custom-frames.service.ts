import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { PriceQuoteDto } from './dto/price-quote.dto';
import { CreateCustomFrameDto } from './dto/create-custom-frame.dto';
import {
  CustomFrameResponse,
  FrameResponse,
  mapMaterial,
  mapStyle,
} from './dto/custom-frame.response';

@Injectable()
export class CustomFramesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async quote(dto: PriceQuoteDto): Promise<{ price: number }> {
    const { widthCm, heightCm } = this.ensureDimensions(
      dto.widthCm,
      dto.heightCm,
    );
    const material = await this.prisma.frameMaterial.findUnique({
      where: { id: dto.materialId },
    });
    if (!material) {
      throw new NotFoundException(`Материал ${dto.materialId} не найден`);
    }
    const style = dto.styleId
      ? await this.prisma.frameStyle.findUnique({ where: { id: dto.styleId } })
      : null;

    const price = this.calculatePrice({
      widthCm,
      heightCm,
      materialPricePerCm: material.pricePerCm,
      styleCoefficient: style?.coefficient ?? 1,
    });

    return { price };
  }

  async create(
    dto: CreateCustomFrameDto,
    userId: string,
  ): Promise<CustomFrameResponse> {
    const { price } = await this.quote(dto);
    const { widthCm, heightCm } = this.ensureDimensions(
      dto.widthCm,
      dto.heightCm,
    );

    try {
      const created = await this.prisma.customFrame.create({
        data: {
          id: randomUUID(),
          userId,
          title: dto.title ?? 'Индивидуальная рама',
          description: dto.description ?? '',
          materialId: dto.materialId,
          styleId: dto.styleId ?? null,
          color: dto.color ?? 'Индивидуальный',
          widthCm,
          heightCm,
          price,
          previewUrl: dto.previewUrl ?? null,
        },
        include: { material: true, style: true },
      });

      await this.audit.record({
        actorId: userId,
        action: 'custom_frame_create',
        entity: 'CustomFrame',
        entityId: created.id,
        after: created,
      });

      return this.mapToResponse(created);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'Некорректные ссылки на материал или стиль',
        );
      }
      throw error;
    }
  }

  async list(userId: string): Promise<CustomFrameResponse[]> {
    const frames = await this.prisma.customFrame.findMany({
      where: { userId },
      include: { material: true, style: true },
      orderBy: { createdAt: 'desc' },
    });
    return frames.map((frame) => this.mapToResponse(frame));
  }

  async getById(id: string, userId: string): Promise<CustomFrameResponse> {
    const frame = await this.prisma.customFrame.findUnique({
      where: { id },
      include: { material: true, style: true },
    });
    if (!frame) {
      throw new NotFoundException(`Рама ${id} не найдена`);
    }
    if (frame.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой раме');
    }
    return this.mapToResponse(frame);
  }

  async ensureOwned(userId: string, frameId: string): Promise<void> {
    const frame = await this.prisma.customFrame.findUnique({
      where: { id: frameId },
      select: { userId: true },
    });
    if (!frame) {
      throw new NotFoundException(`Рама ${frameId} не найдена`);
    }
    if (frame.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой раме');
    }
  }

  mapToFrameResponse(
    frame: Prisma.CustomFrameGetPayload<{
      include: { material: true; style: true };
    }>,
  ): FrameResponse {
    return this.mapToResponse(frame);
  }

  async remove(id: string, userId: string): Promise<void> {
    const frame = await this.prisma.customFrame.findUnique({
      where: { id },
      include: { orderItems: true },
    });
    if (!frame) {
      throw new NotFoundException(`Рама ${id} не найдена`);
    }
    if (frame.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой раме');
    }
    if (frame.orderItems.length > 0) {
      throw new BadRequestException(
        'Нельзя удалить раму, которая уже используется в заказах',
      );
    }

    await this.prisma.$transaction([
      this.prisma.favorite.deleteMany({ where: { customFrameId: id } }),
      this.prisma.basketItem.deleteMany({ where: { customFrameId: id } }),
      this.prisma.customFrame.delete({ where: { id } }),
    ]);

    await this.audit.record({
      actorId: userId,
      action: 'custom_frame_delete',
      entity: 'CustomFrame',
      entityId: id,
      before: frame,
    });
  }

  private mapToResponse(
    frame: Prisma.CustomFrameGetPayload<{
      include: { material: true; style: true };
    }>,
  ): CustomFrameResponse {
    return {
      id: frame.id,
      slug: `custom-${frame.id}`,
      title: frame.title,
      description: frame.description ?? '',
      color: frame.color ?? 'Индивидуальный',
      type: 'custom',
      size: {
        widthCm: frame.widthCm,
        heightCm: frame.heightCm,
      },
      price: frame.price,
      stock: 1,
      image: {
        src: frame.previewUrl ?? frame.material.imageUrl,
        alt: frame.previewUrl ? frame.title : frame.material.imageAlt,
      },
      material: mapMaterial(frame.material),
      style: frame.style ? mapStyle(frame.style) : null,
      source: 'custom',
    };
  }

  private ensureDimensions(
    widthCm: number,
    heightCm: number,
  ): { widthCm: number; heightCm: number } {
    if (!widthCm || !heightCm || widthCm <= 0 || heightCm <= 0) {
      throw new BadRequestException('Укажите положительные размеры');
    }
    return {
      widthCm: Math.round(widthCm),
      heightCm: Math.round(heightCm),
    };
  }

  private calculatePrice(input: {
    widthCm: number;
    heightCm: number;
    materialPricePerCm: number;
    styleCoefficient: number;
  }): number {
    const perimeter = input.widthCm + input.heightCm;
    const raw = perimeter * input.materialPricePerCm * input.styleCoefficient;
    return Math.max(0, Math.round(raw));
  }
}

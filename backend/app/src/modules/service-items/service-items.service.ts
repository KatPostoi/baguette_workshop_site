import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ServiceItem } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ServiceItemResponse } from './dto/service-item.response';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ServiceItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll(): Promise<ServiceItemResponse[]> {
    const services = await this.prisma.serviceItem.findMany({
      orderBy: { id: 'asc' },
    });
    return services.map((service) => this.mapToResponse(service));
  }

  async findOne(id: number): Promise<ServiceItemResponse> {
    const service = await this.prisma.serviceItem.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundException(`Service item ${id} not found`);
    }

    return this.mapToResponse(service);
  }

  private mapToResponse(service: ServiceItem): ServiceItemResponse {
    return {
      id: service.id,
      type: service.type,
      title: service.title,
      price: service.price,
    };
  }

  async create(data: Prisma.ServiceItemCreateInput) {
    try {
      const created = await this.prisma.serviceItem.create({ data });
      await this.audit.record({
        action: 'service_item_create',
        entity: 'ServiceItem',
        entityId: String(created.id),
        after: created,
      });
      return this.mapToResponse(created);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Услуга с таким типом уже существует');
      }
      throw error;
    }
  }

  async update(id: number, data: Prisma.ServiceItemUpdateInput) {
    const existing = await this.prisma.serviceItem.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Service item ${id} not found`);
    }
    const updated = await this.prisma.serviceItem.update({
      where: { id },
      data,
    });
    await this.audit.record({
      action: 'service_item_update',
      entity: 'ServiceItem',
      entityId: String(id),
      before: existing,
      after: updated,
    });
    return this.mapToResponse(updated);
  }

  async remove(id: number) {
    const existing = await this.prisma.serviceItem.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Service item ${id} not found`);
    }
    await this.prisma.serviceItem.delete({ where: { id } });
    await this.audit.record({
      action: 'service_item_delete',
      entity: 'ServiceItem',
      entityId: String(id),
      before: existing,
    });
    return { success: true };
  }
}

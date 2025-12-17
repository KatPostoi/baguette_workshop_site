import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceItem } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ServiceItemResponse } from './dto/service-item.response';

@Injectable()
export class ServiceItemsService {
  constructor(private readonly prisma: PrismaService) {}

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
}

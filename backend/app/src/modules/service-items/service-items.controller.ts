import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ServiceItemsService } from './service-items.service';
import { ServiceItemResponse } from './dto/service-item.response';

@Controller('services')
export class ServiceItemsController {
  constructor(private readonly serviceItemsService: ServiceItemsService) {}

  @Get()
  findAll(): Promise<ServiceItemResponse[]> {
    return this.serviceItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ServiceItemResponse> {
    const numericId = Number(id);
    if (!Number.isFinite(numericId) || numericId <= 0) {
      throw new BadRequestException('Service id must be a positive number');
    }
    return this.serviceItemsService.findOne(numericId);
  }
}

import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ServiceItemsService } from './service-items.service';
import { ServiceItemResponse } from './dto/service-item.response';
import { Public } from '../auth/public.decorator';

@Controller('services')
export class ServiceItemsController {
  constructor(private readonly serviceItemsService: ServiceItemsService) {}

  @Get()
  @Public()
  findAll(): Promise<ServiceItemResponse[]> {
    return this.serviceItemsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string): Promise<ServiceItemResponse> {
    const numericId = Number(id);
    if (!Number.isFinite(numericId) || numericId <= 0) {
      throw new BadRequestException('Service id must be a positive number');
    }
    return this.serviceItemsService.findOne(numericId);
  }
}

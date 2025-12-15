import { Controller, Get, Param } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { FrameMaterialResponse } from './dto/frame-material.response';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  findAll(): Promise<FrameMaterialResponse[]> {
    return this.materialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<FrameMaterialResponse> {
    return this.materialsService.findOne(id);
  }
}

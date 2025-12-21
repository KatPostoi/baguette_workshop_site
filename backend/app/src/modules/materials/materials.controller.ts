import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { FrameMaterialResponse } from './dto/frame-material.response';
import { Public } from '../auth/public.decorator';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  @Public()
  findAll(): Promise<FrameMaterialResponse[]> {
    return this.materialsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FrameMaterialResponse> {
    return this.materialsService.findOne(id);
  }
}

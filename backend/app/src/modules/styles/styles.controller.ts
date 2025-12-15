import { Controller, Get, Param } from '@nestjs/common';
import { StylesService } from './styles.service';
import { FrameStyleResponse } from './dto/frame-style.response';

@Controller('styles')
export class StylesController {
  constructor(private readonly stylesService: StylesService) {}

  @Get()
  findAll(): Promise<FrameStyleResponse[]> {
    return this.stylesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<FrameStyleResponse> {
    return this.stylesService.findOne(id);
  }
}

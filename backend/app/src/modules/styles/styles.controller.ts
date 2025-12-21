import { Controller, Get, Param } from '@nestjs/common';
import { StylesService } from './styles.service';
import { FrameStyleResponse } from './dto/frame-style.response';
import { Public } from '../auth/public.decorator';

@Controller('styles')
export class StylesController {
  constructor(private readonly stylesService: StylesService) {}

  @Get()
  @Public()
  findAll(): Promise<FrameStyleResponse[]> {
    return this.stylesService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string): Promise<FrameStyleResponse> {
    return this.stylesService.findOne(id);
  }
}

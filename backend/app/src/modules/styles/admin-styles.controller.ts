import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StylesService } from './styles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Prisma } from '@prisma/client';

@Controller('admin/styles')
@UseGuards(JwtAuthGuard)
@Roles('ADMIN')
export class AdminStylesController {
  constructor(private readonly stylesService: StylesService) {}

  @Get()
  list() {
    return this.stylesService.findAll();
  }

  @Post()
  create(@Body() dto: Prisma.FrameStyleCreateInput) {
    return this.stylesService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Prisma.FrameStyleUpdateInput,
  ) {
    return this.stylesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.stylesService.remove(id);
  }
}

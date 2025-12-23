import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Prisma } from '@prisma/client';

@Controller('admin/materials')
@UseGuards(JwtAuthGuard)
@Roles('ADMIN')
export class AdminMaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  list() {
    return this.materialsService.findAll();
  }

  @Post()
  create(@Body() dto: Prisma.FrameMaterialCreateInput) {
    return this.materialsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Prisma.FrameMaterialUpdateInput,
  ) {
    return this.materialsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.materialsService.remove(id);
  }
}

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
import { ServiceItemsService } from './service-items.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Prisma } from '@prisma/client';

@Controller('admin/services')
@UseGuards(JwtAuthGuard)
@Roles('ADMIN')
export class AdminServiceItemsController {
  constructor(private readonly serviceItemsService: ServiceItemsService) {}

  @Get()
  list() {
    return this.serviceItemsService.findAll();
  }

  @Post()
  create(@Body() dto: Prisma.ServiceItemCreateInput) {
    return this.serviceItemsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Prisma.ServiceItemUpdateInput,
  ) {
    return this.serviceItemsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceItemsService.remove(id);
  }
}

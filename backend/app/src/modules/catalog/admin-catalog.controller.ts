import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminUpsertCatalogDto } from './dto/admin-upsert-catalog.dto';

@Controller('admin/catalog')
@UseGuards(JwtAuthGuard)
@Roles('ADMIN')
export class AdminCatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  list() {
    return this.catalogService.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.catalogService.findOneById(id);
  }

  @Post()
  create(@Body() dto: AdminUpsertCatalogDto) {
    return this.catalogService.upsert(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: AdminUpsertCatalogDto) {
    return this.catalogService.upsert({ ...dto, id });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogService.remove(id);
  }
}

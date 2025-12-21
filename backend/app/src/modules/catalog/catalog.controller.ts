import { Controller, Get, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogItemResponse } from './dto/catalog-item.response';
import { Public } from '../auth/public.decorator';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @Public()
  findAll(): Promise<CatalogItemResponse[]> {
    return this.catalogService.findAll();
  }

  @Get(':slug')
  @Public()
  findBySlug(@Param('slug') slug: string): Promise<CatalogItemResponse> {
    return this.catalogService.findBySlug(slug);
  }
}

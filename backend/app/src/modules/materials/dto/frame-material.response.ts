import { CatalogImageResponse } from '../../catalog/dto/catalog-item.response';

export interface FrameMaterialResponse {
  id: number;
  title: string;
  material: string;
  description: string;
  pricePerCm: number;
  image: CatalogImageResponse;
}

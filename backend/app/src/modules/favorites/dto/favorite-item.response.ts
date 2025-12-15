import { CatalogItemResponse } from '../../catalog/dto/catalog-item.response';

export interface FavoriteItemResponse {
  id: string;
  catalogItemId: string;
  catalogItem: CatalogItemResponse;
}

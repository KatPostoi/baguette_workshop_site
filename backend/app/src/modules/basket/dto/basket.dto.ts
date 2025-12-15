import { CatalogItemResponse } from '../../catalog/dto/catalog-item.response';

export interface DetailedBasketItemResponse {
  id: string;
  catalogItemId: string;
  quantity: number;
  catalogItem: CatalogItemResponse;
}

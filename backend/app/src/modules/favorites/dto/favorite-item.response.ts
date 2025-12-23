import { CatalogItemResponse } from '../../catalog/dto/catalog-item.response';
import { FrameResponse } from '../../custom-frames/dto/custom-frame.response';

export interface FavoriteItemResponse {
  id: string;
  catalogItemId?: string;
  customFrameId?: string;
  source: 'default' | 'custom';
  frame: CatalogItemResponse | FrameResponse;
}

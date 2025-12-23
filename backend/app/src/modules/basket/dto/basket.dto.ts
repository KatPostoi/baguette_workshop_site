import { CatalogItemResponse } from '../../catalog/dto/catalog-item.response';
import { FrameResponse } from '../../custom-frames/dto/custom-frame.response';

export interface DetailedBasketItemResponse {
  id: string;
  catalogItemId?: string;
  customFrameId?: string;
  quantity: number;
  source: 'default' | 'custom';
  frame: FrameResponse | CatalogItemResponse;
}

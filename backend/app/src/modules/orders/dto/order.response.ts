import type { OrderStatus } from '../order-status';

export interface OrderItemResponse {
  id: string;
  catalogItemId?: string;
  customFrameId?: string;
  source: 'default' | 'custom';
  title: string;
  slug: string;
  quantity: number;
  price: number;
  size: {
    widthCm: number;
    heightCm: number;
  };
  color?: string | null;
  image: {
    src: string;
    alt: string;
  };
}

export interface OrderResponse {
  id: string;
  status: OrderStatus;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  deliveryAddress?: string | null;
  createdAt: Date;
  items: OrderItemResponse[];
  team?: {
    id: string;
    name: string;
  } | null;
  history?: OrderStatusHistoryResponse[];
}

export interface OrderStatusHistoryResponse {
  id: string;
  status: OrderStatus;
  changedBy?: {
    id: string;
    fullName: string;
    role: string;
  } | null;
  comment?: string | null;
  createdAt: Date;
}

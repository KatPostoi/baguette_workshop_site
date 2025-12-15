import { OrderStatus } from '@prisma/client';

export interface OrderItemResponse {
  id: string;
  catalogItemId: string;
  title: string;
  slug: string;
  quantity: number;
  price: number;
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
}

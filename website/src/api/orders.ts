import { httpClient } from './httpClient';
import type { Order, OrderStatus, OrderTimeline } from './types';

export type CreateOrderItemPayload = {
  catalogItemId?: string;
  customFrameId?: string;
  quantity: number;
};

export type CreateOrderPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  deliveryAddress?: string | null;
  items: CreateOrderItemPayload[];
  clearBasketAfterOrder?: boolean;
};

export type OrderFilters = Partial<{
  status: OrderStatus;
  from: string;
  to: string;
  teamId: string;
  userId: string;
}>;

export const fetchMyOrders = async (): Promise<Order[]> => {
  return httpClient.get('/orders');
};

export const fetchOrder = async (id: string): Promise<Order> => {
  return httpClient.get(`/orders/${id}`);
};

export const cancelOrder = async (id: string): Promise<Order> => {
  return httpClient.patch(`/orders/${id}/cancel`);
};

export const payOrder = async (id: string): Promise<Order> => {
  return httpClient.patch(`/orders/${id}/pay`);
};

export const fetchAdminOrders = async (filters: OrderFilters = {}): Promise<Order[]> => {
  return httpClient.get<Order[]>('/admin/orders', {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.from ? { from: filters.from } : {}),
    ...(filters.to ? { to: filters.to } : {}),
    ...(filters.teamId ? { teamId: filters.teamId } : {}),
    ...(filters.userId ? { userId: filters.userId } : {}),
  });
};

export const updateOrderStatus = async (id: string, payload: { status: OrderStatus; comment?: string }) => {
  return httpClient.patch<Order>(`/admin/orders/${id}/status`, payload);
};

export const bulkUpdateOrderStatus = async (payload: { orderIds: string[]; status: OrderStatus; comment?: string }) => {
  return httpClient.patch<Order[]>(`/admin/orders/bulk/status`, payload);
};

export const fetchOrderTimeline = async (orderId: string): Promise<OrderTimeline> => {
  return httpClient.get(`/admin/orders/${orderId}/timeline`);
};

export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  return httpClient.post<Order>('/orders', payload);
};

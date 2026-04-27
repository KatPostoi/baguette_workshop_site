import { httpClient } from './httpClient';
import type { Order, OrderStatus } from './types';

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
}>;

export type AdminOrderCreateItemInput = {
  catalogItemId: string;
  quantity: number;
};

export type AdminOrderCreateInput = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  deliveryAddress?: string | null;
  teamId?: string | null;
  items: AdminOrderCreateItemInput[];
};

export type AdminOrderUpdateInput = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string | null;
  deliveryAddress?: string | null;
  teamId?: string | null;
  status?: OrderStatus;
};

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
  });
};

export const createAdminOrder = async (
  payload: AdminOrderCreateInput,
): Promise<Order> => {
  return httpClient.post<Order>('/admin/orders', payload);
};

export const updateAdminOrder = async (
  id: string,
  payload: AdminOrderUpdateInput,
): Promise<Order> => {
  return httpClient.patch<Order>(`/admin/orders/${id}`, payload);
};

export const deleteAdminOrder = async (
  id: string,
): Promise<{ success: true }> => {
  return httpClient.delete<{ success: true }>(`/admin/orders/${id}`);
};

export const updateOrderStatus = async (id: string, payload: { status: OrderStatus; comment?: string }) => {
  return httpClient.patch<Order>(`/admin/orders/${id}/status`, payload);
};

export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  return httpClient.post<Order>('/orders', payload);
};

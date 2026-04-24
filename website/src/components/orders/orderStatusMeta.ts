import type { Order, OrderStatus } from '../../api/types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Ожидает оплаты',
  PAID: 'Оплачен',
  ASSEMBLY: 'Сборка',
  READY_FOR_PICKUP: 'Готов к выдаче',
  IN_TRANSIT: 'В пути',
  RECEIVED: 'Получен',
  COMPLETED: 'Завершён',
  CANCELLED: 'Отменён',
};

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(
  ([value, label]) => ({
    value: value as OrderStatus,
    label,
  }),
);

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['ASSEMBLY', 'CANCELLED'],
  ASSEMBLY: ['READY_FOR_PICKUP', 'IN_TRANSIT', 'CANCELLED'],
  READY_FOR_PICKUP: ['RECEIVED', 'CANCELLED'],
  IN_TRANSIT: ['RECEIVED', 'CANCELLED'],
  RECEIVED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

export const getAvailableOrderStatuses = (
  order: Pick<Order, 'status' | 'deliveryAddress'>,
): OrderStatus[] => {
  const nextStatuses = ORDER_STATUS_TRANSITIONS[order.status] ?? [];

  if (order.deliveryAddress) {
    return nextStatuses;
  }

  return nextStatuses.filter((status) => status !== 'IN_TRANSIT');
};

export const getOrderStatusOptions = (
  order: Pick<Order, 'status' | 'deliveryAddress'>,
) => {
  const statuses = [order.status, ...getAvailableOrderStatuses(order)];
  const uniqueStatuses = Array.from(new Set(statuses));

  return uniqueStatuses.map((status) => ({
    value: status,
    label: ORDER_STATUS_LABELS[status],
  }));
};

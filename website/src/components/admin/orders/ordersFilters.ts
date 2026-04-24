import type { OrderStatus } from '../../../api/types';

export type OrdersFilters = {
  status: OrderStatus | '';
  teamId: string;
  userId: string;
  from: string;
  to: string;
};

export const createEmptyOrdersFilters = (): OrdersFilters => ({
  status: '',
  teamId: '',
  userId: '',
  from: '',
  to: '',
});

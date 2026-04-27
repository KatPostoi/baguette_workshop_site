import type { OrderStatus } from '../../../api/types';

export type OrdersFilters = {
  search: string;
  status: OrderStatus | '';
  teamId: string;
  from: string;
  to: string;
};

export const createEmptyOrdersFilters = (): OrdersFilters => ({
  search: '',
  status: '',
  teamId: '',
  from: '',
  to: '',
});

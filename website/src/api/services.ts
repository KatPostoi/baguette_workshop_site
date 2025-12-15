import { request } from './httpClient';
import type { ServiceItem } from './types';

export const fetchServiceItems = (): Promise<ServiceItem[]> => request('/services');

export const fetchServiceItem = (id: number): Promise<ServiceItem> =>
  request(`/services/${id}`);

import { httpClient } from './httpClient';
import type { Order, Team } from './types';

export type FetchTeamsOptions = Partial<{
  includeInactive: boolean;
}>;

export const fetchTeams = async (options: FetchTeamsOptions = {}): Promise<Team[]> => {
  const query = new URLSearchParams();

  if (options.includeInactive) {
    query.set('includeInactive', 'true');
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return httpClient.get<Team[]>(`/admin/teams${suffix}`);
};

export const assignTeamToOrder = async (
  orderId: string,
  teamId: string,
): Promise<Order> => {
  return httpClient.patch<Order>(`/admin/orders/${orderId}/team`, { teamId });
};

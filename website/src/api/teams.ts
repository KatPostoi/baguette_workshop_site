import { httpClient } from './httpClient';
import type { Order, Team } from './types';

export type AdminTeamQuery = Partial<{
  search: string;
  active: boolean;
  includeInactive: boolean;
}>;

export const adminListTeams = async (
  options: AdminTeamQuery = {},
): Promise<Team[]> => {
  return httpClient.get<Team[]>('/admin/teams', {
    ...(options.search?.trim() ? { search: options.search.trim() } : {}),
    ...(options.active === undefined ? {} : { active: options.active }),
    ...(options.includeInactive ? { includeInactive: true } : {}),
  });
};

export type AdminTeamInput = {
  name: string;
  active?: boolean;
};

export type AdminTeamSearchParams = Pick<AdminTeamQuery, 'search' | 'active'>;

export const adminCreateTeam = async (input: AdminTeamInput): Promise<Team> =>
  httpClient.post<Team>('/admin/teams', {
    name: input.name.trim(),
  });

export const adminUpdateTeam = async (
  id: string,
  input: AdminTeamInput,
): Promise<Team> =>
  httpClient.patch<Team>(`/admin/teams/${id}`, {
    name: input.name.trim(),
    ...(input.active === undefined ? {} : { active: input.active }),
  });

export const adminDeactivateTeam = async (id: string): Promise<Team> =>
  httpClient.delete<Team>(`/admin/teams/${id}`);

export const adminAssignTeamToOrder = async (
  orderId: string,
  teamId: string,
): Promise<Order> => {
  return httpClient.patch<Order>(`/admin/orders/${orderId}/team`, { teamId });
};

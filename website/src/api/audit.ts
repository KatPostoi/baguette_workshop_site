import { httpClient } from './httpClient';
import type { AuditEvent } from './types';

export type AuditFilters = Partial<{
  actorId: string;
  entity: string;
  action: string;
  from: string;
  to: string;
  limit: number;
  offset: number;
}>;

export const fetchAuditEvents = async (
  filters: AuditFilters = {},
): Promise<{ items: AuditEvent[]; total: number }> => {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.set(key, String(value));
  });
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return httpClient.get(`/admin/audit${suffix}`);
};

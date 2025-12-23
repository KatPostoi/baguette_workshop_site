import { httpClient } from './httpClient';
import type { UserProfile } from './types';

export const updateProfile = (payload: { fullName?: string; phone?: string }): Promise<UserProfile> =>
  httpClient.patch<UserProfile>('/users/me', payload);
export const updateProfileExtended = (payload: { fullName?: string; phone?: string; gender?: string }): Promise<UserProfile> =>
  httpClient.patch<UserProfile>('/users/me', payload);

export const changePassword = (payload: { currentPassword: string; newPassword: string }): Promise<void> =>
  httpClient.patch<void>('/users/me/password', payload);

export const adminSearchUsers = async (params: { search?: string; role?: string }) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.role) query.set('role', params.role);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return httpClient.get<UserProfile[]>(`/admin/users${suffix}`);
};

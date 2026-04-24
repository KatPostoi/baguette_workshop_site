import { httpClient } from './httpClient';
import type { UserProfile, UserRole } from './types';

export const updateProfile = (payload: {
  fullName?: string;
  phone?: string;
  gender?: string;
}): Promise<UserProfile> =>
  httpClient.patch<UserProfile>('/users/me', payload);

export const changePassword = (payload: { currentPassword: string; newPassword: string }): Promise<void> =>
  httpClient.patch<void>('/users/me/password', payload);

export type AdminUserSearchParams = {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
};

export type AdminUserUpdateInput = {
  fullName?: string;
  phone?: string | null;
  gender?: string | null;
  role?: UserRole;
  isActive?: boolean;
};

export const adminListUsers = (params: AdminUserSearchParams = {}): Promise<UserProfile[]> =>
  httpClient.get<UserProfile[]>('/admin/users', params);

export const adminUpdateUser = (
  userId: string,
  payload: AdminUserUpdateInput,
): Promise<UserProfile> => httpClient.patch<UserProfile>(`/admin/users/${userId}`, payload);

export const adminDeactivateUser = (userId: string): Promise<UserProfile> =>
  httpClient.delete<UserProfile>(`/admin/users/${userId}`);

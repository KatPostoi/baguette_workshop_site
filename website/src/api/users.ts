import { httpClient } from './httpClient';
import type { UserProfile } from './types';

export const updateProfile = (payload: { fullName?: string; phone?: string }): Promise<UserProfile> =>
  httpClient.patch<UserProfile>('/users/me', payload);

export const changePassword = (payload: { currentPassword: string; newPassword: string }): Promise<void> =>
  httpClient.patch<void>('/users/me/password', payload);

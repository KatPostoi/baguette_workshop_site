import { httpClient } from './httpClient';
import type { AuthResponse, UserProfile } from './types';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  gender?: string;
};

export const login = (payload: LoginPayload): Promise<AuthResponse> =>
  httpClient.post<AuthResponse>('/auth/login', payload);

export const register = (payload: RegisterPayload): Promise<AuthResponse> =>
  httpClient.post<AuthResponse>('/auth/register', payload);

export const fetchProfile = (): Promise<UserProfile> => httpClient.get<UserProfile>('/auth/me');

export const refresh = (): Promise<AuthResponse> => httpClient.post<AuthResponse>('/auth/refresh');

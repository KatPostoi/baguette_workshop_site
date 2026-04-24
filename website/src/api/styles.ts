import { httpClient } from './httpClient';
import type { FrameStyle } from './types';

export const fetchStyles = (): Promise<FrameStyle[]> => httpClient.get('/styles');

export type AdminStyleInput = {
  id: string;
  name: string;
  coefficient: number;
};

export const adminListStyles = async (): Promise<FrameStyle[]> =>
  httpClient.get<FrameStyle[]>('/admin/styles');
export const adminCreateStyle = async (dto: AdminStyleInput) =>
  httpClient.post<FrameStyle>('/admin/styles', dto);
export const adminUpdateStyle = async (
  id: string,
  dto: Omit<AdminStyleInput, 'id'>,
) =>
  httpClient.patch<FrameStyle>(`/admin/styles/${encodeURIComponent(id)}`, dto);
export const adminDeleteStyle = async (id: string) =>
  httpClient.delete<{ success: true }>(`/admin/styles/${encodeURIComponent(id)}`);

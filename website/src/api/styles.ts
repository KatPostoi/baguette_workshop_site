import { httpClient } from './httpClient';
import type { FrameStyle } from './types';

export const fetchStyles = (): Promise<FrameStyle[]> => httpClient.get('/styles');

export const adminListStyles = async (): Promise<FrameStyle[]> => httpClient.get('/admin/styles');
export const adminCreateStyle = async (dto: Partial<FrameStyle>) =>
  httpClient.post<FrameStyle>('/admin/styles', dto);
export const adminUpdateStyle = async (id: string, dto: Partial<FrameStyle>) =>
  httpClient.patch<FrameStyle>(`/admin/styles/${id}`, dto);
export const adminDeleteStyle = async (id: string) => httpClient.delete(`/admin/styles/${id}`);

export const fetchStyleById = (id: string): Promise<FrameStyle> =>
  httpClient.get(`/styles/${encodeURIComponent(id)}`);

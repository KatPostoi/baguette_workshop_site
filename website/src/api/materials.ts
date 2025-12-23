import { httpClient } from './httpClient';
import type { FrameMaterial } from './types';

export const fetchMaterials = (): Promise<FrameMaterial[]> => httpClient.get('/materials');

export const fetchMaterialById = (id: number): Promise<FrameMaterial> =>
  httpClient.get(`/materials/${encodeURIComponent(id.toString())}`);

export const adminListMaterials = async (): Promise<FrameMaterial[]> => httpClient.get('/admin/materials');
export const adminCreateMaterial = async (dto: Partial<FrameMaterial>) =>
  httpClient.post<FrameMaterial>('/admin/materials', dto);
export const adminUpdateMaterial = async (id: number, dto: Partial<FrameMaterial>) =>
  httpClient.patch<FrameMaterial>(`/admin/materials/${id}`, dto);
export const adminDeleteMaterial = async (id: number) =>
  httpClient.delete(`/admin/materials/${id}`);

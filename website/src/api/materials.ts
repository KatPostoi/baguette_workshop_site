import { httpClient } from './httpClient';
import type { FrameMaterial } from './types';

export const fetchMaterials = (): Promise<FrameMaterial[]> => httpClient.get('/materials');

export type AdminMaterialInput = {
  title: string;
  material: string;
  description: string;
  pricePerCm: number;
  imageUrl: string;
  imageAlt: string;
};

export const adminListMaterials = async (): Promise<FrameMaterial[]> =>
  httpClient.get<FrameMaterial[]>('/admin/materials');
export const adminCreateMaterial = async (dto: AdminMaterialInput) =>
  httpClient.post<FrameMaterial>('/admin/materials', dto);
export const adminUpdateMaterial = async (id: number, dto: AdminMaterialInput) =>
  httpClient.patch<FrameMaterial>(`/admin/materials/${id}`, dto);
export const adminDeleteMaterial = async (id: number) =>
  httpClient.delete<{ success: true }>(`/admin/materials/${id}`);

import { request } from './httpClient';
import type { FrameMaterial } from './types';

export const fetchMaterials = (): Promise<FrameMaterial[]> => request('/materials');

export const fetchMaterialById = (id: string): Promise<FrameMaterial> =>
  request(`/materials/${encodeURIComponent(id)}`);

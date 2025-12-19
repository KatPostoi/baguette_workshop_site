import { httpClient } from './httpClient';
import type { FrameMaterial } from './types';

export const fetchMaterials = (): Promise<FrameMaterial[]> => httpClient.get('/materials');

export const fetchMaterialById = (id: number): Promise<FrameMaterial> =>
  httpClient.get(`/materials/${encodeURIComponent(id.toString())}`);

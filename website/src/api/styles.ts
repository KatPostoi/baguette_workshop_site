import { request } from './httpClient';
import type { FrameStyle } from './types';

export const fetchStyles = (): Promise<FrameStyle[]> => request('/styles');

export const fetchStyleById = (id: string): Promise<FrameStyle> =>
  request(`/styles/${encodeURIComponent(id)}`);

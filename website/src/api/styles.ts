import { httpClient } from './httpClient';
import type { FrameStyle } from './types';

export const fetchStyles = (): Promise<FrameStyle[]> => httpClient.get('/styles');

export const fetchStyleById = (id: string): Promise<FrameStyle> =>
  httpClient.get(`/styles/${encodeURIComponent(id)}`);

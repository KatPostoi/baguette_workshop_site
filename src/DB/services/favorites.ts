
import type { FrameItem } from '../types';
import { STORE as CATALOG_STORE } from './catalog';

class Store {
  #generateIsFavoriteStoreKey = (id: string) => `is_favorite_active:${id}`;

  async setIsFavoriteActive(id: string, value: boolean) {
    const key = this.#generateIsFavoriteStoreKey(id);
    localStorage.setItem(key, String(value));
  }

  __getIsFavoriteActive(id: string): boolean {
    const key = this.#generateIsFavoriteStoreKey(id);
    const value = localStorage.getItem(key);
    return value === 'true';
  }

  async getIsFavoriteActive(id: string): Promise<boolean> {
    return this.__getIsFavoriteActive(id)
  }
  async loadLikedFrames(): Promise<Array<FrameItem>> {
    const allData = await CATALOG_STORE.loadDefaultFramesData();
    const isLiked = (item: FrameItem) => this.__getIsFavoriteActive(item.id);
    return allData.filter(isLiked);
  }
}

export const STORE = new Store();

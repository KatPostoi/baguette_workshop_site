import type { FrameData } from "../types";
import { STORE as CATALOG_STORE } from './catalog';

class Store {
  #generateIsBasketStoreKey = (id: string) => `is_basket_active:${id}`;

  async setIsBasketActive(id: string, value: boolean) {
    const key = this.#generateIsBasketStoreKey(id);
    localStorage.setItem(key, String(value));
  }

  __getIsBasketActive(id: string): boolean {
    const key = this.#generateIsBasketStoreKey(id);
    const value = localStorage.getItem(key);
    return value === 'true';
  }

  async getIsBasketActive(id: string): Promise<boolean> {
    return this.__getIsBasketActive(id);
  }

  async loadBasketFrames(): Promise<Array<FrameData>> {
    const allData = await CATALOG_STORE.loadDefaultFramesData();
    const isBasket = (item: FrameData) => this.__getIsBasketActive(item.id);
    return allData.filter(isBasket);
  }
}

export const STORE = new Store();

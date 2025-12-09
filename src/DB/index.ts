import type { FrameData } from "../pages/basket.types";
import { DATA_FROM_DB } from "./basket.data";

class Store {
  #generateIsFavoriteStoreKey = (id: string) => `is_favorite_active:${id}`;
  #generateIsBasketStoreKey = (id: string) => `is_basket_active:${id}`;
  #generateConstructorItemInCatalogKey = (id: string) => `catalog:${id}`;

  async setIsFavoriteActive(id: string, value: boolean) {
    const key = this.#generateIsFavoriteStoreKey(id);
    localStorage.setItem(key, String(value));
  }
  async getIsFavoriteActive(id: string): Promise<boolean> {
    const key = this.#generateIsFavoriteStoreKey(id);
    const value = localStorage.getItem(key);
    return value === 'true';
  }

  async setIsBasketActive(id: string, value: boolean) {
    const key = this.#generateIsBasketStoreKey(id);
    localStorage.setItem(key, String(value));
  }
  async getIsBasketActive(id: string): Promise<boolean> {
    const key = this.#generateIsBasketStoreKey(id);
    const value = localStorage.getItem(key);
    return value === 'true';
  }

  async saveConstructorItemInCatalog(
    data: FrameData) {
    const key = this.#generateConstructorItemInCatalogKey(data.id);
    localStorage.setItem(key, JSON.stringify(data));
  }

  async loadConstructorItemInCatalog(id: string
  ): Promise<FrameData | null> {
    const key = this.#generateConstructorItemInCatalogKey(id);
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null
  }


  async isExistConstructorItemInCatalog(id: string
  ): Promise<boolean> {
    const key = this.#generateConstructorItemInCatalogKey(id);
    const value = localStorage.getItem(key);
    return !!value;
  }

  async loadDefaultFramesAndDostavka() {
    return DATA_FROM_DB;
  }


  async loadLikedFrames(): Promise<(FrameData)[]> {
    return [DATA_FROM_DB[0] as FrameData, DATA_FROM_DB[1] as FrameData];
  }

}

export const STORE = new Store();


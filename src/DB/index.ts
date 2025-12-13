import { FRAMES_DATA } from "./catalog.data";
import { SERVICE_DATA } from "./service.data";
import type { FrameData } from "./types";

class Store {
  #generateIsFavoriteStoreKey = (id: string) => `is_favorite_active:${id}`;
  #generateIsBasketStoreKey = (id: string) => `is_basket_active:${id}`;
  #generateConstructorItemInCatalogKey = (id: string) => `catalog:${id}`;

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

  async loadDefaultFramesData() {
    return FRAMES_DATA;
  }


  async loadServicesData() {
    return SERVICE_DATA;
  }

  async loadLikedFrames(): Promise<Array<FrameData>> {
    const allData = await this.loadDefaultFramesData();
    const isLiked = (item: FrameData) => this.__getIsFavoriteActive(item.id);
    return allData.filter(isLiked);
  }

  async loadBasketFrames(): Promise<Array<FrameData>> {
    const allData = await this.loadDefaultFramesData();
    const isBasket = (item: FrameData) => this.__getIsBasketActive(item.id);
    return allData.filter(isBasket);
  }
}

export const STORE = new Store();

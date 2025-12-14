import type { FrameItem } from "../types";

class Store {
  #generateConstructorItemInCatalogKey = (id: string) => `catalog:${id}`;

  async saveConstructorItemInCatalog(
    data: FrameItem) {
    const key = this.#generateConstructorItemInCatalogKey(data.id);
    localStorage.setItem(key, JSON.stringify(data));
  }

  async loadConstructorItemInCatalog(id: string
  ): Promise<FrameItem | null> {
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
}

export const STORE = new Store();

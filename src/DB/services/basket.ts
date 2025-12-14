import type { BasketItem, BasketStoredItem, FrameItem } from "../types";
import { STORE as CATALOG_STORE } from "./catalog";

const STORAGE_KEY = "basket:items";

const isBrowser = () => typeof window !== "undefined";

const normalizeQuantity = (quantity: number) => {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return 0;
  }
  return Math.floor(quantity);
};

class Store {
  #readItems(): Array<BasketStoredItem> {
    if (!isBrowser()) {
      return [];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map((item) => ({
          frameId: String(item.frameId),
          quantity: normalizeQuantity(Number(item.quantity)),
        }))
        .filter((item) => Boolean(item.frameId));
    } catch {
      return [];
    }
  }

  #writeItems(items: Array<BasketStoredItem>) {
    if (!isBrowser()) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  #setItems(nextItems: Array<BasketStoredItem>) {
    const uniqueItems = nextItems.reduce<Array<BasketStoredItem>>((acc, item) => {
      if (!item.frameId) {
        return acc;
      }
      const existingIndex = acc.findIndex((stored) => stored.frameId === item.frameId);
      if (existingIndex >= 0) {
        if (item.quantity > 0) {
          acc[existingIndex] = { frameId: item.frameId, quantity: item.quantity };
        } else {
          acc.splice(existingIndex, 1);
        }
      } else {
        if (item.quantity > 0) {
          acc.push({ frameId: item.frameId, quantity: item.quantity });
        }
      }
      return acc;
    }, []);
    this.#writeItems(uniqueItems);
  }

  async getIsBasketActive(id: string): Promise<boolean> {
    const items = this.#readItems();
    return items.some((item) => item.frameId === id);
  }

  async setIsBasketActive(id: string, value: boolean) {
    if (value) {
      const items = this.#readItems();
      const exists = items.some((item) => item.frameId === id);
      if (!exists) {
        items.push({ frameId: id, quantity: 1 });
        this.#setItems(items);
      }
      return;
    }
    await this.removeItem(id);
  }

  async loadStoredItems(): Promise<Array<BasketStoredItem>> {
    return this.#readItems();
  }

  async loadBasketFrames(): Promise<Array<FrameItem>> {
    const [catalogFrames, stored] = await Promise.all([
      CATALOG_STORE.loadDefaultFramesData(),
      this.loadStoredItems(),
    ]);
    const ids = new Set(stored.map((item) => item.frameId));
    return catalogFrames.filter((frame) => ids.has(frame.id));
  }

  async getDetailedItems(): Promise<Array<BasketItem>> {
    const [catalogFrames, stored] = await Promise.all([
      CATALOG_STORE.loadDefaultFramesData(),
      this.loadStoredItems(),
    ]);
    const framesMap = new Map(catalogFrames.map((frame) => [frame.id, frame]));

    return stored
      .map((item) => {
        const frame = framesMap.get(item.frameId);
        if (!frame) {
          return null;
        }
        return {
          frame,
          quantity: item.quantity,
        };
      })
      .filter((value): value is BasketItem => value !== null);
  }

  async addItem(frameId: string, quantity = 1) {
    if (!frameId) {
      return;
    }
    const items = this.#readItems();
    const existing = items.find((item) => item.frameId === frameId);
    if (existing) {
      existing.quantity = Math.max(1, normalizeQuantity(existing.quantity + quantity));
    } else {
      const normalized = Math.max(1, normalizeQuantity(quantity));
      items.push({ frameId, quantity: normalized });
    }
    this.#setItems(items);
  }

  async updateQuantity(frameId: string, quantity: number) {
    const normalizedQuantity = normalizeQuantity(quantity);
    if (normalizedQuantity <= 0) {
      await this.removeItem(frameId);
      return;
    }
    const items = this.#readItems();
    const existing = items.find((item) => item.frameId === frameId);
    if (!existing) {
      items.push({ frameId, quantity: normalizedQuantity });
      this.#setItems(items);
      return;
    }

    existing.quantity = normalizedQuantity;
    this.#setItems(items);
  }

  async incrementQuantity(frameId: string) {
    await this.addItem(frameId, 1);
  }

  async decrementQuantity(frameId: string) {
    const items = this.#readItems();
    const existing = items.find((item) => item.frameId === frameId);
    if (!existing) {
      return;
    }

    existing.quantity -= 1;
    if (existing.quantity <= 0) {
      await this.removeItem(frameId);
      return;
    }

    this.#setItems(items);
  }

  async removeItem(frameId: string) {
    const items = this.#readItems();
    const filtered = items.filter((item) => item.frameId !== frameId);
    this.#setItems(filtered);
  }

  async clear() {
    this.#writeItems([]);
  }
}

export const STORE = new Store();

class Store {
  generateIsFavoriteStoreKey = (id: string) => `is_favorite_active:${id}`;

  async setIsFavoriteActive(id: string, value: boolean) {
    const key = this.generateIsFavoriteStoreKey(id);
    localStorage.setItem(key, String(value));
  }
  async getIsFavoriteActive(id: string): Promise<boolean> {
    const key = this.generateIsFavoriteStoreKey(id);
    const value = localStorage.getItem(key);
    return value === 'true';
  }
}

export const STORE = new Store();
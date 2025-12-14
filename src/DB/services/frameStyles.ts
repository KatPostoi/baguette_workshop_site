import { STYLES_DATA } from "../tables/styles.data";

class Store {
  async loadAllData() {
    return STYLES_DATA;
  }
}

export const STORE = new Store();

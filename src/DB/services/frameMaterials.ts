import { MATERIALS_DATA } from "../tables/materials.data";

class Store {
  async loadMaterialsData() {
    return MATERIALS_DATA;
  }
}

export const STORE = new Store();

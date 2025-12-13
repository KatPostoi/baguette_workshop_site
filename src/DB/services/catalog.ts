import { FRAMES_DATA } from "../tables/catalog.data";

class Store {
  async loadDefaultFramesData() {
    return FRAMES_DATA;
  }
}

export const STORE = new Store();

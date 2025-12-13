import { SERVICE_DATA } from "../tables/service.data";

class Store {

  async loadServicesData() {
    return SERVICE_DATA;
  }
}

export const STORE = new Store();

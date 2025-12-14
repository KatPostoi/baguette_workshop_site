import { useEffect, useState } from "react";
import { SERVICES_STORE } from "../DB";
import type { ServiceItem } from "../DB/types";

export const useServicesData = () => {
  const [servicesData, setServicesData] = useState<Array<ServiceItem>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await SERVICES_STORE.loadServicesData();
    setServicesData(data);
  };

  return [servicesData] as const;
};

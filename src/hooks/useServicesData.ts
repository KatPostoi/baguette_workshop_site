import { useEffect, useState } from "react";
import { SERVICES_STORE } from "../DB";
import type { ServiceData } from "../DB/types";

export const useServicesData = () => {
  const [servicesData, setServicesData] = useState<Array<ServiceData>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await SERVICES_STORE.loadServicesData();
    setServicesData(data);
  };

  return [servicesData] as const;
};

import { useEffect, useState } from "react";
import { STORE } from "../DB";
import type { ServiceData } from "../DB/types";

export const useServicesData = () => {
  const [servicesData, setServicesData] = useState<Array<ServiceData>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await STORE.loadServicesData();
    setServicesData(data);
  };

  return [servicesData] as const;
};

import { useEffect, useState } from "react";
import { CATALOG_STORE } from "../DB";
import type { FrameItem, } from "../DB/types";

export const useFramesCatalog = () => {
  const [framesCatalogData, setFramesCatalogData] = useState<Array<FrameItem>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await CATALOG_STORE.loadDefaultFramesData();
    setFramesCatalogData(data);
  };

  return [framesCatalogData] as const;
};

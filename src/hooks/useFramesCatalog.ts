import { useEffect, useState } from "react";
import { CATALOG_STORE } from "../DB";
import type { FrameData, } from "../DB/types";

export const useFramesCatalog = () => {
  const [framesCatalogData, setFramesCatalogData] = useState<Array<FrameData>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await CATALOG_STORE.loadDefaultFramesData();
    setFramesCatalogData(data);
  };

  return [framesCatalogData] as const;
};

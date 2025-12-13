import { useEffect, useState } from "react";
import { STORE } from "../DB";
import type { FrameData, } from "../DB/types";

export const useFramesCatalogData = () => {
  const [framesCatalogData, setFramesCatalogData] = useState<Array<FrameData>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await STORE.loadDefaultFramesData();
    setFramesCatalogData(data);
  };

  return [framesCatalogData] as const;
};

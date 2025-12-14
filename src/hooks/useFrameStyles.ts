import { useEffect, useState } from "react";
import { STYLES_STORE } from "../DB";
import type { StyleItem } from "../DB/types";

export const useFrameStyles = () => {
  const [frameStyles, setFrameStyles] = useState<Array<StyleItem>>([]);

  const loadData = async () => {
    const data = await STYLES_STORE.loadAllData();
    setFrameStyles(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return [frameStyles] as const;
};

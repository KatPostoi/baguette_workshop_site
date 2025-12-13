import { useEffect, useState } from "react";
import { BASKET_STORE } from "../DB";
import type { FrameData } from "../DB/types";

export const useBasketFrames = () => {
  const [basketFrames, setBasketFrames] = useState<Array<FrameData>>([]);

  const loadData = async () => {
    const data = await BASKET_STORE.loadBasketFrames();
    setBasketFrames(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return [basketFrames] as const;
};

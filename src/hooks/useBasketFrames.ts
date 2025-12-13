import { useEffect, useState } from "react";
import { STORE } from "../DB";
import type { FrameData } from "../DB/types";

export const useBasketFrames = () => {
  const [basketFrames, setBasketFrames] = useState<Array<FrameData>>([]);

  const loadData = async () => {
    const data = await STORE.loadBasketFrames();
    setBasketFrames(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return [basketFrames] as const;
};
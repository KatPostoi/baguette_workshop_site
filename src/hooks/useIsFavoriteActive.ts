import { useLayoutEffect, useState } from "react";
import { STORE } from "../DB";
import type { FrameData } from "../pages/basket.types";

export const useIsFavoriteActive = (frameData: FrameData) => {
  const [isFavoriteActive, setIsFavoriteActive] = useState(false);

  const handleFavoriteToggle = async () => {
    const newValue = !isFavoriteActive;
    setIsFavoriteActive(newValue);
    const isExistItem = await STORE.isExistConstructorItemInCatalog(frameData.id)
    if (!isExistItem) {
      await STORE.saveConstructorItemInCatalog(frameData)
    }
    await STORE.setIsFavoriteActive(frameData.id, newValue);
  };

  const reloadValue = async () => {
    const itemValue = await STORE.getIsFavoriteActive(frameData.id);
    setIsFavoriteActive(itemValue);
  };

  useLayoutEffect(() => {
    reloadValue();
  }, [frameData]);

  return [isFavoriteActive, handleFavoriteToggle] as const;
};

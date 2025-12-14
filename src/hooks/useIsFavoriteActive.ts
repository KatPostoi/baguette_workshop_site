import { useLayoutEffect, useState } from "react";
import { FAVORITES_STORE, CONSTRUCTOR_STORE } from "../DB";
import type { FrameItem } from "../DB/types";

export const useIsFavoriteActive = (frameData: FrameItem) => {
  const [isFavoriteActive, setIsFavoriteActive] = useState(false);

  const handleFavoriteToggle = async () => {
    const newValue = !isFavoriteActive;
    setIsFavoriteActive(newValue);
    const isExistItem = await CONSTRUCTOR_STORE.isExistConstructorItemInCatalog(frameData.id)
    if (!isExistItem) {
      await CONSTRUCTOR_STORE.saveConstructorItemInCatalog(frameData)
    }
    await FAVORITES_STORE.setIsFavoriteActive(frameData.id, newValue);
  };

  const reloadValue = async () => {
    const itemValue = await FAVORITES_STORE.getIsFavoriteActive(frameData.id);
    setIsFavoriteActive(itemValue);
  };

  useLayoutEffect(() => {
    reloadValue();
  }, [frameData]);

  return [isFavoriteActive, handleFavoriteToggle] as const;
};

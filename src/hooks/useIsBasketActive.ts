import { useLayoutEffect, useState } from "react";
import { STORE } from "../DB";
import type { FrameData } from "../pages/basket.types";

export const useIsBasketActive = (frameData: FrameData) => {
  const [isBasketActive, setIsBasketActive] = useState(false);

  const handleBasketToggle = async () => {
    const newValue = !isBasketActive;
    setIsBasketActive(newValue);
    const isExistItem = await STORE.isExistConstructorItemInCatalog(frameData.id)
    if (!isExistItem) {
      await STORE.saveConstructorItemInCatalog(frameData)
    }
    await STORE.setIsBasketActive(frameData.id, newValue);
  };

  const loadValueFromStore = async (id: string) => {
    return await STORE.getIsBasketActive(id);
  };

  const reloadValue = async () => {
    const itemValue = await loadValueFromStore(frameData.id);
    setIsBasketActive(itemValue);
  };

  useLayoutEffect(() => {
    reloadValue();
  }, [frameData.id]);

  return [isBasketActive, handleBasketToggle] as const;
};

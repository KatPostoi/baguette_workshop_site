import { useLayoutEffect, useState } from "react";
import { CONSTRUCTOR_STORE, BASKET_STORE } from "../DB";
import type { FrameData } from "../DB/types";

export const useIsBasketActive = (frameData: FrameData) => {
  const [isBasketActive, setIsBasketActive] = useState(false);

  const handleBasketToggle = async () => {
    const newValue = !isBasketActive;
    setIsBasketActive(newValue);
    const isExistItem = await CONSTRUCTOR_STORE.isExistConstructorItemInCatalog(frameData.id)
    if (!isExistItem) {
      await CONSTRUCTOR_STORE.saveConstructorItemInCatalog(frameData)
    }
    await BASKET_STORE.setIsBasketActive(frameData.id, newValue);
  };

  const loadValueFromStore = async (id: string) => {
    return await BASKET_STORE.getIsBasketActive(id);
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

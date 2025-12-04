import { useLayoutEffect, useState } from "react";
import { STORE } from "../DB";

export const useIsFavoriteActive = (itemId: string) => {
  const [isFavoriteActive, setIsFavoriteActive] = useState(false);

  const handleFavoriteToggle = async () => {
    const newValue = !isFavoriteActive;
    setIsFavoriteActive(newValue);
    await STORE.setIsFavoriteActive(itemId, newValue);
  };

  const loadValueFromStore = async (id: string) => {
    return await STORE.getIsFavoriteActive(id);
  };

  const reloadValue = async () => {
    const itemValue = await loadValueFromStore(itemId);
    setIsFavoriteActive(itemValue);
  };

  useLayoutEffect(() => {
    reloadValue();
  }, [itemId]);

  return [isFavoriteActive, handleFavoriteToggle] as const;
};

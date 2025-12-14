import { useEffect, useState } from "react";
import { FAVORITES_STORE } from "../DB";
import type { FrameItem } from "../DB/types";

export const useLikedFrames = () => {
  const [likedFrames, setLikedFrames] = useState<FrameItem[]>([]);

  const loadData = async () => {
    const data = await FAVORITES_STORE.loadLikedFrames();
    setLikedFrames(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return likedFrames;
};

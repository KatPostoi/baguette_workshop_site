import { useEffect, useState } from "react";
import { FAVORITES_STORE } from "../DB";
import type { FrameData } from "../DB/types";

export const useLikedFrames = () => {
  const [likedFrames, setLikedFrames] = useState<FrameData[]>([]);

  const loadData = async () => {
    const data = await FAVORITES_STORE.loadLikedFrames();
    setLikedFrames(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return likedFrames;
};

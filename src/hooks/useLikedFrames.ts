import { useEffect, useState } from "react";
import { STORE } from "../DB";
import type { FrameData } from "../DB/types";

export const useLikedFrames = () => {
  const [likedFrames, setLikedFrames] = useState<FrameData[]>([]);

  const loadData = async () => {
    const data = await STORE.loadLikedFrames();
    setLikedFrames(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return likedFrames;
};
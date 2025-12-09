import { useEffect, useMemo, useState } from "react";
import type { FrameData, UslugaData } from "../pages/basket.types";
import { STORE } from "../DB";

export const useDefaultFramesAndDostavka = () => {
  const [defaultFramesAndDostavka, setDefaultFramesAndDostavka] = useState<Array<FrameData | UslugaData>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const frames = useMemo(
    () => defaultFramesAndDostavka.filter((item) => item.type === 'rama') as Array<FrameData>,
    [defaultFramesAndDostavka]
  );

  const dostavkas = useMemo(
    () => defaultFramesAndDostavka.filter((item) => item.type === 'dostavka') as Array<UslugaData>,
    [defaultFramesAndDostavka]
  );

  const loadData = async () => {
    const data = await STORE.loadDefaultFramesAndDostavka();
    setDefaultFramesAndDostavka(data);
  };

  return [frames, dostavkas] as const;
};

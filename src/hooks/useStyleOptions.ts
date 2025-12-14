import { useEffect, useState } from "react";
import type { StyleItem } from "../DB/types";
import { useFrameStyles } from "./useFrameStyles";

export type StyleOption = {
  id: string;
  label: string;
  coefficient: number;
};

const buildStyleOptions = (styles: Array<StyleItem>): Array<StyleOption> =>
  styles.map((item) => ({
    id: item.id,
    label: item.style,
    coefficient: item.coefficient,
  }));

export const useStyleOptions = () => {
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
  const [styles] = useFrameStyles();
  const [styleOptions, setStyleOptions] = useState<Array<StyleOption>>([]);

  useEffect(() => {
    setStyleOptions(buildStyleOptions(styles));
  }, [styles]);

  return {
    styleOptions,
    selectedStyle,
    setSelectedStyle,
  };
};

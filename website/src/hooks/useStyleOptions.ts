import { useEffect, useMemo, useState } from 'react';
import type { FrameStyle } from '../api/types';
import { useFrameStyles } from './useFrameStyles';

export type StyleOption = {
  id: string;
  label: string;
  coefficient: number;
};

const buildStyleOptions = (styles: FrameStyle[]): StyleOption[] =>
  styles.map((item) => ({
    id: item.id,
    label: item.name,
    coefficient: item.coefficient,
  }));

export const useStyleOptions = () => {
  const { styles, isLoading } = useFrameStyles();
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);

  const styleOptions = useMemo(() => buildStyleOptions(styles), [styles]);

  useEffect(() => {
    if (selectedStyle && !styleOptions.some((option) => option.id === selectedStyle.id)) {
      setSelectedStyle(null);
    }
  }, [styleOptions, selectedStyle]);

  return {
    styleOptions,
    selectedStyle,
    setSelectedStyle,
    isLoading,
  };
};

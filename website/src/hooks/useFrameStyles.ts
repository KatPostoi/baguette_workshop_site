import { useCallback, useEffect, useState } from 'react';
import { fetchStyles } from '../api/styles';
import type { FrameStyle } from '../api/types';

type UseFrameStylesResult = {
  styles: FrameStyle[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

export const useFrameStyles = (): UseFrameStylesResult => {
  const [styles, setStyles] = useState<FrameStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchStyles();
      setStyles(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить стили.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return {
    styles,
    isLoading,
    error,
    reload: loadData,
  };
};

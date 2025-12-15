import { useCallback, useEffect, useState } from 'react';
import { fetchMaterials } from '../api/materials';
import type { FrameMaterial } from '../api/types';

type UseFrameMaterialsResult = {
  materials: FrameMaterial[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

export const useFrameMaterials = (): UseFrameMaterialsResult => {
  const [materials, setMaterials] = useState<FrameMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchMaterials();
      setMaterials(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить материалы.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return {
    materials,
    isLoading,
    error,
    reload: loadData,
  };
};

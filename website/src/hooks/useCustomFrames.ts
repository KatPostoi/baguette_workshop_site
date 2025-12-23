import { useCallback, useEffect, useState } from 'react';
import { deleteCustomFrame, fetchMyCustomFrames } from '../api/customFrames';
import type { FrameItem } from '../api/types';
import { useAuth } from '../state/AuthContext';
import { ApiError } from '../api/httpClient';

type UseCustomFramesResult = {
  frames: FrameItem[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useCustomFrames = (): UseCustomFramesResult => {
  const { user, status, logout } = useAuth();
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setFrames([]);
      setError(null);
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchMyCustomFrames();
      setFrames(data);
      setError(null);
    } catch (err) {
      console.error(err);
      if (err instanceof ApiError && err.status === 401) {
        logout();
        setError('Сессия истекла. Авторизуйтесь снова.');
      } else {
        setError('Не удалось загрузить кастомные рамы.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout, user]);

  useEffect(() => {
    if (status === 'authenticated') {
      void load();
    } else if (status === 'unauthenticated') {
      setFrames([]);
    }
  }, [load, status]);

  const remove = useCallback(
    async (id: string) => {
      await deleteCustomFrame(id);
      setFrames((prev) => prev.filter((frame) => frame.id !== id));
    },
    [],
  );

  return { frames, isLoading, error, reload: load, remove };
};

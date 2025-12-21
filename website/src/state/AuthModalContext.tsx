import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

type AuthModalMode = 'login' | 'register';

type AuthModalContextValue = {
  isOpen: boolean;
  mode: AuthModalMode;
  redirectTo: string | null;
  open: (mode?: AuthModalMode, redirectTo?: string | null) => void;
  close: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>('login');
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  const open = useCallback((nextMode: AuthModalMode = 'login', nextRedirect?: string | null) => {
    setMode(nextMode);
    setRedirectTo(nextRedirect ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo<AuthModalContextValue>(
    () => ({ isOpen, mode, open, close, redirectTo }),
    [isOpen, mode, open, close, redirectTo],
  );

  useEffect(() => {
    const handleUnauthorized = () => {
      open('login');
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handleUnauthorized);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:unauthorized', handleUnauthorized);
      }
    };
  }, [open]);

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthModal = (): AuthModalContextValue => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return ctx;
};

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  fetchProfile,
  login as apiLogin,
  register as apiRegister,
  refresh as apiRefresh,
} from '../api/auth';
import type { AuthResponse, UserProfile } from '../api/types';
import {
  setAuthTokenProvider,
  setUnauthorizedHandler,
} from '../api/httpClient';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  user: UserProfile | null;
  token: string | null;
  status: AuthStatus;
  login: (payload: {
    email: string;
    password: string;
    remember?: boolean;
  }) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    remember?: boolean;
  }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const TOKEN_STORAGE_KEY = 'authToken';
const REMEMBER_STORAGE_KEY = 'authRemember';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const abortRef = useRef(false);

  useEffect(() => {
    abortRef.current = false;
    return () => {
      abortRef.current = true;
    };
  }, []);

  useEffect(() => {
    setAuthTokenProvider(() => token);
  }, [token]);

  const persistAuth = useCallback((auth: AuthResponse) => {
    setUser(auth.user);
    setToken(auth.token);
    setAuthTokenProvider(() => auth.token);
    if (typeof window !== 'undefined') {
      storageRef.current?.setItem(TOKEN_STORAGE_KEY, auth.token);
    }
    setStatus('authenticated');
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthTokenProvider(() => null);
    if (typeof window !== 'undefined') {
      storageRef.current?.removeItem(TOKEN_STORAGE_KEY);
      storageRef.current?.removeItem(REMEMBER_STORAGE_KEY);
    }
    setStatus('unauthenticated');
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) {
      clearAuth();
      return;
    }

    setStatus((prev) => (prev === 'authenticated' ? prev : 'loading'));
    try {
      const profile = await fetchProfile();
      if (!abortRef.current) {
        setUser(profile);
        setStatus('authenticated');
      }
    } catch (err) {
      console.error(err);
      if (!abortRef.current) {
        clearAuth();
      }
    }
  }, [token, clearAuth]);

  const storageRef = useRef<Storage | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const remember = localStorage.getItem(REMEMBER_STORAGE_KEY) === 'true';
    storageRef.current = remember ? localStorage : sessionStorage;
    const savedToken = storageRef.current.getItem(TOKEN_STORAGE_KEY);
    setToken(savedToken);
    setStatus(savedToken ? 'loading' : 'unauthenticated');
  }, []);

  useEffect(() => {
    if (token) {
      void refreshProfile();
    } else {
      setStatus('unauthenticated');
    }
  }, [token, refreshProfile]);

  const login = useCallback(
    async (payload: {
      email: string;
      password: string;
      remember?: boolean;
    }) => {
      if (typeof window !== 'undefined') {
        storageRef.current = payload.remember ? localStorage : sessionStorage;
        storageRef.current.setItem(
          REMEMBER_STORAGE_KEY,
          String(Boolean(payload.remember))
        );
      }
      if (payload.remember ?? undefined) {
        delete payload.remember;
      }
      const auth = await apiLogin(payload);
      persistAuth(auth);
    },
    [persistAuth]
  );

  const register = useCallback(
    async (payload: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
      remember?: boolean;
    }) => {
      if (typeof window !== 'undefined') {
        storageRef.current = payload.remember ? localStorage : sessionStorage;
        storageRef.current.setItem(
          REMEMBER_STORAGE_KEY,
          String(Boolean(payload.remember))
        );
      }
      if (payload.remember ?? undefined) {
        delete payload.remember;
      }
      const auth = await apiRegister(payload);
      persistAuth(auth);
    },
    [persistAuth]
  );

  const refreshTokens = useCallback(async () => {
    try {
      const auth = await apiRefresh();
      persistAuth(auth);
    } catch (err) {
      console.error(err);
      clearAuth();
    }
  }, [clearAuth, persistAuth]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void refreshTokens();
    });
  }, [refreshTokens]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      status,
      login,
      register,
      logout: clearAuth,
      refreshProfile,
    }),
    [user, token, status, login, register, clearAuth, refreshProfile]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

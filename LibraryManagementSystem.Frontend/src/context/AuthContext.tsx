import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { clearAuth, loadAuth, setAuthUpdateHandler } from '../api/client';
import type { LoginResponse } from '../types/api';

interface AuthContextValue {
  user: LoginResponse | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  setUser: (user: LoginResponse | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(() => loadAuth());

  useEffect(() => {
    setAuthUpdateHandler(setUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAdmin: user?.roles.includes('Admin') ?? false,
      isAuthenticated: !!user?.accessToken,
      logout: () => {
        clearAuth();
        setUser(null);
      },
      setUser,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

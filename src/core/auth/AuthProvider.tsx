import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiClient } from "../api/apiClient";
import type { SessionUser } from "../api/types";

interface AuthContextValue {
  session: SessionUser | null;
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (session: SessionUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    setSession(apiClient.getStoredSession());
    setIsBootstrapping(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const nextSession = await apiClient.login(email, password);
    setSession(nextSession);
  }, []);

  const logout = useCallback(async () => {
    await apiClient.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isBootstrapping,
      login,
      logout,
      setSession,
    }),
    [isBootstrapping, login, logout, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

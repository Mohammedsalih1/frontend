import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import * as api from '../api/mockApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => api.getSession());

  const login = useCallback(async (creds) => {
    const s = await api.login(creds);
    setSession(s);
    return s.user;
  }, []);

  const register = useCallback(async (data) => {
    const s = await api.register(data);
    setSession(s);
    return s.user;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ user: session?.user || null, isAdmin: session?.user?.role === 'admin', login, register, logout }),
    [session, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

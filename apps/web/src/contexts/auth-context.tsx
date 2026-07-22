'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiClient, setToken, clearToken, setRefreshToken, getToken, getRefreshToken } from '@/lib/api-client';
import type { User, LoginDto, RegisterDto, AuthResponse } from '@/lib/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      return;
    }
    try {
      const user = await apiClient.get<User>('/auth/profile');
      setState({ user, isLoading: false, isAuthenticated: true });
    } catch {
      clearToken();
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (dto: LoginDto) => {
    const res = await apiClient.post<AuthResponse>('/auth/login', dto);
    setToken(res.tokens.accessToken);
    setRefreshToken(res.tokens.refreshToken);
    setState({ user: res.user, isLoading: false, isAuthenticated: true });
  }, []);

  const register = useCallback(async (dto: RegisterDto) => {
    const res = await apiClient.post<AuthResponse>('/auth/register', dto);
    setToken(res.tokens.accessToken);
    setRefreshToken(res.tokens.refreshToken);
    setState({ user: res.user, isLoading: false, isAuthenticated: true });
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
    } finally {
      clearToken();
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearToken();
      setState({ user: null, isLoading: false, isAuthenticated: false });
      return;
    }
    try {
      const res = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
      setToken(res.tokens.accessToken);
      if (res.tokens.refreshToken) setRefreshToken(res.tokens.refreshToken);
      setState({ user: res.user, isLoading: false, isAuthenticated: true });
    } catch {
      clearToken();
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

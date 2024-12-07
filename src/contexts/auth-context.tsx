'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials, logout as logoutAction } from '@/redux/features/authSlice';

interface DecodedToken {
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  exp: number;
}

interface User {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          if (decoded && decoded.exp * 1000 > Date.now()) {
            const user = {
              id: decoded.email,
              email: decoded.email,
              role: decoded.role,
            };
            setUser(user);
            dispatch(setCredentials({ user, token }));
          } else {
            localStorage.removeItem('token');
          }
        } catch {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [dispatch]);

  const login = (accessToken: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);
      const user = {
        id: decoded.email,
        email: decoded.email,
        role: decoded.role,
      };
      localStorage.setItem('token', accessToken);
      document.cookie = `token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
      setUser(user);
      dispatch(setCredentials({ user, token: accessToken }));
    } catch (error) {
      console.error('Failed to decode token:', error);
      throw new Error('Invalid token');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setUser(null);
    dispatch(logoutAction());
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
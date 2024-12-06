'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  iat: number;
  exp: number;
}

interface User {
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setUser({
            email: decoded.email,
            role: decoded.role,
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (accessToken: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);
      localStorage.setItem('token', accessToken);
      document.cookie = `token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
      setUser({
        email: decoded.email,
        role: decoded.role,
      });
    } catch (error) {
      console.error('Failed to decode token:', error);
      throw new Error('Invalid token');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setUser(null);
    window.location.href = '/auth/login';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
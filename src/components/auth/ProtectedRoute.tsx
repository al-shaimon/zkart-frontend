'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!isLoading && user) {
      const baseRoute = pathname.split('/')[1];
      
      // Additional client-side protection
      if (user.role === 'CUSTOMER' && baseRoute !== 'profile') {
        router.push('/profile');
      } else if (user.role === 'VENDOR' && baseRoute !== 'vendor') {
        router.push('/vendor/dashboard');
      } else if (user.role === 'ADMIN' && baseRoute !== 'admin') {
        router.push('/admin/dashboard');
      }
    }
  }, [user, router, isLoading, pathname]);

  if (isLoading || !user) {
    return null;
  }

  return <>{children}</>;
} 
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface AuthRouteProps {
  children: React.ReactNode;
}

export default function AuthRoute({ children }: AuthRouteProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // If user is logged in, redirect based on their role
      if (user.role === 'CUSTOMER') {
        router.push('/');
      } else {
        router.push(`/${user.role.toLowerCase()}/dashboard`);
      }
    }
  }, [user, router, isLoading]);

  // Show nothing while checking auth
  if (isLoading) {
    return null;
  }

  // Only show content if user is not logged in
  if (user) {
    return null;
  }

  return <>{children}</>;
} 
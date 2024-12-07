'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import RecentProducts from '@/components/recent-products/RecentProducts';

export default function RecentProductsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'CUSTOMER') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-2xl font-bold mb-6">Recently Viewed Products</h1>
        <RecentProducts />
      </div>
    </div>
  );
} 
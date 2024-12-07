'use client';

import { Scale } from 'lucide-react';
import { Button } from './ui/button';
import { useCompare } from '@/contexts/compare-context';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export function CompareFloatingButton() {
  const { compareProducts } = useCompare();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || user?.role !== 'CUSTOMER' || compareProducts.length === 0) {
    return null;
  }

  return (
    <Button
      className="fixed bottom-24 right-6 z-50 rounded-full shadow-lg"
      size="icon"
      onClick={() => router.push('/compare')}
    >
      <Scale className="h-5 w-5" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
        {compareProducts.length}
      </span>
    </Button>
  );
} 
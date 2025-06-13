'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { API_BASE_URL } from '@/config/api';

interface ProductViewTrackerProps {
  productId: string;
}

export default function ProductViewTracker({ productId }: ProductViewTrackerProps) {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const recordView = async () => {
      if (isAuthenticated && user?.role === 'CUSTOMER') {
        try {
          await fetch(`${API_BASE_URL}/recent-view`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              productId,
            }),
          });
        } catch (error) {
          console.error('Failed to record product view:', error);
        }
      }
    };

    recordView();
  }, [productId, isAuthenticated, user]);

  return null; // This component doesn't render anything
}

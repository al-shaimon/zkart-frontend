'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { API_BASE_URL } from '@/config/api';
import { revalidateRecentlyViewedProducts } from '@/actions/revalidate/revalidateRecentlyViewed';

interface ProductViewTrackerProps {
  productId: string;
}

export default function ProductViewTracker({ productId }: ProductViewTrackerProps) {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const recordView = async () => {
      if (isAuthenticated && user?.role === 'CUSTOMER') {
        try {
          const response = await fetch(`${API_BASE_URL}/recent-view`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              productId,
            }),
          });

          // If the view was recorded successfully, revalidate the cache
          if (response.ok) {
            await revalidateRecentlyViewedProducts();
          }
        } catch (error) {
          console.error('Failed to record product view:', error);
        }
      }
    };

    recordView();
  }, [productId, isAuthenticated, user]);

  return null; // This component doesn't render anything
}

'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/api';
import { Product } from '@/types/api';
import ProductCard from '@/components/products/ProductCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentView {
  id: string;
  viewedAt: string;
  product: Product;
}

export default function RecentProducts() {
  const [loading, setLoading] = useState(true);
  const [recentViews, setRecentViews] = useState<RecentView[]>([]);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/recent-view`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          // Sort by viewedAt in descending order and take last 10
          const sortedViews = data.data
            .sort((a: RecentView, b: RecentView) => 
              new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
            )
            .slice(0, 10);
          
          setRecentViews(sortedViews);
        }
      } catch (error) {
        console.error('Failed to fetch recent products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (recentViews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No recently viewed products</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recentViews.map((view) => (
          <div key={view.id} className="relative">
            <ProductCard product={view.product} />
            
          </div>
        ))}
      </div>
    </div>
  );
} 
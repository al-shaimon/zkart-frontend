'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/api';
import { Product } from '@/types/api';
import ProductCard from '@/components/products/ProductCard';
import { useAuth } from '@/contexts/auth-context';

export default function RecentlyViewedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchRecentlyViewedProducts = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const response = await fetch(`${API_BASE_URL}/recent-view`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          // Extract products from the recent views and take the first 4
          const recentProducts = data.data.map((view: any) => view.product).slice(0, 4);
          setProducts(recentProducts);
        }
      } catch (error) {
        console.error('Failed to fetch recently viewed products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewedProducts();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
} 
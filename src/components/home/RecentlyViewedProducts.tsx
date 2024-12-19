'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/api';
import { Product } from '@/types/api';
import ProductCard from '@/components/products/ProductCard';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { useAuth } from '@/contexts/auth-context';

interface RecentView {
  id: string;
  viewedAt: string;
  product: Product;
}

export default function RecentlyViewedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchRecentlyViewedProducts = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/recent-view`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          const recentProducts = data.data.map((view: RecentView) => view.product).slice(0, 4);
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

  if (!isAuthenticated || (!loading && products.length === 0)) {
    return null;
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          // Show skeletons while loading
          [...Array(4)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : (
          // Show actual products
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  );
} 
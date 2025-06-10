'use client';

import { Product } from '@/types/api';
import ProductCard from '@/components/products/ProductCard';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { useAuth } from '@/contexts/auth-context';

interface RecentViewProps {
  products: Product[];
  isLoading?: boolean;
}

export default function RecentlyViewedProducts({ products, isLoading = false }: RecentViewProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated || (!isLoading && products.length === 0)) {
    return null;
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? // Show skeletons while loading
            [...Array(4)].map((_, index) => <ProductSkeleton key={index} />)
          : // Show actual products
            products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}

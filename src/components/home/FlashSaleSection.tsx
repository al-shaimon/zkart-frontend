'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ProductCard from '../products/ProductCard';
import ProductSkeleton from '../products/ProductSkeleton';
import { Product } from '@/types/api';

interface FlashSaleSectionProps {
  products: Product[];
  isLoading?: boolean;
}

export default function FlashSaleSection({ products, isLoading = false }: FlashSaleSectionProps) {
  const router = useRouter();

  return (
    <section id="flash-sale" className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Flash Sale</h2>
        <Button variant="outline" onClick={() => router.push('/flash-sale')}>
          View All
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No flash sale products available
        </div>
      )}
    </section>
  );
}

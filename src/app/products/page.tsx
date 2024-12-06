'use client';

import { Suspense  } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import { Loader2 } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <ProductGrid categoryId={searchParams.get('category')} />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto" />
          <p className="mt-4">Loading products...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

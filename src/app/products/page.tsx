import { Suspense } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import Footer from '@/components/Footer';

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Products</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of high-quality products. From the latest electronics to trending
            accessories, find everything you need at competitive prices.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {' '}
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid searchParams={resolvedSearchParams} />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

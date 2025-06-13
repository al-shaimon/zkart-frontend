import { Suspense } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import { Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';

interface ProductsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
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
            <Suspense
              fallback={
                <div className="container mx-auto px-4 py-16 text-center">
                  <Loader2 className="w-16 h-16 animate-spin mx-auto" />
                  <p className="mt-4">Loading products...</p>
                </div>
              }
            >
              <ProductGrid searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

import { Suspense } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import ProductFiltersServer from './ProductFiltersServer';
import { getProducts, GetProductsParams } from '@/actions/products/getProducts';
import ProductPagination from '@/components/products/ProductPagination';

interface ProductGridServerProps {
  searchParams?: {
    page?: string;
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

async function ProductGridContent({ searchParams }: ProductGridServerProps) {
  const params: GetProductsParams = {
    page: searchParams?.page ? parseInt(searchParams.page) : 1,
    searchTerm: searchParams?.search,
    categoryIds: searchParams?.category ? [searchParams.category] : undefined,
    minPrice: searchParams?.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams?.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
  };

  const { products, categories, totalPages, currentPage } = await getProducts(params);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
      <ProductFiltersServer categories={categories} />

      <div className="space-y-6">
        {products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No products found matching your criteria
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <ProductPagination currentPage={currentPage} totalPages={totalPages} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
      <div className="space-y-6">
        <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductGridServer(props: ProductGridServerProps) {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductGridContent {...props} />
    </Suspense>
  );
}

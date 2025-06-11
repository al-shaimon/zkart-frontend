import ProductCard from '@/components/products/ProductCard';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryProducts } from '@/types/api';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CategoryWithProductsProps {
  categoriesWithProducts: CategoryProducts[];
  isLoading?: boolean;
}

export default function ProductsByCategory({
  categoriesWithProducts,
  isLoading = false,
}: CategoryWithProductsProps) {
  return (
    <>
      {isLoading
        ? // Skeleton Loading
          Array.from({ length: 3 }).map((_, index) => (
            <section key={index} className="py-8">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, productIndex) => (
                  <ProductSkeleton key={productIndex} />
                ))}
              </div>
            </section>
          ))
        : categoriesWithProducts.map((category) => (
            <section key={category.id} className="py-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <Link
                  href={`/products?category=${category.id}`}
                  className="text-primary hover:text-primary/80 flex items-center gap-2"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
    </>
  );
}

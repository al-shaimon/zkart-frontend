import ProductSkeleton from "@/components/products/ProductSkeleton";

export default function ShopSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Header Skeleton */}
      <div className="bg-card rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Logo Skeleton */}
          <div className="w-32 h-32 rounded-lg bg-gray-200 animate-pulse" />

          {/* Info Skeleton */}
          <div className="flex-grow space-y-4 w-full">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          </div>

          {/* Button Skeleton */}
          <div className="w-[120px] h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
} 
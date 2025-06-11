import CategorySkeleton from '@/components/home/CategorySkeleton';
import ProductSkeleton from '@/components/products/ProductSkeleton';

export default function HomePageLoading() {
  return (
    <main className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="w-full h-[70vh] bg-gray-200 animate-pulse" />

      <div className="container mx-auto px-4">
        {/* Category Section Skeleton */}
        <div className="py-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
          </div>
        </div>

        {/* Flash Sale Section Skeleton */}
        <div className="py-8">
          <div className="bg-red-50 rounded-lg p-6 mb-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:w-1/2">
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse" />
              </div>
              <div className="w-48 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
          </div>
        </div>

        {/* Recently Viewed Products Skeleton */}
        <div className="py-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
          </div>
        </div>

        {/* Followed Shops Products Skeleton */}
        <div className="py-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
          </div>
        </div>

        {/* Products By Category Skeleton */}
        <div className="py-8">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="mb-12">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array(4)
                    .fill(0)
                    .map((_, subIndex) => (
                      <ProductSkeleton key={subIndex} />
                    ))}
                </div>
              </div>
            ))}
        </div>

        {/* Blog Section Skeleton */}
        <div className="py-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-[200px] bg-gray-200" />
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-10 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Newsletter Section Skeleton */}
        <div className="py-8 bg-gray-100 rounded-lg my-8">
          <div className="p-8">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4 mx-auto animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto animate-pulse" />
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <div className="h-12 bg-gray-200 rounded flex-grow animate-pulse" />
              <div className="h-12 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index}>
                  <div className="h-6 bg-gray-700 rounded w-1/2 mb-4 animate-pulse" />
                  {Array(5)
                    .fill(0)
                    .map((_, subIndex) => (
                      <div
                        key={subIndex}
                        className="h-4 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"
                      />
                    ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}

import { Skeleton } from '@/components/ui/skeleton';

export default function ShopPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Header Skeleton */}
      <div className="bg-card rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Shop Logo Skeleton */}
          <Skeleton className="w-32 h-32 rounded-lg" />

          {/* Shop Info Skeleton */}
          <div className="flex-grow text-center md:text-left">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-16 w-full mb-4" />
            
            <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>

          {/* Follow Button Skeleton */}
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Products Section Skeleton */}
      <div>
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-card rounded-lg overflow-hidden shadow-sm">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

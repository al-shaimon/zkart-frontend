import { Suspense } from 'react';
import ShopsGrid from '@/components/shops/ShopsGrid';

export default function ShopsPage() {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Shops</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of tech shops offering the latest gadgets, accessories,
            and more.
          </p>
        </div>

        {/* Shops Grid with Suspense */}
        <Suspense fallback={<ShopsGridSkeleton />}>
          <ShopsGrid />
        </Suspense>
      </div>
    </div>
  );
}

function ShopsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-card rounded-lg overflow-hidden shadow-sm">
          <div className="h-48 w-full bg-gray-200 animate-pulse" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse mb-6" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse col-span-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

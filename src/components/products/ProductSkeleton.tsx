export default function ProductSkeleton() {
  return (
    <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse">
      <div className="h-[200px] bg-gray-200 rounded-t-lg" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-full mt-auto" />
      </div>
    </div>
  );
} 
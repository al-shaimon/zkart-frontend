'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/api';
import { API_BASE_URL } from '@/config/api';
import ProductCard from '@/components/products/ProductCard';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { Clock, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function FlashSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const { ref, inView } = useInView();

  // Fetch flash sale products with pagination
  useEffect(() => {
    async function fetchFlashSaleProducts() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/product/flash-sale?page=${page}&limit=12`
        );
        const data = await response.json();
        
        if (data.success) {
          if (page === 1) {
            setProducts(data.data);
          } else {
            setProducts(prev => [...prev, ...data.data]);
          }
          setHasMore(data.data.length === 12);
          // Assuming the API returns the flash sale end time
          if (data.flashSaleEndTime) {
            setEndTime(data.flashSaleEndTime);
          }
        } else {
          setError(data.message);
        }
      } catch  {
        setError('Failed to fetch flash sale products');
      } finally {
        setLoading(false);
      }
    }

    if (hasMore) {
      fetchFlashSaleProducts();
    }
  }, [hasMore, page]);

  // Load more products when scrolling to bottom
  useEffect(() => {
    if (inView && !loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [inView, loading, hasMore]);

  // Calculate and update time left
  useEffect(() => {
    if (!endTime) return;

    const timer = setInterval(() => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('Flash Sale Ended');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Flash Sale Header */}
      <div className="bg-red-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-red-600">Flash Sale</h1>
            <p className="text-gray-600 mt-2">
              Grab amazing deals before they&apos;re gone!
            </p>
          </div>
          {timeLeft && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Clock className="h-5 w-5 text-red-500" />
              <span className="font-mono font-bold text-lg">{timeLeft}</span>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        
        {/* Loading skeletons for initial load */}
        {loading && page === 1 && (
          Array(8).fill(0).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        )}
      </div>

      {/* Load more trigger */}
      {hasMore && (
        <div
          ref={ref}
          className="flex justify-center mt-8"
        >
          {loading && page > 1 && (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          )}
        </div>
      )}

      {/* No products message */}
      {!loading && products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No flash sale products available at the moment.
        </div>
      )}
    </div>
  );
} 
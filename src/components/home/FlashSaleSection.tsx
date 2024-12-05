'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ProductCard from '../products/ProductCard';
import { Product } from '@/types/api';
import { API_BASE_URL } from '@/config/api';

export default function FlashSaleSection() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlashSaleProducts() {
      try {
        const response = await fetch(`${API_BASE_URL}/product/flash-sale`);
        const data = await response.json();
        setProducts(data.data || data.products || []);
      } catch (error) {
        console.error('Failed to fetch flash sale products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFlashSaleProducts();
  }, []);

  if (loading) {
    return <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />;
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section id="flash-sale" className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Flash Sale</h2>
        <Button variant="outline" onClick={() => router.push('/flash-sale')}>
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

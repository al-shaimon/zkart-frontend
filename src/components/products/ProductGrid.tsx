'use client';

import { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { API_BASE_URL } from '@/config/api';
import { Product } from '@/types/api';

interface ProductGridProps {
  categoryId?: string | null;
}

export default function ProductGrid({ categoryId = null }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const { ref, inView } = useInView();

  const loadProducts = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12',
      });

      if (categoryId) {
        queryParams.append('category', categoryId);
      }

      const response = await fetch(`${API_BASE_URL}/product?${queryParams}`);
      const data = await response.json();

      if (pageNum === 1) {
        setProducts(data.data);
      } else {
        setProducts(prev => [...prev, ...data.data]);
      }

      setHasMore(data.data.length === 12);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    loadProducts(1);
  }, [categoryId, loadProducts]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadProducts(page + 1);
    }
  }, [inView, hasMore, loading, loadProducts, page]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        
        {loading && (
          <>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        )}
      </div>
      
      {hasMore && <div ref={ref} className="h-10" />}
    </div>
  );
}

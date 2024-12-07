'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/api';
import { Product } from '@/types/api';
import ProductCard from '@/components/products/ProductCard';
import { useAuth } from '@/contexts/auth-context';

export default function FollowedShopsProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchFollowedShopsProducts = async () => {
      if (!isAuthenticated || !user) return;

      try {
        // Fetch followed shops with their products
        const response = await fetch(`${API_BASE_URL}/followed-shops`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          // Fetch each shop's details to get their products
          const followedShopsProducts = await Promise.all(
            data.data.map(async (followedShop: { shopId: string }) => {
              const shopResponse = await fetch(`${API_BASE_URL}/shop/${followedShop.shopId}`);
              const shopData = await shopResponse.json();
              return shopData.data.products || [];
            })
          );

          // Flatten the array of products and take first 8
          const allProducts = followedShopsProducts.flat().slice(0, 8);
          setProducts(allProducts);
        }
      } catch (error) {
        console.error('Failed to fetch followed shops products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedShopsProducts();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">From Shops You Follow</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

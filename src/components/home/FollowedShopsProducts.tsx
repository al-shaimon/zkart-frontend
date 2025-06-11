'use client';

// import { useEffect, useState } from 'react';
// import { API_BASE_URL } from '@/config/api';
import { Product } from '@/types/api';
import ProductCard from '@/components/products/ProductCard';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { useAuth } from '@/contexts/auth-context';

interface FollowedShopsProductsProps {
  products: Product[];
  isLoading?: boolean;
}

export default function FollowedShopsProducts({
  products,
  isLoading = false,
}: FollowedShopsProductsProps) {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // useEffect(() => {
  //   const fetchFollowedShopsProducts = async () => {
  //     if (!isAuthenticated || !user) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const response = await fetch(`${API_BASE_URL}/followed-shops`, {
  //         headers: {
  //           Authorization: `${localStorage.getItem('token')}`,
  //         },
  //       });
  //       const data = await response.json();

  //       if (data.success && data.data.length > 0) {
  //         const followedShopsProducts = await Promise.all(
  //           data.data.map(async (followedShop: { shopId: string }) => {
  //             const shopResponse = await fetch(`${API_BASE_URL}/shop/${followedShop.shopId}`);
  //             const shopData = await shopResponse.json();
  //             const shop = shopData.data;

  //             // Map products with complete shop info
  //             return (shop.products || []).map((product: Product) => ({
  //               ...product,
  //               shop: {
  //                 id: shop.id,
  //                 name: shop.name,
  //                 logo: shop.logo,
  //                 description: shop.description,
  //                 createdAt: shop.createdAt,
  //                 updatedAt: shop.updatedAt,
  //                 products: [],
  //                 followers: [],
  //               },
  //             }));
  //           })
  //         );

  //         const allProducts = followedShopsProducts.flat().slice(0, 8);
  //         setProducts(allProducts);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch followed shops products:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFollowedShopsProducts();
  // }, [isAuthenticated, user]);

  if (!isAuthenticated || (!isLoading && products.length === 0)) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">From Shops You Follow</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? // Show skeletons while loading
              [...Array(8)].map((_, index) => <ProductSkeleton key={index} />)
            : // Show actual products
              products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}

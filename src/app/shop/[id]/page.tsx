'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { Shop } from '@/types/api';
import { API_BASE_URL } from '@/config/api';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
// import ProductSkeleton from '@/components/products/ProductSkeleton';
import ShopSkeleton from '@/components/shop/ShopSkeleton';

export default function ShopPage() {
  const { id } = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShop() {
      try {
        const response = await fetch(`${API_BASE_URL}/shop/${id}`);
        const data = await response.json();
        setShop(data.data);
      } catch (error) {
        console.error('Failed to fetch shop:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchShop();
    }
  }, [id]);

  if (loading) {
    return <ShopSkeleton />;
  }

  if (!shop) {
    return <div>Shop not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Header */}
      <div className="bg-card rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Shop Logo */}
          <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={shop.logo}
              alt={shop.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 128px, 128px"
            />
          </div>

          {/* Shop Info */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
            <p className="text-muted-foreground mb-4">{shop.description}</p>
            
            <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{shop.followers.length} followers</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Since {new Date(shop.createdAt).getFullYear()}
              </div>
            </div>
          </div>

          {/* Follow Button */}
          <Button variant="outline" className="min-w-[120px]">
            {shop.followers.includes('current-user-id') ? 'Following' : 'Follow'}
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Products</h2>
        {shop.products.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No products available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shop.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
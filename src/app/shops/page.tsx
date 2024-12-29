'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Store, Users, Package2, Calendar } from 'lucide-react';
import { Shop } from '@/types/api';
import { API_BASE_URL } from '@/config/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function formatDate(date: string) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' });
  const year = d.getFullYear();

  // Add ordinal suffix to day
  const suffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return `${day}${suffix(day)} ${month} ${year}`;
}

function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link
      href={`/shop/${shop.id}`}
      className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={shop.logo}
          alt={shop.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
            {shop.name}
          </h3>
        </div>
        <p className="text-muted-foreground mb-6 line-clamp-2">{shop.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package2 className="w-4 h-4" />
            <span>{shop.products.length} Products</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{shop.followers.length} Followers</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
            <Calendar className="w-4 h-4" />
            <span>Joined {formatDate(shop.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ShopCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm">
      <Skeleton className="h-48 w-full" />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-48 col-span-2" />
        </div>
      </div>
    </div>
  );
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShops() {
      try {
        const response = await fetch(`${API_BASE_URL}/shop`);
        const data = await response.json();
        if (data.success) {
          setShops(data.data);
        } else {
          setError('Failed to fetch shops');
        }
      } catch (error) {
        console.error('Error fetching shops:', error);
        setError('Failed to fetch shops');
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, []);

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

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <ShopCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Shops Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shops.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No shops available</p>
              </div>
            ) : (
              shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}

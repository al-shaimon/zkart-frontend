'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/api';
import { Shop } from '@/types/api';
import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';
import FollowButton from '@/components/shop/FollowButton';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function FollowedShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    async function fetchFollowedShops() {
      try {
        const response = await fetch(`${API_BASE_URL}/followed-shops`, {
          headers: {
            'Authorization': `${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        
        if (data.success) {
          setShops(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch followed shops:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFollowedShops();
  }, [isAuthenticated, router]);

  if (loading) {
    return <div>Loading...</div>; // You can create a proper loading skeleton
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Followed Shops</h1>

      {shops.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven&apos;t followed any shops yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={shop.logo}
                    alt={shop.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-grow">
                  <Link href={`/shop/${shop.id}`}>
                    <h2 className="font-semibold hover:text-primary transition-colors">
                      {shop.name}
                    </h2>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{shop.followers.length} followers</span>
                  </div>
                </div>
                <FollowButton shopId={shop.id} isFollowing={true} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
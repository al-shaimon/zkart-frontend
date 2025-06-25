import Image from 'next/image';
import { Users } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
// import FollowButtonClient from './FollowButtonClient';
import { getShop } from '@/actions/shops/getShop';
import FollowButton from '@/components/shop/FollowButton';

interface ShopDetailsProps {
  shopId: string;
}

export default async function ShopDetails({ shopId }: ShopDetailsProps) {
  const shop = await getShop(shopId);

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Shop not found</h1>
          <p className="text-muted-foreground">
            The shop you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
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
          {/* <FollowButtonClient
            shopId={shop.id}
            isFollowing={shop.isFollowedByCurrentUser}
            className="min-w-[120px]"
          /> */}
          <FollowButton
            shopId={shop.id}
            isFollowing={shop.isFollowedByCurrentUser}
            className="min-w-[120px]"
          />
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
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  shop: {
                    id: shop.id,
                    name: shop.name,
                    logo: shop.logo,
                    description: shop.description,
                    createdAt: shop.createdAt,
                    updatedAt: shop.updatedAt,
                    products: [],
                    followers: [],
                  },
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

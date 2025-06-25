import Link from 'next/link';
import Image from 'next/image';
import { Store, Users, Package2, Calendar } from 'lucide-react';
import { Shop } from '@/types/api';
import { getShops } from '@/actions/shops/getShops';

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

export default async function ShopsGrid() {
  const shops = await getShops();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {shops.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No shops available</p>
        </div>
      ) : (
        shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
      )}
    </div>
  );
}

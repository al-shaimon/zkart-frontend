import { Suspense } from 'react';
import ShopDetails from '@/components/shop/ShopDetails';
import ShopPageSkeleton from '@/components/shop/ShopPageSkeleton';

interface ShopPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<ShopPageSkeleton />}>
      <ShopDetails shopId={id} />
    </Suspense>
  );
}

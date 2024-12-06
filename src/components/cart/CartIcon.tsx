'use client';

import { ShoppingCart } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import Link from 'next/link';

export default function CartIcon() {
  const { items = [] } = useAppSelector((state) => state.cart);
  const itemCount = items.length;

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

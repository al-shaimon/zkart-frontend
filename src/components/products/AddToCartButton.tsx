'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useAppDispatch } from '@/redux/hooks';
import { addToCart } from '@/redux/features/cartSlice';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  productId: string;
  shopId: string;
  stock: number;
}

export default function AddToCartButton({ productId, shopId, stock }: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/auth/login');
      return;
    }

    if (user.role !== 'CUSTOMER') {
      toast.error('Only customers can add items to cart');
      return;
    }

    if (stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    try {
      await dispatch(addToCart({ productId, quantity: 1, shopId })).unwrap();
    } catch {
      // Error is handled in the slice
    }
  };

  // Show different button states based on conditions
  if (!user) {
    return (
      <Button onClick={handleAddToCart} className="w-full">
        <ShoppingCart className="w-4 h-4 mr-2" />
        Login to Buy
      </Button>
    );
  }

  if (user.role !== 'CUSTOMER') {
    return (
      <Button disabled className="w-full">
        <ShoppingCart className="w-4 h-4 mr-2" />
        Customers Only
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={stock === 0}
      className="w-full"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  );
}
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCart, updateCartItemQuantity, removeFromCart } from '@/redux/features/cartSlice';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, totalAmount, loading } = useAppSelector((state) => state.cart);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user.role !== 'CUSTOMER') {
      router.push('/');
      return;
    }

    dispatch(fetchCart());
  }, [dispatch, user, router]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      await dispatch(updateCartItemQuantity({ productId, quantity })).unwrap();
    } catch (error) {
      // Error is handled in the slice
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
    } catch (error) {
      // Error is handled in the slice
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b py-4">
              <Image
                src={item.product.image}
                alt={item.product.name}
                width={100}
                height={100}
                className="object-cover rounded"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-muted-foreground">
                  Shop: {item.product.shop.name}
                </p>
                <p className="font-bold">৳{item.product.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{totalAmount}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>৳{totalAmount}</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4">Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
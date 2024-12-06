'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  applyCoupon,
} from '@/redux/features/cartSlice';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { 
    items = [], 
    originalAmount = 0, 
    discount = 0, 
    finalAmount = 0, 
    loading,
    coupon 
  } = useAppSelector((state) => state.cart);
  const { user } = useAuth();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

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

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await dispatch(updateCartItemQuantity({ itemId, quantity })).unwrap();
      toast.success('Cart updated successfully');
    } catch {
      toast.error('Failed to update cart');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    toast.custom(
      (t) => (
        <div className="bg-background border rounded-lg p-4 shadow-lg">
          <p className="mb-4">Are you sure you want to clear your cart?</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => toast.dismiss(t)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                try {
                  await dispatch(clearCart()).unwrap();
                  toast.success('Cart cleared successfully');
                } catch {
                  toast.error('Failed to clear cart');
                }
                toast.dismiss(t);
              }}
            >
              Clear Cart
            </Button>
          </div>
        </div>
      ),
      {
        duration: 2000,
      }
    );
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setApplyingCoupon(true);
    try {
      await dispatch(applyCoupon(couponCode)).unwrap();
      toast.success('Coupon applied successfully');
      setCouponCode(''); // Clear input after successful application
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to apply coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!items?.length) {
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
          {items.map((item) => {
            if (!item?.product) return null;

            return (
              <div key={item.id} className="flex gap-4 border-b py-4">
                <Link
                  href={`/products/${item.product.id}`}
                  className="relative w-[100px] h-[100px] hover:opacity-75 transition-opacity"
                >
                  <Image
                    src={item.product.image || '/placeholder.png'}
                    alt={item.product.name || 'Product'}
                    fill
                    className="object-cover rounded"
                  />
                </Link>
                <div className="flex-grow">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  {item.product.shop && (
                    <p className="text-muted-foreground">Shop: {item.product.shop.name}</p>
                  )}
                  <p className="font-bold">৳{item.product.price || 0}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.product.stock || 0)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Order Summary</h3>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{originalAmount}</span>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon}
                  >
                    {applyingCoupon ? 'Applying...' : 'Apply'}
                  </Button>
                </div>
                {coupon && (
                  <div className="text-sm text-green-600">
                    <div className="flex items-center gap-1">
                      <span>Coupon {coupon.code} applied</span>
                    </div>
                    <div className="text-xs">{coupon.discountMessage}</div>
                  </div>
                )}
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-৳{discount}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>৳{finalAmount}</span>
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

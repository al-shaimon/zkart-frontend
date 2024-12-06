'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart, clearCart } from '@/redux/features/cartSlice';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  productId: string;
  shopId: string;
  stock: number;
  showQuantity?: boolean;
}

export default function AddToCartButton({
  productId,
  shopId,
  stock,
  showQuantity = false,
}: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const { shopId: cartShopId } = useAppSelector((state) => state.cart);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    try {
      // If cart has items from a different shop
      if (cartShopId && cartShopId !== shopId) {
        toast.custom(
          (t) => (
            <div className="bg-background border rounded-lg p-4 shadow-lg">
              <p className="mb-4">
                You have items from a different shop in your cart. Would you like to clear your cart
                and add this item?
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => toast.dismiss(t)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    try {
                      await dispatch(clearCart()).unwrap();
                      await dispatch(addToCart({ productId, quantity })).unwrap();
                      toast.success('Product added to cart');
                    } catch {
                      toast.error('Failed to add product to cart');
                    }
                    toast.dismiss(t);
                  }}
                >
                  Clear & Add
                </Button>
              </div>
            </div>
          ),
          {
            duration: 2000,
          }
        );
        return;
      }

      await dispatch(addToCart({ productId, quantity })).unwrap();
      toast.success('Product added to cart');
      // Reset quantity after successful addition
      setQuantity(1);
    } catch {
      toast.error('Failed to add product to cart');
    }
  };

  if (!showQuantity) {
    return (
      <Button onClick={handleAddToCart} disabled={stock === 0} className="w-full">
        <ShoppingCart className="w-4 h-4 mr-2" />
        {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    );
  }

  return (
    <div className="mt-4 flex  items-center gap-5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {/* <span className="text-sm text-muted-foreground">{stock} available</span> */}
      </div>
      <Button onClick={handleAddToCart} disabled={stock === 0} className="w-full">
        <ShoppingCart className="w-4 h-4 mr-2" />
        {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  );
}

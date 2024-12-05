'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const displayPrice =
    product.flashSalePrice ||
    (product.discount ? product.price * (1 - product.discount / 100) : product.price);

  return (
    <Card className="overflow-hidden group">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-[200px] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {(product.isFlashSale || product.discount) && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md">
              {product.isFlashSale ? 'Flash Sale!' : `${product.discount}% Off`}
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground mb-1">{product.shop.name}</div>
        <h3 className="font-semibold truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-primary font-bold">৳{displayPrice.toLocaleString()}</span>
          {(product.flashSalePrice || product.discount) && (
            <span className="text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

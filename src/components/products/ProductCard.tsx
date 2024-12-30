'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { Product } from '@/types/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Rating from '../ui/Rating';
import AddToCartButton from './AddToCartButton';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const averageRating = product.reviews?.length
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  // Calculate discount percentage for flash sale
  const getDiscountPercentage = () => {
    if (product.flashSalePrice) {
      return Math.round(((product.price - product.flashSalePrice) / product.price) * 100);
    }
    return null;
  };

  const discountPercentage = getDiscountPercentage();

  return (
    <Card className="group h-full overflow-hidden flex flex-col">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square">
          {/* Flash Sale Badge */}
          {product.isFlashSale && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="destructive" className="px-2 py-1">
                Flash Sale
              </Badge>
            </div>
          )}

          {/* Discount Percentage Badge (only show in flash sale) */}
          {discountPercentage && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="secondary" className="px-2 py-1">
                {discountPercentage}% OFF
              </Badge>
            </div>
          )}

          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105 p-5"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors min-h-[40px]">
              {product.name}
            </h3>
          </Link>

          <div className="h-6 mt-2">
            <div className="flex items-center">
              <Rating value={averageRating} />
              <span className="text-sm text-gray-500 ml-1">({product.reviews?.length || 0})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {product.flashSalePrice ? (
              <>
                <span className="font-bold text-red-500">৳{product.flashSalePrice}</span>
                <span className="text-sm text-muted-foreground line-through">৳{product.price}</span>
              </>
            ) : (
              <span className="font-bold">৳{product.price}</span>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href={`/products/${product.id}`} className="w-full">
            <Button variant="secondary" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          <AddToCartButton productId={product.id} shopId={product.shop?.id} stock={product.stock} />
        </div>
      </div>
    </Card>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Rating from '@/components/ui/Rating';

interface Review {
  id: string;
  rating: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  flashSalePrice: number | null;
  image: string;
  reviews?: Review[];
  discount?: number | null;
  isFlashSale?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Calculate average rating if reviews exist
  const averageRating = product.reviews?.length
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  // Calculate discount percentage
  // const discountPercentage = product.flashSalePrice
  //   ? Math.round(((product.price - product.flashSalePrice) / product.price) * 100)
  //   : product.discount || 0;

  return (
    <Card className="flex flex-col h-[400px]">
      <Link href={`/products/${product.id}`} className="relative h-[200px] overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {(product.isFlashSale || product.discount) && (
          <div className="absolute top-2 right-2 bg-red-500 text-sm text-white px-2 py-1 rounded-md">
            {product.isFlashSale ? 'Flash Sale!' : `${product.discount}% Off`}
          </div>
        )}
        {/* {(product.flashSalePrice || product.discount) && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md z-10">
            {discountPercentage}% Off
          </div>
        )} */}
      </Link>

      <div className="flex flex-col flex-grow p-4">
        <div className="flex-grow">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors min-h-[40px]">
              {product.name}
            </h3>
          </Link>

          <div className="h-6 mt-2">
            {product.reviews && product.reviews.length > 0 && (
              <div className="flex items-center">
                <Rating value={averageRating} />
                <span className="text-sm text-gray-500 ml-1">({product.reviews.length})</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            {product.flashSalePrice ? (
              <>
                <span className="text-red-500 font-bold">৳{product.flashSalePrice}</span>
                <span className="text-gray-500 line-through text-sm">৳{product.price}</span>
              </>
            ) : (
              <span className="font-bold">৳{product.price}</span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <Button className="w-full" size="sm">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}

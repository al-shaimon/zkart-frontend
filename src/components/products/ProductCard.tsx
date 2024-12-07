'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/api';
import Rating from '../ui/Rating';
import AddToCartButton from './AddToCartButton';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const averageRating = product.reviews?.length 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      <Link href={`/products/${product.id}`} className="relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
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
          <AddToCartButton 
            productId={product.id} 
            shopId={product.shop?.id} 
            stock={product.stock}
          />
        </div>
      </div>
    </div>
  );
}

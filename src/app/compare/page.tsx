'use client';

import { useCompare } from '@/contexts/compare-context';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Link from 'next/link';
import Rating from '@/components/ui/Rating';

export default function ComparePage() {
  const { compareProducts, removeFromCompare } = useCompare();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'CUSTOMER') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (compareProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Compare Products</h1>
        <p className="text-muted-foreground">No products added to compare</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Compare Products</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-[200px]"></th>
              {compareProducts.map((product) => (
                <th key={product.id} className="p-4 bg-muted w-[300px]">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 z-10"
                      onClick={() => removeFromCompare(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="h-[300px] w-[300px] relative mb-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="300px"
                      />
                    </div>
                    <Link href={`/products/${product.id}`} className="hover:text-primary">
                      <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border font-medium">Price</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-4 border text-center">
                  ৳{product.price}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border font-medium">Category</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-4 border text-center">
                  {product.category.name}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border font-medium">Stock</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-4 border text-center">
                  {product.stock}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border font-medium">Rating</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-4 border text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Rating value={product.averageRating} />
                    <span>({product.totalReviews} reviews)</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border font-medium align-top">Description</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-4 border align-top">
                  <p>{product.description}</p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

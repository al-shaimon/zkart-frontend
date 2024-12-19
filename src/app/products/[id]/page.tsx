'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Store } from 'lucide-react';
import { Product } from '@/types/api';
import { API_BASE_URL } from '@/config/api';
import Rating from '@/components/ui/Rating';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import RelatedProducts from '@/components/products/RelatedProducts';
import ProductReviews from '@/components/products/ProductReviews';
import ProductDetailsSkeleton from '@/components/products/ProductDetailsSkeleton';
import AddToCartButton from '@/components/products/AddToCartButton';
import { useAuth } from '@/contexts/auth-context';
import CompareButton from '@/components/products/CompareButton';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`${API_BASE_URL}/product/${id}?include=reviews,images`);
        const data = await response.json();
        setProduct(data.data);

        // Record view if user is authenticated
        if (isAuthenticated && user?.role === 'CUSTOMER') {
          await fetch(`${API_BASE_URL}/recent-view`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              productId: id,
            }),
          });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id, isAuthenticated, user]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <ProductImageGallery images={product.images} />

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-4">
            <Link
              href={`/shop/${product.shop.id}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Store className="w-4 h-4" />
              <span>{product.shop.name}</span>
            </Link>

            {product.reviews && product.reviews.length > 0 && (
              <div className="flex items-center">
                <Rating
                  value={
                    product.reviews.reduce((acc, review) => acc + review.rating, 0) /
                    product.reviews.length
                  }
                />
                <span className="ml-2 text-sm text-muted-foreground">
                  ({product.reviews.length} reviews)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {product.flashSalePrice ? (
              <>
                <span className="text-2xl font-bold text-red-500">৳{product.flashSalePrice}</span>
                <span className="text-lg text-muted-foreground line-through">৳{product.price}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                  {Math.round(((product.price - product.flashSalePrice) / product.price) * 100)}%
                  OFF
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">৳{product.price}</span>
            )}
          </div>

          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>

          {/* Add to Cart and Compare */}
          <div className="md:flex items-center justify-center gap-5 lg:w-1/2 space-y-4">
            <div className="w-full md:w-auto">
              <AddToCartButton
                productId={product.id}
                shopId={product.shop.id}
                stock={product.stock}
                showQuantity={true}
              />
            </div>
            <div className="w-full md:w-auto">
              <CompareButton product={product} />
            </div>
          </div>

          {/* Stock Status */}
          <div className="text-sm text-muted-foreground">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <ProductReviews reviews={product.reviews ?? []} />
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <RelatedProducts categoryId={product.category.id} currentProductId={product.id} />
      </div>
    </div>
  );
}

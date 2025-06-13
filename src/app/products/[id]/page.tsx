import Link from 'next/link';
import { Store } from 'lucide-react';
import Rating from '@/components/ui/Rating';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import RelatedProducts from '@/components/products/RelatedProducts';
import ProductReviews from '@/components/products/ProductReviews';
import AddToCartButton from '@/components/products/AddToCartButton';
import CompareButton from '@/components/products/CompareButton';
import ProductViewTracker from '@/components/products/ProductViewTracker';
import { getProduct } from '@/actions/products/getProduct';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface ProductDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const effectivePrice =
    product.isFlashSale &&
    product.flashSalePrice &&
    product.flashSaleEnds &&
    new Date() < new Date(product.flashSaleEnds)
      ? product.flashSalePrice
      : product.discount && product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;

  return {
    title: `${product.name} - ৳${effectivePrice} | ZKart`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetails({ params }: ProductDetailsProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Track product view for authenticated customers */}
      <ProductViewTracker productId={id} />

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

            <div className="flex items-center">
              <Rating
                value={
                  product.reviews?.length
                    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
                      product.reviews.length
                    : 0
                }
              />
              <span className="ml-2 text-sm text-muted-foreground">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Handle both flash sale and regular discount */}
            {product.isFlashSale &&
            product.flashSalePrice &&
            product.flashSaleEnds &&
            new Date() < new Date(product.flashSaleEnds) ? (
              <>
                <span className="text-2xl font-bold text-red-500">৳{product.flashSalePrice}</span>
                <span className="text-lg text-muted-foreground line-through">৳{product.price}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                  Flash Sale -{' '}
                  {Math.round(((product.price - product.flashSalePrice) / product.price) * 100)}%
                  OFF
                </span>
              </>
            ) : product.discount && product.discount > 0 ? (
              <>
                <span className="text-2xl font-bold text-green-600">
                  ৳{Math.round(product.price * (1 - product.discount / 100))}
                </span>
                <span className="text-lg text-muted-foreground line-through">৳{product.price}</span>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                  {product.discount}% OFF
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

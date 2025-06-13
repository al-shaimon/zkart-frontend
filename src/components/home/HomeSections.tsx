import { Suspense } from 'react';
import CategorySection from '@/components/home/CategorySection';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import RecentlyViewedProducts from '@/components/home/RecentlyViewedProducts';
import FollowedShopsProducts from '@/components/home/FollowedShopsProducts';
import ProductsByCategory from '@/components/home/ProductsByCategory';
import BlogSection from '@/components/home/BlogSection';
import NewsLetterSection from '@/components/home/NewsLetterSection';
import CategorySkeleton from '@/components/home/CategorySkeleton';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategories } from '@/actions/categories/getCategories';
import { getFlashSaleProducts } from '@/actions/flash-sale/getFlashSaleProducts';
import { getRecentlyViewedProducts } from '@/actions/recently-viewed-products/getRecentlyViewedProducts';
import { getFollowedShopProducts } from '@/actions/followed-shop-products/getFollowedShopProducts';
import { getProductsByCategory } from '@/actions/products-by-category/getProductsByCategory';

// Loading components for each section
function CategorySectionSkeleton() {
  return (
    <div className="py-8">
      <Skeleton className="h-8 w-1/4 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <CategorySkeleton key={index} />
          ))}
      </div>
    </div>
  );
}

function FlashSaleSkeleton() {
  return (
    <div className="py-8">
      <div className="bg-red-50 rounded-lg p-6 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-1/2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </div>
          <Skeleton className="w-48 h-10" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
      </div>
    </div>
  );
}

function RecentlyViewedSkeleton() {
  return (
    <div className="py-8">
      <Skeleton className="h-8 w-1/3 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
      </div>
    </div>
  );
}

function FollowedShopsSkeleton() {
  return (
    <div className="py-8">
      <Skeleton className="h-8 w-1/3 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
      </div>
    </div>
  );
}

function ProductsByCategorySkeleton() {
  return (
    <div className="py-8">
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4)
                .fill(0)
                .map((_, productIndex) => (
                  <ProductSkeleton key={productIndex} />
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="py-8">
      <Skeleton className="h-8 w-1/4 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
              <div className="h-[200px] bg-gray-200" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-10 w-1/3" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function NewsletterSkeleton() {
  return (
    <div className="py-8 bg-gray-100 rounded-lg my-8">
      <div className="p-8">
        <Skeleton className="h-8 w-2/3 mb-4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mb-8 mx-auto" />
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-12 flex-grow" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  );
}

// Individual section components wrapped in Suspense
async function CategoriesWithSuspense() {
  const categories = await getCategories();
  return <CategorySection categories={categories} />;
}

async function FlashSaleWithSuspense() {
  const flashSaleProducts = await getFlashSaleProducts();
  return <FlashSaleSection products={flashSaleProducts} />;
}

async function RecentlyViewedWithSuspense() {
  const recentlyViewedProducts = await getRecentlyViewedProducts();
  return <RecentlyViewedProducts products={recentlyViewedProducts} />;
}

async function FollowedShopsWithSuspense() {
  const followedShopsProducts = await getFollowedShopProducts();
  return <FollowedShopsProducts products={followedShopsProducts} />;
}

async function ProductsByCategoryWithSuspense() {
  const categoriesWithProducts = await getProductsByCategory();
  return <ProductsByCategory categoriesWithProducts={categoriesWithProducts} />;
}

// Exported components for the main page
export function CategoriesSection() {
  return (
    <Suspense fallback={<CategorySectionSkeleton />}>
      <CategoriesWithSuspense />
    </Suspense>
  );
}

export function FlashSaleSectionWithSuspense() {
  return (
    <Suspense fallback={<FlashSaleSkeleton />}>
      <FlashSaleWithSuspense />
    </Suspense>
  );
}

export function RecentlyViewedSection({ hasToken }: { hasToken: boolean }) {
  if (!hasToken) {
    return <RecentlyViewedProducts products={[]} />;
  }

  return (
    <Suspense fallback={<RecentlyViewedSkeleton />}>
      <RecentlyViewedWithSuspense />
    </Suspense>
  );
}

export function FollowedShopsSection({ hasToken }: { hasToken: boolean }) {
  if (!hasToken) {
    return <FollowedShopsProducts products={[]} />;
  }

  return (
    <Suspense fallback={<FollowedShopsSkeleton />}>
      <FollowedShopsWithSuspense />
    </Suspense>
  );
}

export function ProductsByCategorySection() {
  return (
    <Suspense fallback={<ProductsByCategorySkeleton />}>
      <ProductsByCategoryWithSuspense />
    </Suspense>
  );
}

export function BlogSectionWithSuspense() {
  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogSection />
    </Suspense>
  );
}

export function NewsletterSectionWithSuspense() {
  return (
    <Suspense fallback={<NewsletterSkeleton />}>
      <NewsLetterSection />
    </Suspense>
  );
}

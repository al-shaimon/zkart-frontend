import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import { ScrollToTop } from '@/components/ScrollToTop';
import FollowedShopsProducts from '@/components/home/FollowedShopsProducts';
import RecentlyViewedProducts from '@/components/home/RecentlyViewedProducts';
import Footer from '@/components/Footer';
// import NewsLetterSection from '@/components/home/NewsLetterSection';
// import BlogSection from '@/components/home/BlogSection';
// import ProductsByCategory from '@/components/home/ProductsByCategory';
import { getCategories } from '@/actions/categories/getCategories';
import { getFlashSaleProducts } from '@/actions/flash-sale/getFlashSaleProducts';
import { getRecentlyViewedProducts } from '@/actions/recently-viewed-products/getRecentlyViewedProducts';
import { cookies } from 'next/headers';
import { Product } from '@/types/api';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  let recentlyViewedProducts: Product[] = [];

  const categories = await getCategories();
  const flashSaleProducts = await getFlashSaleProducts();
  if (token) {
    recentlyViewedProducts = await getRecentlyViewedProducts();
  }
  return (
    <main className="min-h-screen">
      <HeroSection />

      <div className="container mx-auto px-4">
        <CategorySection categories={categories} />
        <FlashSaleSection products={flashSaleProducts} />
        <RecentlyViewedProducts products={recentlyViewedProducts} />
        <FollowedShopsProducts />
        {/* <ProductsByCategory /> */}
        {/* <BlogSection /> */}
        {/* <NewsLetterSection /> */}
      </div>
      <Footer />
      <ScrollToTop />
    </main>
  );
}

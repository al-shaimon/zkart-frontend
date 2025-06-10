'use client';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import { ScrollToTop } from '@/components/ScrollToTop';
import FollowedShopsProducts from '@/components/home/FollowedShopsProducts';
import RecentlyViewedProducts from '@/components/home/RecentlyViewedProducts';
import Footer from '@/components/Footer';
import NewsLetterSection from '@/components/home/NewsLetterSection';
import BlogSection from '@/components/home/BlogSection';
import ProductsByCategory from '@/components/home/ProductsByCategory';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />

      <div className="container mx-auto px-4">
        <CategorySection />
        <FlashSaleSection />
        <RecentlyViewedProducts />
        <FollowedShopsProducts />
        <ProductsByCategory />
        <BlogSection />
        <NewsLetterSection />
      </div>
      <Footer />
      <ScrollToTop />
    </main>
  );
}

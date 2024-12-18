import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import ProductGrid from '@/components/products/ProductGrid';
import { ScrollToTop } from '@/components/ScrollToTop';
import FollowedShopsProducts from '@/components/home/FollowedShopsProducts';
import RecentlyViewedProducts from '@/components/home/RecentlyViewedProducts';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />

      <div className="container mx-auto px-4">
        <CategorySection />
        <FlashSaleSection />
        <RecentlyViewedProducts />
        <FollowedShopsProducts />

        <section id="products" className="py-8">
          <h2 className="text-2xl font-bold mb-6">All Products</h2>
          <ProductGrid />
        </section>
      </div>

      <ScrollToTop />
    </main>
  );
}

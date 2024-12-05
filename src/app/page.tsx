import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import ProductGrid from '@/components/products/ProductGrid';
import { ScrollToTop } from '@/components/ScrollToTop';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      
      <div className="container mx-auto px-4">
        <CategorySection />
        <FlashSaleSection />
        
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">All Products</h2>
          <ProductGrid />
        </section>
      </div>

      <ScrollToTop />
    </main>
  );
}

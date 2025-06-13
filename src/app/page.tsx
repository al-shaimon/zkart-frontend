import HeroSection from '@/components/home/HeroSection';
import { ScrollToTop } from '@/components/ScrollToTop';
import Footer from '@/components/Footer';
import { cookies } from 'next/headers';
import {
  CategoriesSection,
  FlashSaleSectionWithSuspense,
  RecentlyViewedSection,
  FollowedShopsSection,
  ProductsByCategorySection,
  BlogSectionWithSuspense,
  NewsletterSectionWithSuspense,
} from '@/components/home/HomeSections';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4">
        <CategoriesSection />
        <FlashSaleSectionWithSuspense />
        <RecentlyViewedSection hasToken={!!token} />
        <FollowedShopsSection hasToken={!!token} />
        <ProductsByCategorySection />
        <BlogSectionWithSuspense />
        <NewsletterSectionWithSuspense />
      </div>
      <Footer />
      <ScrollToTop />
    </main>
  );
}

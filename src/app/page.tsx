'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import ProductGrid from '@/components/products/ProductGrid';
import { ScrollToTop } from '@/components/ScrollToTop';
import FollowedShopsProducts from '@/components/home/FollowedShopsProducts';
import RecentlyViewedProducts from '@/components/home/RecentlyViewedProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { blogs } from './blog/data';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { API_BASE_URL } from '@/config/api';
import { toast } from 'sonner';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setEmail('');
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Failed to subscribe to newsletter');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Blog Section */}
        <section className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Latest from Blog</h2>
            <Link href="/blog" className="text-primary hover:text-primary/80">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {blog.category}
                  </span>
                  <h3 className="text-lg font-semibold mt-2 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm line-clamp-2">{blog.excerpt}</p>
                  <div className="flex items-center text-primary text-sm font-medium mt-4">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-12 px-4 bg-primary rounded-lg text-primary-foreground my-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-primary-foreground/90 mb-6">
              Subscribe to our newsletter and get the latest updates on new products, special
              offers, and exclusive deals.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-foreground"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button variant="secondary" type="submit" disabled={loading}>
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
      <ScrollToTop />
    </main>
  );
}

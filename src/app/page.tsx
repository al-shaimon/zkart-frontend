'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import ProductCard from '@/components/products/ProductCard';
import { ScrollToTop } from '@/components/ScrollToTop';
import FollowedShopsProducts from '@/components/home/FollowedShopsProducts';
import RecentlyViewedProducts from '@/components/home/RecentlyViewedProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import { toast } from 'sonner';
import { Category, Product } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import Image from 'next/image';
import { blogs } from '@/app/blog/data';

interface CategoryWithProducts extends Category {
  products: Product[];
}

export default function Home() {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchCategoriesWithProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/category`);
        const data = await response.json();

        if (data.success) {
          // Fetch products for each category
          const categoriesPromises = data.data.map(async (category: Category) => {
            const productsResponse = await fetch(`${API_BASE_URL}/category/${category.id}`);
            const productsData = await productsResponse.json();
            return {
              ...category,
              products: productsData.success ? productsData.data.products : [],
            };
          });

          const categoriesData = await Promise.all(categoriesPromises);
          // Filter out categories with no products
          const filteredCategories = categoriesData.filter(
            (category) => category.products && category.products.length > 0
          );
          setCategoriesWithProducts(filteredCategories);
        }
      } catch (error) {
        console.error('Failed to fetch categories with products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithProducts();
  }, []);

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

        {/* Products by Category */}
        {loading
          ? // Skeleton Loading
            Array.from({ length: 3 }).map((_, index) => (
              <section key={index} className="py-8">
                <div className="flex justify-between items-center mb-6">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, productIndex) => (
                    <ProductSkeleton key={productIndex} />
                  ))}
                </div>
              </section>
            ))
          : categoriesWithProducts.map((category) => (
              <section key={category.id} className="py-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="text-primary hover:text-primary/80 flex items-center gap-2"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.products.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}

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

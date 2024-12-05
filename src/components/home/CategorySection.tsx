'use client';

import { useRouter } from 'next/navigation';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/api';

interface Category {
  id: string;
  name: string;
  image: string;
  description: string | null;
}

export default function CategorySection() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${API_BASE_URL}/category`);
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?category=${categoryId}`);
  };

  if (loading) {
    return <div className="h-[200px] bg-gray-100 animate-pulse rounded-lg" />;
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-lg">
        <div className="flex space-x-4 p-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex-none w-[150px] cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="relative w-full h-[150px] rounded-lg overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center mt-2 font-medium">{category.name}</p>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
} 
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import { API_BASE_URL } from '@/config/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);

  useEffect(() => {
    // Fetch categories
    async function fetchCategories() {
      try {
        const response = await fetch(`${API_BASE_URL}/category`);
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-none">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  {selectedCategory === null && <Check className="mr-2 h-4 w-4" />}
                  All Products
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {selectedCategory === category.id && <Check className="mr-2 h-4 w-4" />}
                    {category.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-grow">
          <ProductGrid categoryId={selectedCategory} />
        </div>
      </div>
    </div>
  );
} 
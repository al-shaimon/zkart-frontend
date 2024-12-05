'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import { API_BASE_URL } from '@/config/api';

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  const [, setCategories] = useState<Category[]>([]);
  const [selectedCategory] = useState<string | null>(initialCategory);

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
        {/* Products Grid */}
        <div className="flex-grow">
          <ProductGrid categoryId={selectedCategory} />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Category } from '@/types/api';
import CategorySkeleton from './CategorySkeleton';

interface CategorySectionProps {
  categories: Category[];
  isLoading?: boolean;
}

export default function CategorySection({ categories, isLoading = false }: CategorySectionProps) {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?category=${categoryId}`);
  };
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-lg">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {[...Array(10)].map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center p-4 cursor-pointer hover:scale-105 transition-transform bg-white rounded-lg shadow-sm hover:shadow-md"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="relative w-16 h-16 mb-2">
                  <Image src={category.image} alt={category.name} fill className="object-contain" />
                </div>
                <p className="text-sm text-center font-medium text-gray-700">{category.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No categories available</div>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Category } from '@/types/api';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ProductFiltersServerProps {
  categories: Category[];
  initialFilters?: {
    search: string;
    categoryIds: string[];
    minPrice?: number;
    maxPrice?: number;
  };
}

export interface FilterOptions {
  search: string;
  categoryIds: string[];
  minPrice?: number;
  maxPrice?: number;
}

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices', min: undefined, max: undefined },
  { id: 'range1', label: '৳1k - ৳30k', min: 1000, max: 30000 },
  { id: 'range2', label: '৳30k - ৳60k', min: 30000, max: 60000 },
  { id: 'range3', label: '৳60k - ৳90k', min: 60000, max: 90000 },
  { id: 'range4', label: 'Above ৳90k', min: 90000, max: undefined },
];

export default function ProductFiltersServer({
  categories,
  initialFilters,
}: ProductFiltersServerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize from URL params
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const category = searchParams.get('category');
    return category ? [category] : initialFilters?.categoryIds || [];
  });

  const [currentPriceRange, setCurrentPriceRange] = useState<string>(() => {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    if (!minPrice && !maxPrice) return 'all';

    return (
      PRICE_RANGES.find(
        (range) => range.min?.toString() === minPrice && range.max?.toString() === maxPrice
      )?.id || 'all'
    );
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateURL = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Always reset to page 1 when filters change
    params.delete('page');

    router.push(`?${params.toString()}`);
  };

  const toggleCategory = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newSelectedCategories);

    // Update URL with new category selection
    if (newSelectedCategories.length === 0) {
      updateURL({ category: undefined });
    } else if (newSelectedCategories.length === 1) {
      updateURL({ category: newSelectedCategories[0] });
    } else {
      // For multiple categories, we'll use the first one for simplicity
      updateURL({ category: newSelectedCategories[0] });
    }
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setCurrentPriceRange('all');

    // Clear all filter params
    const params = new URLSearchParams();
    const search = searchParams.get('search');
    if (search) {
      params.set('search', search);
    }
    router.push(`?${params.toString()}`);
  };

  const handlePriceRangeChange = (rangeId: string) => {
    setCurrentPriceRange(rangeId);

    const selectedRange = PRICE_RANGES.find((range) => range.id === rangeId);
    if (selectedRange) {
      updateURL({
        minPrice: selectedRange.min?.toString(),
        maxPrice: selectedRange.max?.toString(),
      });
    }
    setIsOpen(false);
  };

  const FilterContent = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Price Range</h3>
          <RadioGroup
            value={currentPriceRange}
            onValueChange={handlePriceRangeChange}
            className="gap-2"
          >
            {PRICE_RANGES.map((range) => (
              <div key={range.id} className="flex items-center space-x-2">
                <RadioGroupItem value={range.id} id={range.id} />
                <Label
                  htmlFor={range.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {range.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="space-y-4">
            <h3 className="font-medium">Categories</h3>
            <ScrollArea className="pr-4">
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <label
                      htmlFor={category.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <Button onClick={handleReset} variant="outline" className="w-full">
          Reset Filters
        </Button>
      </div>
    );
  };

  return (
    <div className="mb-6">
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="rounded-lg border bg-card p-6">
          <FilterContent />
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Category } from '@/types/api';

interface ProductFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice: number;
  categories: Category[];
  selectedCategory?: string | null;
}

export interface FilterOptions {
  search: string;
  minPrice: number;
  maxPrice: number;
  categoryIds: string[];
}

export default function ProductFilters({
  onFilterChange,
  maxPrice,
  categories,
  selectedCategory,
}: ProductFiltersProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedCategory ? [selectedCategory] : []
  );
  const [priceInputs, setPriceInputs] = useState({
    min: '0',
    max: maxPrice.toString(),
  });
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    minPrice: 0,
    maxPrice,
    categoryIds: selectedCategory ? [selectedCategory] : [],
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePriceRangeChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }));
    setPriceInputs({
      min: value[0].toString(),
      max: value[1].toString(),
    });
    onFilterChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    e.preventDefault();
    // Only allow numbers
    const numValue = e.target.value.replace(/[^0-9]/g, '');
    setPriceInputs((prev) => ({
      ...prev,
      [type]: numValue,
    }));
  };

  const handlePriceInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent 'e', '+', '-' as this is a price input
    if (['+', '-', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePriceInputBlur = () => {
    const min = Math.max(0, Math.min(Number(priceInputs.min), maxPrice));
    const max = Math.max(min, Math.min(Number(priceInputs.max), maxPrice));

    setPriceInputs({
      min: min.toString(),
      max: max.toString(),
    });

    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));

    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const toggleCategory = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newSelectedCategories);
    onFilterChange({
      ...filters,
      categoryIds: newSelectedCategories,
    });
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setPriceInputs({
      min: '0',
      max: maxPrice.toString(),
    });
    setFilters({
      search: '',
      minPrice: 0,
      maxPrice,
      categoryIds: [],
    });
    onFilterChange({
      search: '',
      minPrice: 0,
      maxPrice,
      categoryIds: [],
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-4">
          <h3 className="font-medium">Price Range</h3>
          <div className="flex gap-4 items-center">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={priceInputs.min}
              onChange={(e) => handlePriceInputChange(e, 'min')}
              onKeyDown={handlePriceInputKeyDown}
              onBlur={handlePriceInputBlur}
              className="w-24"
            />
            <span>-</span>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={priceInputs.max}
              onChange={(e) => handlePriceInputChange(e, 'max')}
              onKeyDown={handlePriceInputKeyDown}
              onBlur={handlePriceInputBlur}
              className="w-24"
            />
          </div>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            max={maxPrice}
            step={100}
            onValueChange={handlePriceRangeChange}
            className="my-6"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Categories</h3>
          <ScrollArea className="h-[300px] pr-4">
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

  return (
    <div className="mb-6">
      {isMobile ? (
        <Sheet>
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

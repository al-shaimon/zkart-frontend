'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Category } from '@/types/api';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ProductFiltersProps {
  onFilterChange: (filters: FilterOptions, hasActiveFilters: boolean) => void;
  categories: Category[];
  selectedCategory?: string | null;
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

export default function ProductFilters({
  onFilterChange,
  categories,
  selectedCategory,
}: ProductFiltersProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedCategory ? [selectedCategory] : []
  );
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    categoryIds: selectedCategory ? [selectedCategory] : [],
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkHasActiveFilters = (currentFilters: FilterOptions): boolean => {
    return (
      currentFilters.categoryIds.length > 0 ||
      currentFilters.minPrice !== undefined ||
      currentFilters.maxPrice !== undefined
    );
  };

  const toggleCategory = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    const newFilters = {
      ...filters,
      categoryIds: newSelectedCategories,
    };

    setSelectedCategories(newSelectedCategories);
    setFilters(newFilters);
    onFilterChange(newFilters, checkHasActiveFilters(newFilters));
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      categoryIds: [],
      minPrice: undefined,
      maxPrice: undefined,
    };

    setSelectedCategories([]);
    setFilters(resetFilters);
    onFilterChange(resetFilters, false);
  };

  const handlePriceRangeChange = (rangeId: string) => {
    const selectedRange = PRICE_RANGES.find((range) => range.id === rangeId);
    if (selectedRange) {
      const newFilters = {
        ...filters,
        minPrice: selectedRange.min,
        maxPrice: selectedRange.max,
      };
      setFilters(newFilters);
      onFilterChange(newFilters, checkHasActiveFilters(newFilters));
      setIsOpen(false);
    }
  };

  const FilterContent = () => {
    const getCurrentRangeId = () => {
      if (!filters.minPrice && !filters.maxPrice) return 'all';
      return (
        PRICE_RANGES.find(
          (range) => range.min === filters.minPrice && range.max === filters.maxPrice
        )?.id || 'all'
      );
    };

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Price Range</h3>
          <RadioGroup
            value={getCurrentRangeId()}
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

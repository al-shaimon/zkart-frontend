'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { API_BASE_URL } from '@/config/api';
import { Product, Category } from '@/types/api';
import ProductFilters, { FilterOptions } from './ProductFilters';

interface ProductGridProps {
  categoryId?: string | null;
}

export default function ProductGrid({ categoryId = null }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    minPrice: 0,
    maxPrice: 100000,
    categoryIds: categoryId ? [categoryId] : [],
  });

  // Fetch products based on search term
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/product`;
        const params = new URLSearchParams();

        if (filters.search) {
          params.append('searchTerm', filters.search);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.search]); // Only re-fetch when search changes

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/category`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Simplified filter effect
  useEffect(() => {
    let result = [...products];

    // Apply price filter
    result = result.filter((product) => {
      // Get the effective price (flash sale price or regular price)
      const price = product.flashSalePrice ?? product.price;
      // Ensure we're comparing numbers
      const minPrice = Number(filters.minPrice);
      const maxPrice = Number(filters.maxPrice);
      return price >= minPrice && price <= maxPrice;
    });

    // Apply category filter
    if (filters.categoryIds.length > 0) {
      result = result.filter((product) => filters.categoryIds.includes(product.category.id));
    }

    setFilteredProducts(result);
  }, [products, filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
      <ProductFilters
        onFilterChange={handleFilterChange}
        maxPrice={100000}
        categories={categories}
        selectedCategory={categoryId}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No products found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="h-[400px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

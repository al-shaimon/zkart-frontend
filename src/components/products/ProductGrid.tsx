'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { API_BASE_URL } from '@/config/api';
import { Product, Category } from '@/types/api';
import ProductFilters, { FilterOptions } from './ProductFilters';

const ITEMS_PER_PAGE = 12;

interface ProductGridProps {
  categoryId?: string | null;
}

export default function ProductGrid({ categoryId = null }: ProductGridProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Original products
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); // Products currently shown
  const [loading, setLoading] = useState(true);
  const [hasMoreOriginal, setHasMoreOriginal] = useState(true); // Flag for original products
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    categoryIds: categoryId ? [categoryId] : [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  // Add a state to track if filters are active
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Function to shuffle array
  const shuffleArray = (array: Product[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Fetch products with pagination
  const fetchProducts = useCallback(async () => {
    if (!hasMoreOriginal) return;

    try {
      setLoading(true);
      // Clear products before fetching new ones when filters are active
      if (hasActiveFilters || filters.categoryIds.length > 0) {
        setDisplayedProducts([]);
        setAllProducts([]);
      }

      let products: Product[] = [];

      // If categories are selected, fetch products for each category
      if (filters.categoryIds.length > 0) {
        // Fetch products for all selected categories
        const categoryPromises = filters.categoryIds.map(categoryId =>
          fetch(`${API_BASE_URL}/category/${categoryId}`).then(res => res.json())
        );

        const categoryResults = await Promise.all(categoryPromises);
        
        // Combine products from all categories
        products = categoryResults.reduce((allProducts: Product[], result) => {
          if (result.success && result.data.products) {
            return [...allProducts, ...result.data.products];
          }
          return allProducts;
        }, []);

        // Apply other filters if needed
        if (filters.search) {
          products = products.filter(product => 
            product.name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        if (filters.minPrice !== undefined) {
          products = products.filter(product => product.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          products = products.filter(product => product.price <= filters.maxPrice!);
        }

        setAllProducts(products);
        setDisplayedProducts(products);
        setHasMoreOriginal(false); // Disable infinite scroll for filtered results
      } else {
        // If no categories selected, use the regular product API with pagination
        let url = `${API_BASE_URL}/product?page=${page}&limit=${ITEMS_PER_PAGE}`;
        
        if (filters.search) {
          url += `&searchTerm=${filters.search}`;
        }
        if (filters.minPrice !== undefined) {
          url += `&minPrice=${filters.minPrice}`;
        }
        if (filters.maxPrice !== undefined) {
          url += `&maxPrice=${filters.maxPrice}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          const newProducts = data.data;
          
          if (hasActiveFilters) {
            setAllProducts(newProducts);
            setDisplayedProducts(newProducts);
            setHasMoreOriginal(false);
          } else {
            if (newProducts.length < ITEMS_PER_PAGE) {
              setHasMoreOriginal(false);
            }
            setAllProducts(prev => [...prev, ...newProducts]);
            setDisplayedProducts(prev => [...prev, ...newProducts]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setAllProducts([]);
      setDisplayedProducts([]);
      setHasMoreOriginal(false);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [page, filters, hasMoreOriginal, hasActiveFilters]);

  // Load more products (for infinite scroll after showing all original products)
  const loadMoreProducts = useCallback(() => {
    if (hasMoreOriginal) return;

    setLoading(true);
    setTimeout(() => {
      const shuffledProducts = shuffleArray(allProducts);
      setDisplayedProducts(prev => [...prev, ...shuffledProducts]);
      setLoading(false);
    }, 300);
  }, [allProducts, hasMoreOriginal]);

  // Intersection Observer callback
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && !loading && !hasActiveFilters) {
      if (hasMoreOriginal) {
        setPage(prev => prev + 1);
      } else {
        loadMoreProducts();
      }
    }
  }, [loading, hasMoreOriginal, loadMoreProducts, hasActiveFilters]);

  // Set up Intersection Observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };

    observer.current = new IntersectionObserver(handleObserver, options);
    
    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Fetch products when page or filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  // Reset everything when filters change
  const handleFilterChange = (newFilters: FilterOptions) => {
    // Check if any filters are active
    const filtersActive = !!(
      newFilters.search ||
      newFilters.categoryIds.length > 0 ||
      newFilters.minPrice !== undefined ||
      newFilters.maxPrice !== undefined
    );
    
    // Clear existing products immediately
    setDisplayedProducts([]);
    setAllProducts([]);
    
    setHasActiveFilters(filtersActive);
    setFilters(newFilters);
    setPage(1);
    setHasMoreOriginal(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
      <ProductFilters
        onFilterChange={handleFilterChange}
        categories={categories}
        selectedCategory={categoryId}
      />

      <div className="space-y-6">
        {loading && displayedProducts.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No products found matching your criteria
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product, index) => (
                <div key={`${product.id}-${index}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            <div ref={loadingRef} className="flex justify-center py-4">
              {loading && (
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { API_BASE_URL } from '@/config/api';
import { Product, Category } from '@/types/api';
import ProductFilters, { FilterOptions } from './ProductFilters';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 12;

interface ProductGridProps {
  categoryId?: string | null;
}

export default function ProductGrid({ categoryId = null }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    categoryIds: categoryId ? [categoryId] : [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  // Fetch products with pagination
  const fetchProducts = async () => {
    try {
      setLoading(true);

      let products: Product[] = [];

      // If categories are selected, fetch products for each category
      if (filters.categoryIds.length > 0) {
        // Fetch products for all selected categories
        const categoryPromises = filters.categoryIds.map((categoryId) =>
          fetch(`${API_BASE_URL}/category/${categoryId}`).then((res) => res.json())
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
          products = products.filter((product) =>
            product.name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        if (filters.minPrice !== undefined) {
          products = products.filter((product) => product.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          products = products.filter((product) => product.price <= filters.maxPrice!);
        }

        setProducts(products);
        setTotalPages(Math.ceil(products.length / ITEMS_PER_PAGE));
      } else {
        // If no categories selected, use the regular product API with pagination
        let url = `${API_BASE_URL}/product?page=${currentPage}&limit=${ITEMS_PER_PAGE}`;

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
          setProducts(data.data);
          setTotalPages(Math.ceil(data.meta.total / ITEMS_PER_PAGE));
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  // Fetch products when page or filters change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters]);

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
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(
      <PaginationItem key="1">
        <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 2; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show ellipsis and selected range
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and surrounding pages
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
      <ProductFilters
        onFilterChange={handleFilterChange}
        categories={categories}
        selectedCategory={categoryId}
      />

      <div className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No products found matching your criteria
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="justify-center cursor-pointer">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}

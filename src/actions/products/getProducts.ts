'use server';

import { API_BASE_URL } from '@/config/api';
import { Product, Category } from '@/types/api';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export interface GetProductsResponse {
  products: Product[];
  categories: Category[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export async function getProducts(params: GetProductsParams = {}): Promise<GetProductsResponse> {
  const { page = 1, limit = 12, searchTerm, categoryIds, minPrice, maxPrice } = params;

  try {
    // Fetch categories first
    const categoriesResponse = await fetch(`${API_BASE_URL}/category`, {
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    let categories: Category[] = [];
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      categories = categoriesData.success ? categoriesData.data : [];
    }

    let products: Product[] = [];
    let totalProducts = 0; // Parse category IDs from comma-separated string if needed
    let parsedCategoryIds: string[] = [];
    if (categoryIds && categoryIds.length > 0) {
      parsedCategoryIds = categoryIds.flatMap((id) => id.split(',').filter(Boolean));
    }

    // If categories are selected, fetch products for each category
    if (parsedCategoryIds.length > 0) {
      // Fetch products for all selected categories
      const categoryPromises = parsedCategoryIds.map((categoryId) =>
        fetch(`${API_BASE_URL}/category/${categoryId}`, {
          next: {
            revalidate: 1800, // Cache for 30 minutes
          },
        }).then((res) => res.json())
      );

      const categoryResults = await Promise.all(categoryPromises);

      // Combine products from all categories
      products = categoryResults.reduce((allProducts: Product[], result) => {
        if (result.success && result.data.products) {
          return [...allProducts, ...result.data.products];
        }
        return allProducts;
      }, []);

      // Remove duplicates based on product ID
      const uniqueProducts = products.filter(
        (product, index, self) => index === self.findIndex((p) => p.id === product.id)
      );
      products = uniqueProducts;

      // Apply other filters
      if (searchTerm) {
        products = products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (minPrice !== undefined) {
        products = products.filter((product) => product.price >= minPrice);
      }
      if (maxPrice !== undefined) {
        products = products.filter((product) => product.price <= maxPrice);
      }

      totalProducts = products.length;

      // Apply pagination manually for category-filtered products
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      products = products.slice(startIndex, endIndex);
    } else {
      // Use regular product API with server-side pagination
      let url = `${API_BASE_URL}/product?page=${page}&limit=${limit}`;

      if (searchTerm) {
        url += `&searchTerm=${searchTerm}`;
      }
      if (minPrice !== undefined) {
        url += `&minPrice=${minPrice}`;
      }
      if (maxPrice !== undefined) {
        url += `&maxPrice=${maxPrice}`;
      }

      const response = await fetch(url, {
        next: {
          revalidate: 1800, // Cache for 30 minutes
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          products = data.data;
          totalProducts = data.meta.total;
        }
      }
    }

    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products,
      categories,
      totalPages,
      currentPage: page,
      total: totalProducts,
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return {
      products: [],
      categories: [],
      totalPages: 1,
      currentPage: 1,
      total: 0,
    };
  }
}

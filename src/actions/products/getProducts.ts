'use server';

import { API_BASE_URL } from '@/config/api';
import { Product, Category } from '@/types/api';

// Helper function to calculate the effective price (considering discounts and flash sales)
const getEffectivePrice = (product: Product): number => {
  // Check if it's a flash sale and the sale is still active
  if (product.isFlashSale && product.flashSalePrice && product.flashSaleEnds) {
    const now = new Date();
    const flashSaleEnd = new Date(product.flashSaleEnds);
    if (now < flashSaleEnd) {
      return product.flashSalePrice;
    }
  }

  // Check if there's a regular discount
  if (product.discount && product.discount > 0) {
    const discountedPrice = product.price * (1 - product.discount / 100);
    return Math.round(discountedPrice * 100) / 100; // Round to 2 decimal places
  }

  // Return original price if no discounts
  return product.price;
};

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
      products = uniqueProducts; // Apply other filters
      if (searchTerm) {
        products = products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (minPrice !== undefined) {
        products = products.filter((product) => getEffectivePrice(product) >= minPrice);
      }
      if (maxPrice !== undefined) {
        products = products.filter((product) => getEffectivePrice(product) <= maxPrice);
      }

      totalProducts = products.length; // Apply pagination manually for category-filtered products
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      products = products.slice(startIndex, endIndex);
    } else {
      // When no categories are selected, fetch all products and filter client-side
      // This ensures consistent pricing logic (effective price consideration)
      const response = await fetch(`${API_BASE_URL}/product?limit=1000`, {
        next: {
          revalidate: 1800, // Cache for 30 minutes
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          let allProducts = data.data;

          // Apply filters using effective pricing
          if (searchTerm) {
            allProducts = allProducts.filter((product: Product) =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          if (minPrice !== undefined) {
            allProducts = allProducts.filter(
              (product: Product) => getEffectivePrice(product) >= minPrice
            );
          }
          if (maxPrice !== undefined) {
            allProducts = allProducts.filter(
              (product: Product) => getEffectivePrice(product) <= maxPrice
            );
          }

          totalProducts = allProducts.length;

          // Apply pagination
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          products = allProducts.slice(startIndex, endIndex);
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

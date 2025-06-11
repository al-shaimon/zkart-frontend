'use server';

import { API_BASE_URL } from '@/config/api';
import { Category, CategoryProducts } from '@/types/api';

export async function getProductsByCategory(): Promise<CategoryProducts[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/category`, {
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories with products : ${response.status}`);
    }

    const data = await response.json();

    let filteredCategories: CategoryProducts[] = [];

    if (data.success) {
      // Fetch products for each category
      const categoriesPromises = data.data.map(async (category: Category) => {
        const productsResponse = await fetch(`${API_BASE_URL}/category/${category.id}`, {
          next: {
            revalidate: 3600, // Cache for 1 hour
          },
        });
        const productsData = await productsResponse.json();
        return {
          ...category,
          products: productsData.success ? productsData.data.products : [],
        };
      });

      const categoriesData = await Promise.all(categoriesPromises);
      // Filter out categories with no products
      filteredCategories = categoriesData.filter(
        (category) => category.products && category.products.length > 0
      );
    }

    return filteredCategories || [];
  } catch (error) {
    console.error('Error fetching followed shops products:', error);
    return [];
  }
}

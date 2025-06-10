'use server';

import { API_BASE_URL } from '@/config/api';
import { Product } from '@/types/api';

export async function getFlashSaleProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/product/flash-sale`, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Failed to fetch flash sale products: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching flash sale products:', error);
    return [];
  }
}

'use server';

import { API_BASE_URL } from '@/config/api';
import { Product } from '@/types/api';
import { cookies } from 'next/headers';

export async function getRecentlyViewedProducts(): Promise<Product[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  try {
    const response = await fetch(`${API_BASE_URL}/recent-view`, {
      headers: {
        Authorization: token ? token.value : '',
      },
      next: {
        revalidate: 30, // Cache for 30 seconds - reasonable time
        tags: ['recently-viewed-products'],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recently viewed products : ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching recently viewed products:', error);
    return [];
  }
}

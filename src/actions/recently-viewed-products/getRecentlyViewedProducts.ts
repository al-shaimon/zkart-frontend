'use server';

import { API_BASE_URL } from '@/config/api';
import { Product } from '@/types/api';

export async function getRecentlyViewedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/recent-view`, {
      //TODO: Have to implement the cookie based token check and pass the token in headers currently recently viewed products not functional
      // headers: {
      //   Authorization: `${localStorage.getItem('token')}`,
      // },
      cache: 'no-store',
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

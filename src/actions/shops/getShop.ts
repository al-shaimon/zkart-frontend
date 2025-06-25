'use server';

import { API_BASE_URL } from '@/config/api';
import { Shop } from '@/types/api';

export async function getShop(id: string): Promise<Shop | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/shop/${id}`, {
      next: {
        revalidate: 60, // Cache for 1 minute
        tags: ['shop', `shop-${id}`],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shop: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching shop:', error);
    return null;
  }
}

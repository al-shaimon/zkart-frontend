'use server';

import { API_BASE_URL } from '@/config/api';
import { Shop } from '@/types/api';

export async function getShops(): Promise<Shop[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/shop`, {
      next: {
        revalidate: 300, // Cache for 5 minutes
        tags: ['shops'],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shops: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
}

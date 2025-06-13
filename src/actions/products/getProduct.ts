'use server';

import { API_BASE_URL } from '@/config/api';
import { Product } from '@/types/api';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${productId}?include=reviews,images`, {
      next: {
        revalidate: 1800, // Cache for 30 minutes
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function recordProductView(productId: string): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return; // No token, can't record view
  }

  try {
    await fetch(`${API_BASE_URL}/recent-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token.value,
      },
      body: JSON.stringify({
        productId,
      }),
    });

    // Revalidate the tag for recently viewed products
    revalidateTag('recently-viewed-products');
  } catch (error) {
    console.error('Error recording product view:', error);
    // Don't throw error, just log it as this is not critical
  }
}

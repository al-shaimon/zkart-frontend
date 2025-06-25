'use server';

import { API_BASE_URL } from '@/config/api';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function followShop(shopId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/follow/${shopId}`, {
      method: 'POST',
      headers: {
        Authorization: token.value,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to follow shop');
    }

    // Revalidate the shop data to show updated follower count
    revalidateTag(`shop-${shopId}`);
    revalidateTag('shops');

    return { success: true, message: 'Shop followed successfully' };
  } catch (error) {
    console.error('Error following shop:', error);
    throw error;
  }
}

export async function unfollowShop(shopId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/unfollow/${shopId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token.value,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to unfollow shop');
    }

    // Revalidate the shop data to show updated follower count
    revalidateTag(`shop-${shopId}`);
    revalidateTag('shops');

    return { success: true, message: 'Shop unfollowed successfully' };
  } catch (error) {
    console.error('Error unfollowing shop:', error);
    throw error;
  }
}

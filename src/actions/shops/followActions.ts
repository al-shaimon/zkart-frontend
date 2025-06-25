'use server';

import { API_BASE_URL } from '@/config/api';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function followShop(shopId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  console.log('followShop called:', { shopId, hasToken: !!token });

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

    console.log('Follow API response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = 'Failed to follow shop';
      try {
        const data = await response.json();
        console.log('Follow API error response data:', data);
        errorMessage = data.message || errorMessage;
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Parse response data for success case
    const responseData = await response.json();
    console.log('Follow API success response:', responseData);

    // Revalidate the shop data to show updated follower count
    revalidateTag(`shop-${shopId}`);
    revalidateTag('shops');

    return { success: true, message: 'Shop followed successfully' };
  } catch (error) {
    console.error('Error following shop:', error);

    // Re-throw with a clean error message for production
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to follow shop');
  }
}

export async function unfollowShop(shopId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  console.log('unfollowShop called:', { shopId, hasToken: !!token });

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

    console.log('Unfollow API response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = 'Failed to unfollow shop';
      try {
        const data = await response.json();
        console.log('Unfollow API error response data:', data);
        errorMessage = data.message || errorMessage;
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Parse response data for success case
    const responseData = await response.json();
    console.log('Unfollow API success response:', responseData);

    // Revalidate the shop data to show updated follower count
    revalidateTag(`shop-${shopId}`);
    revalidateTag('shops');

    return { success: true, message: 'Shop unfollowed successfully' };
  } catch (error) {
    console.error('Error unfollowing shop:', error);

    // Re-throw with a clean error message for production
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to unfollow shop');
  }
}

'use server';

import { API_BASE_URL } from '@/config/api';
import { Shop } from '@/types/api';
import { cookies } from 'next/headers';

export interface ShopWithFollowStatus extends Shop {
  isFollowedByCurrentUser: boolean;
}

export async function getShop(id: string): Promise<ShopWithFollowStatus | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  try {
    const response = await fetch(`${API_BASE_URL}/shop/${id}`, {
      headers: {
        ...(token && { Authorization: token.value }),
      },
      next: {
        revalidate: 60, // Cache for 1 minute
        tags: ['shop', `shop-${id}`],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shop: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      return null;
    }

    const shop = data.data;

    // Check if current user is following this shop
    let isFollowedByCurrentUser = false;
    if (token) {
      try {
        // Get current user info to compare with followers
        const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: token.value,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success && userData.data) {
            // More robust checking - check both email and ID if available
            const currentUserEmail = userData.data.email;
            const currentUserId = userData.data.id;

            isFollowedByCurrentUser = shop.followers.some(
              (follower: { customer?: { email: string; id?: string }; customerId?: string }) => {
                // Check by customer email
                if (follower.customer?.email === currentUserEmail) {
                  return true;
                }
                // Check by customer ID if available
                if (
                  currentUserId &&
                  (follower.customer?.id === currentUserId || follower.customerId === currentUserId)
                ) {
                  return true;
                }
                return false;
              }
            );
          }
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
        // Don't throw error, just log it and continue with false
      }
    }

    return {
      ...shop,
      isFollowedByCurrentUser,
    };
  } catch (error) {
    console.error('Error fetching shop:', error);
    return null;
  }
}

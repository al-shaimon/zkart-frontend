'use server';

import { API_BASE_URL } from '@/config/api';
import { Product } from '@/types/api';
import { cookies } from 'next/headers';

export async function getFollowedShopProducts(): Promise<Product[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  try {
    const response = await fetch(`${API_BASE_URL}/followed-shops`, {
      headers: {
        Authorization: token ? token.value : '',
      },
      next: {
        revalidate: 1800, // Cache for 30 minutes
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch followed shops products : ${response.status}`);
    }

    const data = await response.json();

    let allProducts: Product[] = [];

    if (data.success && data.data.length > 0) {
      const followedShopsProducts = await Promise.all(
        data.data.map(async (followedShop: { shopId: string }) => {
          const shopResponse = await fetch(`${API_BASE_URL}/shop/${followedShop.shopId}`, {
            next: {
              revalidate: 1800, // Cache shop data for 30 minutes
            },
          });
          const shopData = await shopResponse.json();
          const shop = shopData.data;

          // Map products with complete shop info
          return (shop.products || []).map((product: Product) => ({
            ...product,
            shop: {
              id: shop.id,
              name: shop.name,
              logo: shop.logo,
              description: shop.description,
              createdAt: shop.createdAt,
              updatedAt: shop.updatedAt,
              products: [],
              followers: [],
            },
          }));
        })
      );

      allProducts = followedShopsProducts.flat().slice(0, 8);
      if (allProducts.length === 0) {
        console.log('No products found for followed shops');
      }
    }

    return allProducts || [];
  } catch (error) {
    console.error('Error fetching followed shops products:', error);
    return [];
  }
}

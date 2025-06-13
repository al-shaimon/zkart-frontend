'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateRecentlyViewedProducts() {
  revalidateTag('recently-viewed-products');
}

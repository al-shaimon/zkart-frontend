export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  discount: number | null;
  image: string;
  isFlashSale: boolean;
  flashSalePrice: number | null;
  flashSaleEnds: string | null;
  categoryId: string;
  images: Array<{
    id: string;
    url: string;
    isMain: boolean;
  }>;
} 
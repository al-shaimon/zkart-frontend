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
  category: Category;
  shop: Shop;
  images: ProductImage[];
  reviews: Review[];
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  vendorId: string;
  vendor: Vendor;
  products: Product[];
  followers: string[];
}

export interface Vendor {
  id: string;
  email: string;
  name: string;
  profilePhoto: string | null;
  contactNumber: string;
  address: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  customer: {
    name: string;
    profilePhoto: string;
  };
} 
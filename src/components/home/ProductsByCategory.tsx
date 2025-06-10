import ProductCard from "@/components/products/ProductCard";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL } from "@/config/api";
import { Category, Product } from '@/types/api';
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CategoryWithProducts extends Category {
  products: Product[];
}

export default function ProductsByCategory() {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesWithProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/category`);
        const data = await response.json();

        if (data.success) {
          // Fetch products for each category
          const categoriesPromises = data.data.map(async (category: Category) => {
            const productsResponse = await fetch(`${API_BASE_URL}/category/${category.id}`);
            const productsData = await productsResponse.json();
            return {
              ...category,
              products: productsData.success ? productsData.data.products : [],
            };
          });

          const categoriesData = await Promise.all(categoriesPromises);
          // Filter out categories with no products
          const filteredCategories = categoriesData.filter(
            (category) => category.products && category.products.length > 0
          );
          setCategoriesWithProducts(filteredCategories);
        }
      } catch (error) {
        console.error('Failed to fetch categories with products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithProducts();
  }, []);

  return (
    <>
      {loading
        ? // Skeleton Loading
          Array.from({ length: 3 }).map((_, index) => (
            <section key={index} className="py-8">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, productIndex) => (
                  <ProductSkeleton key={productIndex} />
                ))}
              </div>
            </section>
          ))
        : categoriesWithProducts.map((category) => (
            <section key={category.id} className="py-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <Link
                  href={`/products?category=${category.id}`}
                  className="text-primary hover:text-primary/80 flex items-center gap-2"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import Image from 'next/image';
import { Edit, Plus, Copy, Trash2 } from 'lucide-react';
import ProductForm from './ProductForm';
import FlashSaleDialog from './FlashSaleDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Product {
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

interface Shop {
  id: string;
  products: Product[];
}

export default function ProductList() {
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [flashSaleProduct, setFlashSaleProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/my-shop`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setShop(data.data);
      }
    } catch {
      toast.error('Failed to fetch shop data' );
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/duplicate/${productId}`, {
        method: 'POST',
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success('Product duplicated successfully');
      // Open the edit form with the duplicated product
      setSelectedProduct(data.data);
      setShowForm(true);
      fetchShopData(); // Refresh the product list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to duplicate product');
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success('Product deleted successfully');
      fetchShopData(); // Refresh product list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product');
    } finally {
      setProductToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex gap-4">
              <Skeleton className="h-32 w-32" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <Button variant="outline" onClick={() => {
            setShowForm(false);
            setSelectedProduct(null);
          }}>
            Back to Products
          </Button>
        </div>
        <ProductForm
          product={selectedProduct}
          onSuccess={() => {
            setShowForm(false);
            setSelectedProduct(null);
            fetchShopData();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-4">
        {shop?.products.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex gap-4">
              <div className="relative w-32 h-32">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{product.name}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicate(product.id)}
                      title="Duplicate Product"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowForm(true);
                      }}
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setProductToDelete(product)}
                      title="Delete Product"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Stock: {product.stock} · Price: ৳{product.price}
                  {product.discount && ` · Discount: ${product.discount}%`}
                </p>
                {product.isFlashSale && (
                  <p className="text-sm text-green-600 font-medium mb-2">
                    Flash Sale Price: ৳{product.flashSalePrice} · 
                    Ends: {new Date(product.flashSaleEnds!).toLocaleDateString()}
                  </p>
                )}
                <Button
                  variant={product.isFlashSale ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setFlashSaleProduct(product)}
                >
                  {product.isFlashSale ? 'Update Flash Sale' : 'Create Flash Sale'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <FlashSaleDialog
        open={!!flashSaleProduct}
        onClose={() => setFlashSaleProduct(null)}
        productId={flashSaleProduct?.id || ''}
        productPrice={flashSaleProduct?.price || 0}
        onSuccess={fetchShopData}
      />

      <ConfirmDialog
        open={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete?.id) {
            handleDelete(productToDelete.id);
          }
        }}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
} 
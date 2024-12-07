'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types/api';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

interface CompareContextType {
  compareProducts: Product[];
  addToCompare: (product: Product) => Promise<void>;
  removeFromCompare: (productId: string) => Promise<void>;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const { isAuthenticated, user } = useAuth();

  // Fetch compare list on mount and auth change
  useEffect(() => {
    if (isAuthenticated && user?.role === 'CUSTOMER') {
      fetchCompareList();
    } else {
      setCompareProducts([]);
    }
  }, [isAuthenticated, user]);

  const fetchCompareList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/compare`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCompareProducts(data.data.products);
      }
    } catch (error) {
      console.error('Failed to fetch compare list:', error);
    }
  };

  const addToCompare = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Please login to compare products');
      return;
    }

    if (compareProducts.length >= 3) {
      toast.error('You can only compare up to 3 products');
      return;
    }

    if (compareProducts.length > 0 && compareProducts[0].category.id !== product.category.id) {
      toast.error('You can only compare products from the same category');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/compare/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchCompareList();
        toast.success('Product added to comparison');
      }
    } catch  {
      toast.error('Failed to add product to comparison');
    }
  };

  const removeFromCompare = async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/compare/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        await fetchCompareList();
        toast.success('Product removed from comparison');
      }
    } catch {
      toast.error('Failed to remove product from comparison');
    }
  };

  const clearCompare = () => {
    setCompareProducts([]);
  };

  return (
    <CompareContext.Provider
      value={{ compareProducts, addToCompare, removeFromCompare, clearCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}; 
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Scale, Loader2 } from 'lucide-react';
import { useCompare } from '@/contexts/compare-context';
import { Product } from '@/types/api';

interface CompareButtonProps {
  product: Product;
}

export default function CompareButton({ product }: CompareButtonProps) {
  const { addToCompare, compareProducts } = useCompare();
  const [isAdding, setIsAdding] = useState(false);

  const isInCompare = compareProducts.some((p) => p.id === product.id);

  const handleCompare = async () => {
    if (isInCompare) return;
    
    setIsAdding(true);
    try {
      await addToCompare(product);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleCompare}
      disabled={isInCompare || isAdding}
      className="w-full h-10"
    >
      {isAdding ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Adding to compare...
        </>
      ) : (
        <>
          <Scale className="w-4 h-4 mr-2" />
          {isInCompare ? 'In Compare' : 'Add to Compare'}
        </>
      )}
    </Button>
  );
}

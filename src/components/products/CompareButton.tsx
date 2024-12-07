'use client';

import { Button } from '@/components/ui/button';
import { useCompare } from '@/contexts/compare-context';
import { Product } from '@/types/api';
import { Scale } from 'lucide-react';

interface CompareButtonProps {
  product: Product;
}

export default function CompareButton({ product }: CompareButtonProps) {
  const { compareProducts, addToCompare, removeFromCompare } = useCompare();
  const isInCompare = compareProducts.some((p) => p.id === product.id);

  const handleCompare = async () => {
    if (isInCompare) {
      await removeFromCompare(product.id);
    } else {
      await addToCompare(product);
    }
  };

  return (
    <Button
      variant={isInCompare ? 'destructive' : 'secondary'}
      onClick={handleCompare}
      className="w-full"
    >
      <Scale className="w-4 h-4 mr-2" />
      {isInCompare ? 'Remove from Compare' : 'Add to Compare'}
    </Button>
  );
}

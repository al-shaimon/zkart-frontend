'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Product } from '@/types/api';
import { API_BASE_URL } from '@/config/api';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import debounce from 'lodash/debounce';

interface SearchCommandProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SearchCommand({ isOpen: propIsOpen, onOpenChange }: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Create a memoized fetch function
  const fetchResults = useCallback(async (term: string) => {
    // Only fetch if term is at least 3 characters
    if (!term.trim() || term.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/product?searchTerm=${encodeURIComponent(term)}`
      );
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Failed to search products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a debounced version of fetchResults
  const debouncedFetch = useCallback(
    (term: string) => {
      fetchResults(term);
    },
    [fetchResults]
  );

  // Wrap in useMemo to maintain the debounced instance
  const debouncedFetchWithDelay = useMemo(() => debounce(debouncedFetch, 300), [debouncedFetch]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchWithDelay.cancel();
    };
  }, [debouncedFetchWithDelay]);

  // Sync internal open state with props
  useEffect(() => {
    if (propIsOpen !== undefined) {
      setOpen(propIsOpen);
    }
  }, [propIsOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
    if (!newOpen) {
      setResults([]);
      setInputValue('');
      debouncedFetchWithDelay.cancel();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length >= 3) {
      setLoading(true);
      debouncedFetchWithDelay(value);
    } else {
      setResults([]);
      debouncedFetchWithDelay.cancel();
    }
  };

  return (
    <>
      <button
        onClick={() => handleOpenChange(true)}
        className="flex items-center w-full max-w-xl mx-auto h-10 px-4 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      >
        <Search className="mr-2 h-4 w-4 shrink-0 text-gray-500" />
        <span className="text-sm text-muted-foreground">Search products...</span>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-2xl p-0"
          onPointerDownOutside={() => handleOpenChange(false)}
        >
          <DialogTitle className="sr-only">Search Products</DialogTitle>
          <div className="p-4 border-b">
            <Input
              placeholder="Search products..."
              value={inputValue}
              onChange={handleInputChange}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                {!inputValue
                  ? 'Start typing to search...'
                  : inputValue.length < 3
                  ? 'Type more about the product...'
                  : 'No products found.'}
              </div>
            ) : (
              <div className="p-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={() => handleOpenChange(false)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-shrink-0 w-16 h-16 relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ৳{product.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

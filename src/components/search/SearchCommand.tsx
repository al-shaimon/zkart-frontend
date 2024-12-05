'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Product } from '@/types/api';
import { API_BASE_URL } from '@/config/api';
import debounce from 'lodash/debounce';

interface SearchCommandProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SearchCommand({ isOpen: propIsOpen, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [inputValue, setInputValue] = useState('');

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
    }
  };

  // Separate the API call from input handling
  const fetchResults = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
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
    }, 200), // Reduced debounce time
    []
  );

  // Handle input change immediately
  const handleInputChange = (value: string) => {
    setInputValue(value);
    setLoading(true);
    fetchResults(value);
  };

  const handleSelect = (productId: string) => {
    handleOpenChange(false);
    router.push(`/products/${productId}`);
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
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput
          placeholder="Search products..."
          value={inputValue}
          onValueChange={handleInputChange}
          className="border-none focus:ring-0"
        />
        <CommandList>
          <CommandEmpty>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              'No products found.'
            )}
          </CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Products">
              {results.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(product.id)}
                  className="flex items-center gap-4 py-3 cursor-pointer"
                >
                  <div className="flex-shrink-0 w-16 h-16 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover rounded w-full h-full"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ৳{product.price.toLocaleString()}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

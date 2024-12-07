'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { API_BASE_URL } from '@/config/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import Image from 'next/image';
import { Product } from '@/types/shop';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const shopSchema = z.object({
  name: z.string().min(2, 'Shop name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type ShopFormValues = z.infer<typeof shopSchema>;

interface Follower {
  id: string;
  customerId: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
  };
}

interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  products: Product[];
  followers: Follower[];
}

export default function ShopForm() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Fetch existing shop data
  useEffect(() => {
    async function fetchShop() {
      try {
        const response = await fetch(`${API_BASE_URL}/shop/my-shop`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setShop(data.data);
          form.reset({
            name: data.data.name,
            description: data.data.description,
          });
        }
      } catch  {
        toast.error('Failed to fetch shop details');
      } finally {
        setLoading(false);
      }
    }

    fetchShop();
  }, [form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size should be less than 5MB');
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Only .jpg, .jpeg, .png and .webp formats are supported');
      return;
    }

    setSelectedFile(file);
  };

  const onSubmit = async (data: ShopFormValues) => {
    if (!shop && !selectedFile) {
      toast.error('Please select a logo for your shop');
      return;
    }

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));

      if (selectedFile) {
        formData.append('logo', selectedFile);
      }

      const url = shop 
        ? `${API_BASE_URL}/shop/${shop.id}`
        : `${API_BASE_URL}/shop`;

      const response = await fetch(url, {
        method: shop ? 'PATCH' : 'POST',
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${shop ? 'update' : 'create'} shop`);
      }

      toast.success(result.message);
      
      // Refresh shop data after update
      if (shop) {
        const updatedShopResponse = await fetch(`${API_BASE_URL}/shop/my-shop`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        const updatedShopData = await updatedShopResponse.json();
        if (updatedShopData.success) {
          setShop(updatedShopData.data);
        }
      }

      setSelectedFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 space-y-6">
        <div className="flex justify-center">
          <Skeleton className="h-32 w-32 rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      {shop && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden">
              <Image
                src={shop.logo}
                alt={shop.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {shop.products.length} Products · {shop.followers.length} Followers
            </p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormLabel>Shop Logo</FormLabel>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer flex-1"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={updating}>
              {updating ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {shop ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                shop ? 'Update Shop' : 'Create Shop'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
} 
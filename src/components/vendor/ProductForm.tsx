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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types/shop';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_IMAGES = 5;

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().min(1, 'Please select a category'),
  price: z.string().min(1, 'Price is required'),
  stock: z.string().min(1, 'Stock is required'),
  discount: z.string().optional(),
  isFlashSale: z.boolean().default(false),
  flashSalePrice: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSuccess?: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isFlashSale: false,
    },
  });

  const isFlashSale = form.watch('isFlashSale');

  const isEditing = !!product;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${API_BASE_URL}/category`);
        const data = await response.json();

        if (data.success) {
          setCategories(data.data);
        }
      } catch  {
        toast.error('Failed to fetch categories');
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        price: product.price.toString(),
        stock: product.stock.toString(),
        discount: product.discount?.toString() || '',
        isFlashSale: product.isFlashSale,
        flashSalePrice: product.flashSalePrice?.toString() || '',
      });

      // Set existing images
      if (product.images) {
        setImageUrls(product.images.map(img => img.url));
      }
    }
  }, [product, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (selectedImages.length + files.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    const invalidFiles = files.filter(
      file => 
        file.size > MAX_FILE_SIZE || 
        !ACCEPTED_IMAGE_TYPES.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error('Some files are invalid. Please check size and format.');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setImageUrls(prev => [...prev, ...newImageUrls]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (selectedImages.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    // Calculate discounted price if discount is provided
    const price = parseFloat(data.price);
    const discount = data.discount ? parseFloat(data.discount) : 0;
    const flashSalePrice = data.flashSalePrice ? parseFloat(data.flashSalePrice) : null;

    // Validate prices
    if (discount > 0) {
      if (discount >= 100) {
        toast.error('Discount cannot be 100% or more');
        return;
      }
      const discountedPrice = price - (price * (discount / 100));
      if (flashSalePrice && discountedPrice <= flashSalePrice) {
        toast.error('Flash sale price must be lower than the discounted price');
        return;
      }
    } else if (flashSalePrice && flashSalePrice >= price) {
      toast.error('Flash sale price must be lower than the regular price');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Prepare the data with calculated prices
      const productData = {
        ...data,
        price: price.toString(),
        discount: discount > 0 ? discount.toString() : null,
        flashSalePrice: flashSalePrice ? flashSalePrice.toString() : null,
      };

      formData.append('data', JSON.stringify(productData));

      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      const url = isEditing 
        ? `${API_BASE_URL}/product/${product.id}`
        : `${API_BASE_URL}/product`;

      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
      }

      toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully`);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Add a helper function to show calculated prices
  const calculatePrices = () => {
    const price = parseFloat(form.watch('price') || '0');
    const discount = parseFloat(form.watch('discount') || '0');
    const flashSalePrice = parseFloat(form.watch('flashSalePrice') || '0');

    if (!price) return null;

    const discountedPrice = discount > 0 ? price - (price * (discount / 100)) : price;

    return (
      <div className="text-sm text-muted-foreground mt-2">
        <div>Regular Price: ৳{price.toFixed(2)}</div>
        {discount > 0 && (
          <div>Discounted Price: ৳{discountedPrice.toFixed(2)} ({discount}% off)</div>
        )}
        {isFlashSale && flashSalePrice > 0 && (
          <div>Flash Sale Price: ৳{flashSalePrice.toFixed(2)}</div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormLabel>Product Images (Up to 5)</FormLabel>
            <div className="grid grid-cols-5 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {selectedImages.length < MAX_IMAGES && (
                <label className="border-2 border-dashed rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:border-primary">
                  <div className="text-center">
                    <ImagePlus className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">Add Image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    multiple
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" max="99" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Price calculations display */}
          {calculatePrices()}

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="isFlashSale"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Flash Sale</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable flash sale for this product
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {isFlashSale && (
              <FormField
                control={form.control}
                name="flashSalePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flash Sale Price</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
} 
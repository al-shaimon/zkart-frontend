'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { API_BASE_URL } from '@/config/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const flashSaleSchema = z.object({
  discount: z.string().optional(),
  flashSalePrice: z.string().optional(),
  flashSaleEnds: z.string().min(1, 'End date is required'),
}).refine((data) => {
  return data.discount || data.flashSalePrice;
}, {
  message: 'Either discount or flash sale price must be provided',
  path: ['discount'],
});

type FlashSaleFormValues = z.infer<typeof flashSaleSchema>;

interface FlashSaleDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productPrice: number;
  onSuccess: () => void;
}

export default function FlashSaleDialog({ 
  open, 
  onClose, 
  productId, 
  productPrice,
  onSuccess 
}: FlashSaleDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FlashSaleFormValues>({
    resolver: zodResolver(flashSaleSchema),
    defaultValues: {
      discount: '',
      flashSalePrice: '',
      flashSaleEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    },
  });

  const onSubmit = async (data: FlashSaleFormValues) => {
    const discount = data.discount ? parseFloat(data.discount) : undefined;
    const flashSalePrice = data.flashSalePrice ? parseFloat(data.flashSalePrice) : undefined;

    if (discount && (discount <= 0 || discount >= 100)) {
      toast.error('Discount must be between 0 and 100');
      return;
    }

    if (flashSalePrice && flashSalePrice >= productPrice) {
      toast.error('Flash sale price must be lower than the regular price');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/product/flash-sale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          productId,
          ...(discount && { discount }),
          ...(flashSalePrice && { flashSalePrice }),
          flashSaleEnds: new Date(data.flashSaleEnds).toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success('Flash sale created successfully');
      onSuccess();
      onClose();
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create flash sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Flash Sale</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min="0" 
                      max="99"
                      placeholder="Enter discount percentage"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm text-muted-foreground text-center">- OR -</div>

            <FormField
              control={form.control}
              name="flashSalePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flash Sale Price</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min="0"
                      max={productPrice - 1}
                      placeholder="Enter fixed sale price"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="flashSaleEnds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date & Time</FormLabel>
                  <FormControl>
                    <Input {...field} type="datetime-local" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Flash Sale'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 
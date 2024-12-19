'use client';

import { useState } from 'react';
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
import { toast } from 'sonner';

const couponSchema = z.object({
  code: z.string().min(4, 'Code must be at least 4 characters'),
  discount: z
    .string()
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, 'Discount must be between 1 and 100'),
  validFrom: z.string().min(1, 'Start date is required'),
  validUntil: z.string().min(1, 'End date is required'),
  usageLimit: z.string().transform(Number).optional(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponFormProps {
  shopId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CouponForm({ shopId, onSuccess, onCancel }: CouponFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      validFrom: new Date().toISOString().slice(0, 16),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    },
  });

  const onSubmit = async (data: CouponFormValues) => {
    if (!shopId) {
      toast.error('Shop ID is required');
      return;
    }

    setLoading(true);
    try {
      const validFrom = new Date(data.validFrom).toISOString();
      const validUntil = new Date(data.validUntil).toISOString();

      const response = await fetch(`${API_BASE_URL}/coupon/create-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          code: data.code,
          discount: Number(data.discount),
          validFrom,
          validUntil,
          usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
          shopId: shopId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success('Coupon created successfully');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., SUMMER2024" />
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
                <Input {...field} type="number" min="1" max="100" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="validFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid From</FormLabel>
                <FormControl>
                  <Input {...field} type="datetime-local" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validUntil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid Until</FormLabel>
                <FormControl>
                  <Input {...field} type="datetime-local" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="usageLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Discount Amount (Optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="1"
                  placeholder="Maximum amount customer can save using this coupon"
                />
              </FormControl>
              <div className="text-sm text-muted-foreground">
                Leave empty for no maximum discount limit
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Coupon'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

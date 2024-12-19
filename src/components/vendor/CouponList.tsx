'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import CouponForm from './CouponForm';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  usageLimit: number | null;
  usageCount: number;
}

export default function CouponList() {
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [shopId, setShopId] = useState<string>('');

  const fetchShopData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/my-shop`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setShopId(data.data.id);
      }
    } catch {
      toast.error('Failed to fetch shop data');
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/coupon/my-coupons`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setCoupons(data.data);
        if (data.data[0]?.shop) {
          setShopId(data.data[0].shop.id);
        }
      }
    } catch {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
    fetchCoupons();
  }, []);

  const handleDelete = async (couponId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/coupon/${couponId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete coupon');
    } finally {
      setCouponToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (showForm) {
    return (
      <Card className="p-4">
        <CouponForm
          shopId={shopId}
          onSuccess={() => {
            setShowForm(false);
            fetchCoupons();
          }}
          onCancel={() => setShowForm(false)}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Coupons</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{coupon.code}</h3>
                  <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {coupon.discount}% off
                  {coupon.usageLimit && ` (Max ৳${coupon.usageLimit} discount)`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Valid: {format(new Date(coupon.validFrom), 'MMM dd, yyyy')} -{' '}
                  {format(new Date(coupon.validUntil), 'MMM dd, yyyy')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCouponToDelete(coupon)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={!!couponToDelete}
        onClose={() => setCouponToDelete(null)}
        onConfirm={() => couponToDelete && handleDelete(couponToDelete.id)}
        title="Delete Coupon"
        description={`Are you sure you want to delete the coupon "${couponToDelete?.code}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}

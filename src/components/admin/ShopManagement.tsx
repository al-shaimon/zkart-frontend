/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';
import { format } from 'date-fns';
import {  Ban, CheckCircle, Package } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Vendor {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  contactNumber: string;
  address: string;
}

interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  createdAt: string;
  isDeleted: boolean;
  vendor: Vendor;
  products: any[];
  followers: any[];
}

interface ShopsResponse {
  data: Shop[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

interface BlacklistedShop {
  id: string;
  shopId: string;
  reason: string;
  blacklistedAt: string;
}


export default function ShopManagement() {
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState<Shop[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [blacklistReason, setBlacklistReason] = useState('');
  const [showBlacklistDialog, setShowBlacklistDialog] = useState(false);
  const [shopToBlacklist, setShopToBlacklist] = useState<Shop | null>(null);
  const [, setBlacklistedShops] = useState<Record<string, BlacklistedShop>>({});

  const fetchShops = async (pageNum: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop?page=${pageNum}&limit=10`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      const data: ShopsResponse = await response.json();

      if (data.data) {
        if (pageNum === 1) {
          setShops(data.data);
        } else {
          setShops((prev) => [...prev, ...data.data]);
        }
        setHasMore(data.data.length === 10);
      }
    } catch {
      toast.error('Failed to fetch shops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops(page);
  }, [page]);

  const fetchBlacklistedShops = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blacklisted-shops`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        const blacklistMap = data.data.reduce(
          (acc: Record<string, BlacklistedShop>, shop: BlacklistedShop) => {
            acc[shop.shopId] = shop;
            return acc;
          },
          {}
        );
        setBlacklistedShops(blacklistMap);
      }
    } catch (error) {
      console.error('Failed to fetch blacklisted shops:', error);
    }
  };

  useEffect(() => {
    fetchBlacklistedShops();
  }, []);

  const handleBlacklist = async () => {
    if (!shopToBlacklist || !blacklistReason.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/blacklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          shopId: shopToBlacklist.id,
          reason: blacklistReason.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setShops((prevShops) =>
        prevShops.map((shop) =>
          shop.id === shopToBlacklist.id ? { ...shop, isDeleted: true } : shop
        )
      );

      toast.success('Shop blacklisted successfully');
      setBlacklistReason('');
      setShopToBlacklist(null);
      setShowBlacklistDialog(false);
      fetchBlacklistedShops();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to blacklist shop');
    }
  };

  const handleRemoveBlacklist = async (shopId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blacklist/${shopId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setShops((prevShops) =>
        prevShops.map((shop) =>
          shop.id === shopId ? { ...shop, isDeleted: false } : shop
        )
      );

      toast.success('Shop removed from blacklist');
      fetchBlacklistedShops();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove shop from blacklist');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-24 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shop</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                      <Image src={shop.logo} alt={shop.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-medium">{shop.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {shop.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src={shop.vendor.profilePhoto}
                        alt={shop.vendor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{shop.vendor.name}</div>
                      <div className="text-xs text-muted-foreground">{shop.vendor.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{shop.products.length}</span>
                  </div>
                </TableCell>
                <TableCell>{shop.followers.length}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      shop.isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }
                  >
                    {shop.isDeleted ? 'Blacklisted' : 'Active'}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(shop.createdAt), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right">
                  {shop.isDeleted ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600"
                      onClick={() => handleRemoveBlacklist(shop.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => {
                        setShopToBlacklist(shop);
                        setShowBlacklistDialog(true);
                      }}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Blacklist
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            Load More Shops
          </Button>
        </div>
      )}

      <Dialog open={showBlacklistDialog} onOpenChange={setShowBlacklistDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blacklist Shop</DialogTitle>
            <DialogDescription>
              Please provide a reason for blacklisting this shop. This action will prevent the shop
              from operating on the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={blacklistReason}
                onChange={(e) => setBlacklistReason(e.target.value)}
                placeholder="Enter reason for blacklisting..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBlacklistDialog(false);
                  setBlacklistReason('');
                  setShopToBlacklist(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBlacklist}
                disabled={!blacklistReason.trim()}
              >
                Blacklist Shop
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

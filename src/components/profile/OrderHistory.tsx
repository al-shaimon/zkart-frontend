'use client';

import { useEffect, useState } from 'react';
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
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentStatus: string;
  orderItems: OrderItem[];
  shop: {
    id: string;
    name: string;
  };
}

interface OrdersResponse {
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async (pageNum: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/my-orders?page=${pageNum}&limit=10`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      const data: OrdersResponse = await response.json();

      if (data.data) {
        if (pageNum === 1) {
          setOrders(data.data);
        } else {
          setOrders((prev) => [...prev, ...data.data]);
        }
        setHasMore(data.data.length === 10);
      }
    } catch (error) {
      toast.error('Failed to fetch orders: ' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="text-sm hover:text-primary truncate block"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-sm text-muted-foreground">
                            ৳{item.price} × {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">৳{order.totalAmount}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className={getOrderStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className={getStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            Load More Orders
          </Button>
        </div>
      )}
    </div>
  );
}

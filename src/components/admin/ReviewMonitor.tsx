'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
    price: number;
    shop: {
      id: string;
      name: string;
      vendor: {
        id: string;
        name: string;
        email: string;
      };
    };
  };
}

interface ReviewsResponse {
  data: Review[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export default function ReviewMonitor() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = async (pageNum: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/review/admin/all-reviews?page=${pageNum}&limit=10`,
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        }
      );
      const data: ReviewsResponse = await response.json();

      if (data.data) {
        if (pageNum === 1) {
          setReviews(data.data);
        } else {
          setReviews((prev) => [...prev, ...data.data]);
        }
        setHasMore(data.data.length === 10);
      }
    } catch {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Customer Reviews</h2>

      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{review.product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Price: ৳{review.product.price}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Shop: {review.product.shop.name} ({review.product.shop.vendor.name})
                  </p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm mb-2">{review.comment}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div>
                    By: {review.customer.name} ({review.customer.email})
                  </div>
                  <div>{format(new Date(review.createdAt), 'MMM dd, yyyy HH:mm')}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
} 
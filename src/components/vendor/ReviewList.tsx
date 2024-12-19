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
  };
  product: {
    id: string;
    name: string;
    shop: {
      id: string;
      name: string;
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

export default function ReviewList() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = async (pageNum: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/review/vendor/my-product-reviews?page=${pageNum}&limit=10`,
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

  if (reviews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No reviews yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Customer Reviews</h2>

      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{review.product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {review.customer.name} · {format(new Date(review.createdAt), 'MMM dd, yyyy')}
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
              <p className="text-sm">{review.comment}</p>
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
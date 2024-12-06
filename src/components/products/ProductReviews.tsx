'use client';

import { Review } from '@/types/api';
import Image from 'next/image';
import Rating from '../ui/Rating';

interface ProductReviewsProps {
  reviews: Review[];
}

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        <p className="text-muted-foreground">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4 p-4 bg-card rounded-lg">
            <div className="flex-shrink-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={review.customer.profilePhoto || '/default-avatar.png'}
                  alt={review.customer.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{review.customer.name}</span>
                <Rating value={review.rating} />
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
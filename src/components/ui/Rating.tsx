'use client';

import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  value: number;
  className?: string;
}

export default function Rating({ value, className = '' }: RatingProps) {
  // Convert rating to nearest half star
  const roundedRating = Math.round(value * 2) / 2;

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400 w-4 h-4" />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-yellow-400 text-yellow-400 w-4 h-4" />);
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(roundedRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300 w-4 h-4" />);
    }

    return stars;
  };

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {renderStars()}
      <span className="ml-1 text-sm text-gray-600">({value.toFixed(1)})</span>
    </div>
  );
}

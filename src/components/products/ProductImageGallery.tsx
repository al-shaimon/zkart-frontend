'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from '@/types/api';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: ProductImage[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-6">
      {/* Main Image Container */}
      <div className="relative w-full max-w-[500px] mx-auto">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={images[selectedImage].url}
            alt="Product image"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 500px"
            priority
            quality={100}
          />

          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Images */}
      <div className="max-w-[500px] mx-auto">
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={cn(
                'relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity',
                selectedImage === index && 'ring-1 ring-primary ring-offset-2'
              )}
            >
              <Image
                src={image.url}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 60px, 100px"
                quality={80}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

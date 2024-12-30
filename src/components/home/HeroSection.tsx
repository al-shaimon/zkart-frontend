'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import Image from 'next/image';

export default function HeroSection() {
  const slides = [
    {
      id: 1,
      image: 'https://res.cloudinary.com/dr4guscnl/image/upload/v1733523343/banner1_k2mvv8.jpg',
      title: 'Flash Sale',
      description: 'Get up to 50% off on selected items',
      buttonText: 'Shop Now',
      buttonLink: '#flash-sale',
      position: 'center',
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/dr4guscnl/image/upload/v1733523345/banner2_togcwl.jpg',
      title: 'New Arrivals',
      description: 'Check out our latest products',
      buttonText: 'Explore',
      buttonLink: '#products',
      position: 'center',
    },
  ];

  return (
    <section className="relative w-full h-[70vh] bg-background">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        effect={'fade'}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        className="w-full h-full group"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full group cursor-pointer overflow-hidden">
              {/* Image with overlay */}
              <div className="absolute inset-0 bg-black/30 z-10 transition-opacity group-hover:bg-black/20" />
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="100vw"
                quality={100}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

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
      image: 'https://res.cloudinary.com/dr4guscnl/image/upload/v1736457350/220_mcrftu.jpg',
      title: 'Flash Sale',
      description: 'Check out our latest products',
      buttonText: 'Explore',
      buttonLink: '#products',
      position: 'center',
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/dr4guscnl/image/upload/v1736457464/5706210_pgg5xa.jpg',
      title: 'Flash Sale',
      description: 'Check out our latest products',
      buttonText: 'Explore',
      buttonLink: '#products',
      position: 'center',
    },
    {
      id: 3,
      image: 'https://res.cloudinary.com/dr4guscnl/image/upload/v1736457794/224_bdsqiv.jpg',
      title: 'New Arrivals',
      description: 'Check out our latest products',
      buttonText: 'Explore',
      buttonLink: '#products',
      position: 'center',
    },
    {
      id: 4,
      image:
        'https://res.cloudinary.com/dr4guscnl/image/upload/v1736456494/sales-promotion-poster_2_v1daes.jpg',
      title: 'Flash Sale',
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
        loop={true}
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
              <div className="absolute inset-0" />
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-100"
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

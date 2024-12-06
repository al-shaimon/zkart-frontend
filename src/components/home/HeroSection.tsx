'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

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
    <section className="relative w-full">
      <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[750px] relative">
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
          modules={[Autoplay, Pagination, EffectFade]}
          className="w-full h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="cursor-default relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="100vw"
                  quality={100}
                  onError={() => {
                    console.error(`Error loading image: ${slide.image}`);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />

                <div
                  className={`absolute inset-0 flex flex-col justify-center ${
                    slide.position === 'left'
                      ? 'items-start pl-6 md:pl-16 lg:pl-24'
                      : 'items-center'
                  }`}
                >
                  <div className="text-center max-w-[90%] md:max-w-[600px] px-4 md:px-0">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl lg:text-2xl text-white mb-6 drop-shadow-lg">
                      {slide.description}
                    </p>
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-full text-lg"
                    >
                      <a href={slide.buttonLink}>{slide.buttonText}</a>
                    </Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

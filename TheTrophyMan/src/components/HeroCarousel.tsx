// Hero Carousel Component
// Full-screen hero with Swiper carousel

'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { HeroSlide } from '@/types';
import { urlFor } from '@/lib/sanity';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  if (!slides || slides.length === 0) {
    return (
      <section className="relative h-screen bg-black-rich flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center px-4"
        >
          <h1 className="font-display text-hero font-bold text-white mb-6">
            CELEBRATING
            <br />
            ACHIEVEMENT
            <br />
            SINCE 1998
          </h1>
          <p className="text-xl text-text-gray mb-8 max-w-2xl mx-auto">
            Custom trophies, awards &amp; engraving for Oromocto and the Maritimes.
          </p>
          <Link
            href="/get-quote"
            className="btn-primary inline-block px-8 py-4 text-lg font-semibold uppercase tracking-ultra"
          >
            Get a Free Quote →
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative h-screen">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        navigation={true}
        loop={true}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide._id} className="relative">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={urlFor(slide.image).url()}
                alt={slide.image.alt || slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black-rich via-black-rich/70 to-black-rich/40" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2,
                  }}
                >
                  <h1 className="font-display text-hero font-bold text-white mb-6 leading-tight">
                    {slide.title.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < slide.title.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </h1>

                  {slide.subtitle && (
                    <p className="text-xl md:text-2xl text-text-gray mb-8 max-w-2xl mx-auto">
                      {slide.subtitle}
                    </p>
                  )}

                  <Link
                    href={slide.ctaLink || '/get-quote'}
                    className="btn-primary inline-block px-8 py-4 text-lg font-semibold uppercase tracking-ultra"
                  >
                    {slide.ctaText || 'Get a Free Quote'} →
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0], y: [0, 12] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-gold rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
}

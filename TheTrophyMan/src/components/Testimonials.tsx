// Testimonials Component
// Displays customer testimonials in a carousel

'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '@/types';
import { urlFor } from '@/lib/sanity';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-black-rich relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-gold font-mono text-sm uppercase tracking-ultra mb-4 block">
            Testimonials
          </span>
          <h2 className="font-display text-display font-bold text-white">
            What Our Clients Say
          </h2>
        </motion.div>

        {/* Testimonials Carousel */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={32}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="!pb-12"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={testimonial._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full"
              >
                <div className="bg-black-elevated border border-black-border rounded-lg p-8 h-full flex flex-col">
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-gold/30 mb-6" />

                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < (testimonial.rating || 5)
                            ? 'text-gold fill-gold'
                            : 'text-text-muted'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="font-display text-lg text-white italic mb-6 flex-grow">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    {testimonial.image ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={urlFor(testimonial.image).width(100).height(100).url()}
                          alt={testimonial.author}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="font-display text-xl font-bold text-gold">
                          {testimonial.author.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-white">
                        {testimonial.author}
                      </p>
                      {testimonial.role && (
                        <p className="text-text-gray text-sm">{testimonial.role}</p>
                      )}
                      {testimonial.organization && (
                        <p className="text-gold text-sm">{testimonial.organization}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

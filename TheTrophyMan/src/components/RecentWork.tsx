// Recent Work Carousel Component
// Displays featured gallery items in a horizontal carousel

'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { GalleryItem } from '@/types';
import { urlFor } from '@/lib/sanity';
import { categoryLabels } from '@/types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface RecentWorkProps {
  items: GalleryItem[];
}

export default function RecentWork({ items }: RecentWorkProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-black-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="text-gold font-mono text-sm uppercase tracking-ultra mb-4 block">
              Portfolio
            </span>
            <h2 className="font-display text-display font-bold text-white">
              Recent Work
            </h2>
          </div>
          
          <Link
            href="/gallery"
            className="mt-4 md:mt-0 text-gold hover:text-gold-light transition-colors inline-flex items-center gap-2"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Carousel */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={true}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="!pb-12"
        >
          {items.map((item, index) => (
            <SwiperSlide key={item._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link href="/gallery" className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg gallery-item">
                    <Image
                      src={urlFor(item.image).width(400).height(500).url()}
                      alt={item.image.alt || item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    
                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black-rich/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-gold font-mono text-xs uppercase tracking-ultra mb-2">
                        {categoryLabels[item.category] || item.category}
                      </span>
                      <h3 className="font-display text-xl font-bold text-white mb-1">
                        {item.title}
                      </h3>
                      {item.client && (
                        <p className="text-text-gray text-sm">{item.client}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

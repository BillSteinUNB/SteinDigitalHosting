// Services Grid Component
// Displays services in a responsive grid layout

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  Shirt,
  Signpost,
  PenTool,
  Gift,
  ArrowRight,
} from 'lucide-react';
import type { Service } from '@/types';


interface ServicesGridProps {
  services: Service[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Award,
  Shirt,
  Signpost,
  PenTool,
  Gift,
};

export default function ServicesGrid({ services }: ServicesGridProps) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-gold font-mono text-sm uppercase tracking-ultra mb-4 block">
            What We Offer
          </span>
          <h2 className="font-display text-display font-bold text-text-dark mb-4">
            Our Services
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Quality craftsmanship for every occasion. From sports championships to
            corporate recognition.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon
              ? iconMap[service.icon]
              : Trophy;

            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.08,
                }}
              >
                <Link
                  href={`/services/${service.slug.current}`}
                  className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 product-card"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-light flex items-center justify-center">
                    {IconComponent && (
                      <IconComponent className="w-16 h-16 text-gold-muted" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black-rich/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 text-gold" />
                      )}
                      <h3 className="font-display text-lg font-bold text-text-dark">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-text-muted text-sm mb-4 line-clamp-2">
                      {service.shortDescription ||
                        'Custom ' +
                          service.title.toLowerCase() +
                          ' for all occasions.'}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-gold">
                        {service.startingPrice || 'Contact for pricing'}
                      </span>
                      <span className="text-text-muted group-hover:text-gold transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

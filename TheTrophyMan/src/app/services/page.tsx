// Services Index Page
// Lists all services offered by The Trophy Man

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import {
  Trophy,
  Award,
  Shirt,
  Signpost,
  PenTool,
  Gift,
  ArrowRight,
  Building2,
  Medal,
} from 'lucide-react';
import { mockServices } from '@/lib/mockData';
import type { Service } from '@/types';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Custom trophies, awards, plaques, engraving, apparel, signs, and promotional products in Oromocto, NB. Quality craftsmanship for every occasion.',
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Award,
  Shirt,
  Signpost,
  PenTool,
  Gift,
  Building2,
  Medal,
};

export default function ServicesPage() {
  const services = mockServices;

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 bg-black-rich">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
           
           
           
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-gold font-mono text-sm uppercase tracking-ultra mb-4 block">
              What We Create
            </span>
            <h1 className="font-display text-display font-bold text-white mb-6">
              Our Services
            </h1>
            <p className="text-xl text-text-gray">
              Quality craftsmanship for every occasion. From sports championships
              to corporate recognition, we create lasting memories.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-white-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((service, index) => {
              const IconComponent = service.icon
                ? iconMap[service.icon]
                : Trophy;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={service._id}
                 
                 
                 
                 
                  className={`flex flex-col ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } gap-12 items-center`}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl bg-gray-light flex items-center justify-center">
                      {IconComponent && (
                        <IconComponent className="w-24 h-24 text-gold-muted" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2">
                    <div className="flex items-center gap-3 mb-4">
                      {IconComponent && (
                        <IconComponent className="w-8 h-8 text-gold" />
                      )}
                      <h2 className="font-display text-h1 font-bold text-text-dark">
                        {service.title}
                      </h2>
                    </div>

                    <p className="text-text-muted text-lg mb-6">
                      {service.description || service.shortDescription}
                    </p>

                    {service.startingPrice && (
                      <p className="font-mono text-gold text-xl mb-6">
                        Starting at {service.startingPrice}
                      </p>
                    )}

                    <Link
                      href={`/get-quote?service=${service.slug.current}`}
                      className="inline-flex items-center gap-2 text-text-dark font-semibold hover:text-gold transition-colors"
                    >
                      Get a Quote
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
           
           
           
           
          >
            <h2 className="font-display text-display font-bold text-white mb-6">
              Not Sure What You Need?
            </h2>
            
            <p className="text-xl text-text-gray mb-8">
              Contact us for a free consultation. We'll help you find the perfect
              award or promotional product for your event.
            </p>

            <Link
              href="/get-quote"
              className="btn-primary inline-block px-8 py-4 text-lg font-semibold uppercase tracking-ultra"
            >
              Get a Free Quote →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

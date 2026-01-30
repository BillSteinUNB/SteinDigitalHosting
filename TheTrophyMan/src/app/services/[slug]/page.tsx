// Service Detail Page
// Dynamic page for individual service details

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { client } from '@/lib/sanity';
import {
  serviceBySlugQuery,
  allServiceSlugsQuery,
  servicesQuery,
} from '@/lib/queries';
import { urlFor } from '@/lib/sanity';
import type { Service } from '@/types';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all services
export async function generateStaticParams() {
  try {
    const services = await client.fetch(allServiceSlugsQuery);
    return services.map((service: { slug: string }) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for each service page
export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const service = await client.fetch(serviceBySlugQuery(slug));
    if (!service) {
      return {
        title: 'Service Not Found',
      };
    }

    return {
      title: service.title,
      description: service.shortDescription || service.description,
    };
  } catch (error) {
    return {
      title: 'Service',
    };
  }
}

export const revalidate = 3600;

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  
  let service: Service | null = null;
  let allServices: Service[] = [];

  try {
    [service, allServices] = await Promise.all([
      client.fetch(serviceBySlugQuery(slug)),
      client.fetch(servicesQuery),
    ]);
  } catch (error) {
    console.error('Error fetching service:', error);
  }

  if (!service) {
    notFound();
  }

  return (
    <>
      {/* Back Navigation */}
      <div className="bg-black-rich border-b border-black-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-text-gray hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-black-rich">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-display text-hero font-bold text-white mb-6">
              {service.title}
            </h1>

            {service.startingPrice && (
              <p className="font-mono text-gold text-2xl mb-6">
                {service.startingPrice}
              </p>
            )}

            <p className="text-xl text-text-gray">
              {service.description || service.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {service.gallery && service.gallery.length > 0 && (
        <section className="py-24 bg-white-warm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-h1 font-bold text-text-dark mb-12">
              Examples
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.gallery.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden shadow-lg"
                >
                  <Image
                    src={urlFor(image).width(600).height(600).url()}
                    alt={image.alt || `${service.title} example ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {service.pricingTiers && service.pricingTiers.length > 0 && (
        <section className="py-24 bg-black-soft">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-h1 font-bold text-white mb-12">
              Pricing Guide
            </h2>

            <div className="space-y-6">
              {service.pricingTiers.map((tier, index) => (
                <div
                  key={index}
                  className="bg-black-elevated border border-black-border rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div>
                    <h3 className="font-display text-xl font-bold text-white mb-2">
                      {tier.name}
                    </h3>
                    {tier.description && (
                      <p className="text-text-gray">{tier.description}</p>
                    )}
                  </div>
                  <span className="font-mono text-gold text-xl">
                    {tier.priceRange}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-text-gray text-sm">
              * Custom engraving from $5 per item. Prices may vary based on
              complexity and quantity.
            </p>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-display font-bold text-black-pure mb-6">
            Request a Quote for {service.title}
          </h2>

          <p className="text-xl text-black-rich/80 mb-8">
            Get a custom quote tailored to your specific needs and budget.
          </p>

          <Link
            href={`/get-quote?service=${service.slug.current}`}
            className="inline-block px-10 py-4 bg-black-pure text-gold font-semibold uppercase tracking-ultra text-lg hover:bg-black-rich transition-colors duration-300"
          >
            Request a Quote →
          </Link>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-24 bg-black-rich">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-h1 font-bold text-white mb-12">
            Other Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices
              .filter((s) => s._id !== service._id)
              .slice(0, 3)
              .map((otherService) => (
                <Link
                  key={otherService._id}
                  href={`/services/${otherService.slug.current}`}
                  className="group bg-black-elevated border border-black-border rounded-lg p-6 hover:border-gold transition-all"
                >
                  <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                    {otherService.title}
                  </h3>
                  <p className="text-text-gray text-sm mb-4">
                    {otherService.shortDescription}
                  </p>
                  <span className="inline-flex items-center gap-2 text-gold text-sm">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

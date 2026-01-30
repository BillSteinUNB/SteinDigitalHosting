// Home Page
// Main landing page for The Trophy Man

import { Metadata } from 'next';
import { client } from '@/lib/sanity';
import {
  heroSlidesQuery,
  servicesQuery,
  featuredGalleryQuery,
  featuredTestimonialsQuery,
  siteSettingsQuery,
} from '@/lib/queries';
import HeroCarousel from '@/components/HeroCarousel';
import ServicesGrid from '@/components/ServicesGrid';
import RecentWork from '@/components/RecentWork';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import type {
  HeroSlide,
  Service,
  GalleryItem,
  Testimonial,
  SiteSettings,
} from '@/types';

export const metadata: Metadata = {
  title: 'Custom Trophies & Awards | Oromocto NB',
  description:
    'Custom trophies, awards, plaques, engraving, and promotional products in Oromocto, New Brunswick. Serving the Maritimes with quality craftsmanship since 1998.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  // Fetch all data in parallel
  let heroSlides: HeroSlide[] = [];
  let services: Service[] = [];
  let galleryItems: GalleryItem[] = [];
  let testimonials: Testimonial[] = [];
  let settings: SiteSettings | null = null;

  try {
    const [
      heroSlidesData,
      servicesData,
      galleryData,
      testimonialsData,
      settingsData,
    ] = await Promise.all([
      client.fetch(heroSlidesQuery),
      client.fetch(servicesQuery),
      client.fetch(featuredGalleryQuery),
      client.fetch(featuredTestimonialsQuery),
      client.fetch(siteSettingsQuery),
    ]);

    heroSlides = heroSlidesData || [];
    services = servicesData || [];
    galleryItems = galleryData || [];
    testimonials = testimonialsData || [];
    settings = settingsData;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
  }

  return (
    <>
      {/* Hero Section */}
      <HeroCarousel slides={heroSlides} />

      {/* Services Grid */}
      <ServicesGrid services={services} />

      {/* Recent Work */}
      <RecentWork items={galleryItems} />

      {/* Testimonials */}
      <Testimonials testimonials={testimonials} />

      {/* CTA Section */}
      <CTASection settings={settings} />
    </>
  );
}

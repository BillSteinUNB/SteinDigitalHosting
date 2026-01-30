// Home Page
// Main landing page for The Trophy Man

import { Metadata } from 'next';
import HeroCarousel from '@/components/HeroCarousel';
import ServicesGrid from '@/components/ServicesGrid';
import RecentWork from '@/components/RecentWork';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import {
  mockHeroSlides,
  mockServices,
  mockGalleryItems,
  mockTestimonials,
  mockSiteSettings,
} from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'Custom Trophies & Awards | Oromocto NB',
  description:
    'Custom trophies, awards, plaques, engraving, and promotional products in Oromocto, New Brunswick. Serving the Maritimes with quality craftsmanship since 1998.',
};

export default function HomePage() {
  // Use mock data for demo
  const heroSlides = mockHeroSlides;
  const services = mockServices;
  const galleryItems = mockGalleryItems.filter((item) => item.featured);
  const testimonials = mockTestimonials;
  const settings = mockSiteSettings;

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

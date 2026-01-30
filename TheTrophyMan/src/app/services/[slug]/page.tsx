// Service Detail Page - Simplified for Demo
// Redirects to main services page since individual service pages require Sanity

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Details',
  description: 'Custom trophies and awards services in Oromocto, NB',
};

// Generate static params for all service slugs
export function generateStaticParams() {
  return [
    { slug: 'custom-trophies' },
    { slug: 'engraving' },
    { slug: 'corporate-awards' },
    { slug: 'apparel-promo' },
    { slug: 'signs-banners' },
    { slug: 'plaques-medals' },
  ];
}

export default function ServicePage() {
  // Client-side redirect using meta refresh for static export
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/services" />
      <div className="min-h-screen bg-black-rich flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">Redirecting...</h1>
          <a href="/services" className="text-gold hover:underline">
            Click here if not redirected
          </a>
        </div>
      </div>
    </>
  );
}

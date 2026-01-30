// Root Layout
// Main layout with fonts, metadata, and global providers

import type { Metadata } from 'next';
import { Inter, Playfair_Display, Space_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Font Configuration
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: 'The Trophy Man | Custom Trophies & Awards | Oromocto NB',
    template: '%s | The Trophy Man',
  },
  description:
    'Custom trophies, awards, plaques, engraving, and promotional products in Oromocto, New Brunswick. Serving the Maritimes with quality craftsmanship since 1998.',
  keywords: [
    'custom trophies',
    'awards',
    'engraving',
    'Oromocto',
    'New Brunswick',
    'promotional products',
    'plaques',
    'sports awards',
    'corporate awards',
  ],
  authors: [{ name: 'Stein Digital' }],
  creator: 'The Trophy Man',
  metadataBase: new URL('https://trophyman.ca'),
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://trophyman.ca',
    siteName: 'The Trophy Man',
    title: 'The Trophy Man | Custom Trophies & Awards | Oromocto NB',
    description:
      'Custom trophies, awards, plaques, engraving, and promotional products in Oromocto, New Brunswick.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'The Trophy Man - Custom Trophies and Awards in Oromocto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Trophy Man | Custom Trophies & Awards | Oromocto NB',
    description:
      'Custom trophies, awards, plaques, engraving, and promotional products in Oromocto, New Brunswick.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual code
  },
};

// Schema.org LocalBusiness Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'The Trophy Man',
  description: 'Custom trophies, awards, and engraving services in Oromocto, NB',
  url: 'https://trophyman.ca',
  telephone: '+1-506-357-1234',
  email: 'info@trophyman.ca',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '4 Brizley St',
    addressLocality: 'Oromocto',
    addressRegion: 'NB',
    postalCode: 'E2V 1E3',
    addressCountry: 'CA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 45.8458,
    longitude: -66.4786,
  },
  openingHours: ['Mo-Fr 09:00-17:00', 'Sa 10:00-14:00'],
  image: 'https://trophyman.ca/storefront.jpg',
  priceRange: '$$',
  areaServed: {
    '@type': 'Place',
    name: 'Oromocto, New Brunswick, Canada',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-CA"
      className={`${inter.variable} ${playfair.variable} ${spaceMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

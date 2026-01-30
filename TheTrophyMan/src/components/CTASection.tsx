// CTA Section Component
// Call-to-action section with gold gradient background

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';
import type { SiteSettings } from '@/types';

interface CTASectionProps {
  settings?: SiteSettings | null;
}

export default function CTASection({ settings }: CTASectionProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gold Gradient Background */}
      <div className="absolute inset-0 gradient-gold" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-display font-bold text-black-pure mb-6">
            Ready to Create Something Special?
          </h2>
          
          <p className="text-xl text-black-rich/80 mb-8 max-w-2xl mx-auto">
            Get a free quote for your custom trophy, award, or promotional product today.
          </p>

          <Link
            href="/get-quote"
            className="inline-block px-10 py-4 bg-black-pure text-gold font-semibold uppercase tracking-ultra text-lg hover:bg-black-rich transition-colors duration-300"
          >
            Get a Free Quote →
          </Link>

          {/* Contact Info */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                settings?.address
                  ? `${settings.address.street}, ${settings.address.city}, ${settings.address.province}`
                  : '4 Brizley St, Oromocto, NB'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-black-rich/70 hover:text-black-pure transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span>
                {settings?.address
                  ? `${settings.address.street}, ${settings.address.city}`
                  : '4 Brizley St, Oromocto'}
              </span>
            </a>

            <a
              href={`tel:${settings?.phone?.replace(/\s/g, '') || '506-357-1234'}`}
              className="flex items-center gap-2 text-black-rich/70 hover:text-black-pure transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>{settings?.phone || '(506) 357-1234'}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

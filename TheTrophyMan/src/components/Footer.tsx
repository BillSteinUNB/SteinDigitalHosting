// Footer Component
// Site footer with contact info, hours, and links

import Link from 'next/link';
import { Trophy, MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react';
import { client } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import type { SiteSettings } from '@/types';

export default async function Footer() {
  // Fetch site settings from Sanity
  let settings: SiteSettings | null = null;
  try {
    settings = await client.fetch(siteSettingsQuery);
  } catch (error) {
    console.error('Error fetching site settings:', error);
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black-pure border-t border-black-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Trophy className="w-8 h-8 text-gold" />
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white tracking-tight">
                  THE TROPHY MAN
                </span>
                <span className="text-xs text-text-gray tracking-ultra uppercase">
                  Est. 1998
                </span>
              </div>
            </Link>
            
            <p className="text-text-gray text-sm leading-relaxed">
              Custom trophies, awards, and engraving services for Oromocto and the Maritimes. 
              Celebrating achievement since 1998.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {settings?.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-black-border text-text-gray hover:text-gold hover:border-gold transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-black-border text-text-gray hover:text-gold hover:border-gold transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/services', label: 'Services' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/about', label: 'About Us' },
                { href: '/get-quote', label: 'Get a Quote' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-gray hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-text-gray text-sm">
                  {settings?.address ? (
                    <>
                      {settings.address.street}
                      <br />
                      {settings.address.city}, {settings.address.province} {settings.address.postalCode}
                    </>
                  ) : (
                    <>
                      4 Brizley St
                      <br />
                      Oromocto, NB E2V 1E3
                    </>
                  )}
                </span>
              </li>
              
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <a
                  href={`tel:${settings?.phone?.replace(/\s/g, '') || '506-357-1234'}`}
                  className="text-text-gray hover:text-gold transition-colors text-sm"
                >
                  {settings?.phone || '(506) 357-1234'}
                </a>
              </li>
              
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <a
                  href={`mailto:${settings?.email || 'info@trophyman.ca'}`}
                  className="text-text-gray hover:text-gold transition-colors text-sm"
                >
                  {settings?.email || 'info@trophyman.ca'}
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-6">Hours</h3>
            <ul className="space-y-3">
              {settings?.hours && settings.hours.length > 0 ? (
                settings.hours.map((schedule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div className="text-text-gray text-sm">
                      <span className="text-white">{schedule.days}:</span>
                      <br />
                      {schedule.hours}
                    </div>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div className="text-text-gray text-sm">
                      <span className="text-white">Mon - Fri:</span>
                      <br />
                      9:00 AM - 5:00 PM
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div className="text-text-gray text-sm">
                      <span className="text-white">Saturday:</span>
                      <br />
                      10:00 AM - 2:00 PM
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div className="text-text-gray text-sm">
                      <span className="text-white">Sunday:</span>
                      <br />
                      Closed
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-black-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-sm">
              © {currentYear} The Trophy Man. All rights reserved.
            </p>
            <p className="text-text-muted text-sm">
              Designed &amp; Developed by{' '}
              <a
                href="https://steindigital.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                Stein Digital
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

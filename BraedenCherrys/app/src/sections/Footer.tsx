import { Instagram, Facebook } from 'lucide-react';
import { businessInfo } from '@/data';

const quickLinks = [
  { name: 'Gallery', href: '#gallery' },
  { name: 'Services', href: '#services' },
  { name: 'Book Now', href: '#booking' },
  { name: 'About', href: '#about' },
];

const shopLinks = [
  { name: 'Pomades', href: '#shop' },
  { name: 'Beard Care', href: '#shop' },
  { name: 'Hair Care', href: '#shop' },
  { name: 'View All', href: '#shop' },
];

const contactLinks = [
  { name: businessInfo.phone, href: `tel:${businessInfo.phone.replace(/\D/g, '')}` },
  { name: businessInfo.email, href: `mailto:${businessInfo.email}` },
  { name: businessInfo.address, href: '#contact' },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative bg-noir-pure border-t border-white/10">
      <div className="w-full section-padding py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="lg:col-span-1">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-display text-4xl text-white hover:text-cherry transition-colors duration-200"
              >
                CHERRY'S BARBERSHOP
              </a>
              <p className="font-body text-white/60 mt-4 max-w-xs">
                The sharpest cuts in Moncton. No exceptions.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/60 hover:text-cherry hover:bg-white/5 rounded-sm transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/60 hover:text-cherry hover:bg-white/5 rounded-sm transition-all duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/60 hover:text-cherry hover:bg-white/5 rounded-sm transition-all duration-200"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-mono text-sm text-white/40 tracking-ultra mb-4">
                QUICK LINKS
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="font-body text-white/60 hover:text-cherry transition-colors duration-200"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-mono text-sm text-white/40 tracking-ultra mb-4">
                SHOP
              </h4>
              <ul className="space-y-3">
                {shopLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="font-body text-white/60 hover:text-cherry transition-colors duration-200"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-mono text-sm text-white/40 tracking-ultra mb-4">
                CONTACT
              </h4>
              <ul className="space-y-3">
                {contactLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault();
                          scrollToSection(link.href);
                        }
                      }}
                      className="font-body text-white/60 hover:text-cherry transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-white/40">
              © {new Date().getFullYear()} {businessInfo.name}. All rights reserved.
            </p>
            <p className="font-mono text-xs text-white/40">
              Moncton, New Brunswick, Canada
            </p>
          </div>
        </div>
      </div>

      {/* Large Background Logo */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <div className="font-display text-[20vw] text-white/[0.02] whitespace-nowrap leading-none text-center translate-y-1/3">
          CHERRY'S
        </div>
      </div>
    </footer>
  );
}

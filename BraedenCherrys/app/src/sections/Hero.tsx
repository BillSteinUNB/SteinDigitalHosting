import { useEffect, useState, useRef } from 'react';
import { Play, MapPin, Clock, Phone, ChevronDown } from 'lucide-react';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToGallery = () => {
    const element = document.querySelector('#gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Barber at work"
          className={`w-full h-full object-cover transition-all duration-1000 ${
            isLoaded ? 'scale-100 opacity-60' : 'scale-110 opacity-0'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-sharp)' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
        {/* Bottom fade for info bar */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full section-padding pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="font-display text-hero text-white leading-none tracking-tight">
              <span
                className={`block transition-all duration-700 ${
                  isLoaded
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-16 opacity-0'
                }`}
                style={{ transitionDelay: '0.2s', transitionTimingFunction: 'var(--ease-sharp)' }}
              >
                SHARP
              </span>
              <span
                className={`block transition-all duration-700 ${
                  isLoaded
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-16 opacity-0'
                }`}
                style={{ transitionDelay: '0.3s', transitionTimingFunction: 'var(--ease-sharp)' }}
              >
                CUTS.
              </span>
              <span
                className={`block text-cherry transition-all duration-700 ${
                  isLoaded
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-16 opacity-0'
                }`}
                style={{ transitionDelay: '0.4s', transitionTimingFunction: 'var(--ease-sharp)' }}
              >
                SHARPER
              </span>
              <span
                className={`block transition-all duration-700 ${
                  isLoaded
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-16 opacity-0'
                }`}
                style={{ transitionDelay: '0.5s', transitionTimingFunction: 'var(--ease-sharp)' }}
              >
                STYLE.
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <p
            className={`font-body text-lg md:text-xl text-white/80 mb-10 max-w-md transition-all duration-700 ${
              isLoaded
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '0.7s', transitionTimingFunction: 'var(--ease-sharp)' }}
          >
            Moncton's premier barbershop.
            <br />
            Precision in every cut.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-wrap gap-4 mb-16 transition-all duration-700 ${
              isLoaded
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '0.9s', transitionTimingFunction: 'var(--ease-sharp)' }}
          >
            <a
              href="#booking"
              className="btn-primary inline-flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                alert('Booking system coming soon! Call (506) 555-FADE to book.');
              }}
            >
              BOOK YOUR CUT
              <span className="text-lg">→</span>
            </a>
            <button
              className="btn-outline inline-flex items-center gap-2"
              onClick={() => alert('Video coming soon!')}
            >
              <Play className="w-4 h-4" />
              WATCH THE CRAFT
            </button>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div
        className={`relative z-10 w-full section-padding pb-8 transition-all duration-700 ${
          isLoaded
            ? 'translate-y-0 opacity-100'
            : 'translate-y-8 opacity-0'
        }`}
        style={{ transitionDelay: '1.1s', transitionTimingFunction: 'var(--ease-sharp)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="w-4 h-4 text-cherry" />
              <span className="font-mono text-sm tracking-wide">MONCTON, NB</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="w-4 h-4 text-cherry" />
              <span className="font-mono text-sm tracking-wide">TUE-SAT 9-7</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Phone className="w-4 h-4 text-cherry" />
              <span className="font-mono text-sm tracking-wide">(506) 555-FADE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToGallery}
        className={`absolute bottom-24 left-1/2 -translate-x-1/2 z-10 text-white/50 hover:text-white transition-all duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1.3s' }}
        aria-label="Scroll to gallery"
      >
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </button>
    </section>
  );
}

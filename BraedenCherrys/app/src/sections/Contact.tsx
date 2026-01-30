import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { businessInfo, businessHours } from '@/data';

export default function Contact() {
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>();

  const getTodayHours = () => {
    const today = new Date().getDay();
    return businessHours[today];
  };

  const today = getTodayHours();

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-noir-rich"
    >
      <div className="w-full section-padding">
        {/* Section Header */}
        <div
          className={`mb-12 transition-all duration-700 ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-sharp)' }}
        >
          <h2 className="font-display text-display text-white tracking-tight">
            FIND US
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map */}
          <div
            className={`relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] rounded-sm overflow-hidden bg-noir-elevated transition-all duration-700 ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : '-translate-x-12 opacity-0'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-sharp)' }}
          >
            {/* Static Map Representation */}
            <div className="absolute inset-0 bg-gradient-to-br from-noir-elevated to-noir-border flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-cherry mx-auto mb-4" />
                <p className="font-display text-2xl text-white">
                  {businessInfo.city}
                </p>
                <p className="font-body text-gray-text mt-2">
                  {businessInfo.address}
                </p>
              </div>
            </div>
            {/* Map Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
              <div className="relative">
                <div className="w-4 h-4 bg-cherry rounded-full animate-ping absolute" />
                <div className="w-4 h-4 bg-cherry rounded-full relative" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-12 opacity-0'
            }`}
            style={{
              transitionDelay: '0.2s',
              transitionTimingFunction: 'var(--ease-sharp)',
            }}
          >
            <div className="space-y-8">
              {/* Address */}
              <div>
                <h3 className="font-display text-h2 text-white mb-4">
                  CHERRY'S BARBERSHOP
                </h3>
                <div className="flex items-start gap-3 text-white/70">
                  <MapPin className="w-5 h-5 text-cherry mt-1 flex-shrink-0" />
                  <div className="font-body">
                    <p>{businessInfo.address}</p>
                    <p>{businessInfo.city}</p>
                    <p>{businessInfo.country}</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-3">
                <a
                  href={`tel:${businessInfo.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-3 text-white/70 hover:text-cherry transition-colors duration-200"
                >
                  <Phone className="w-5 h-5 text-cherry flex-shrink-0" />
                  <span className="font-mono">{businessInfo.phone}</span>
                </a>
                <a
                  href={`mailto:${businessInfo.email}`}
                  className="flex items-center gap-3 text-white/70 hover:text-cherry transition-colors duration-200"
                >
                  <Mail className="w-5 h-5 text-cherry flex-shrink-0" />
                  <span className="font-body">{businessInfo.email}</span>
                </a>
              </div>

              {/* Hours */}
              <div>
                <h4 className="font-mono text-sm text-white/40 tracking-ultra mb-4">
                  HOURS
                </h4>
                <div className="space-y-2">
                  {businessHours.map((day) => (
                    <div
                      key={day.day}
                      className={`flex justify-between font-body text-sm ${
                        day.day === today.day
                          ? 'text-white'
                          : 'text-white/60'
                      }`}
                    >
                      <span>{day.day}</span>
                      <span className={day.isOpen ? '' : 'text-white/40'}>
                        {day.hours}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Today's Status */}
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-cherry/10 rounded-sm">
                  <div className="w-2 h-2 bg-cherry rounded-full animate-pulse" />
                  <span className="font-mono text-xs text-cherry">
                    TODAY: {today.hours}
                  </span>
                </div>
              </div>

              {/* Directions CTA */}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${businessInfo.address} ${businessInfo.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                GET DIRECTIONS
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

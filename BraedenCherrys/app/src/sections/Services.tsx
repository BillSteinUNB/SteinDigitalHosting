import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { services } from '@/data';

export default function Services() {
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section
      id="services"
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
            SERVICES
          </h2>
          <p className="font-body text-gray-text mt-2">
            The menu. Clean cuts, fair prices.
          </p>
        </div>

        {/* Services List */}
        <div className="max-w-4xl">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group border-t border-white/10 transition-all duration-700 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 0.1}s`,
                transitionTimingFunction: 'var(--ease-sharp)',
              }}
            >
              <div className="py-6 md:py-8 flex items-start justify-between gap-4 hover:bg-white/[0.02] transition-colors duration-200 px-4 -mx-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-display text-xl md:text-2xl text-white group-hover:text-cherry transition-colors duration-200">
                      {service.name}
                    </h3>
                    {service.id === 'haircut-beard' && (
                      <span className="px-2 py-1 bg-cherry/20 text-cherry text-xs font-mono tracking-wide rounded-sm">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm text-gray-text">
                    {service.description}
                  </p>
                </div>
                <div className="font-mono text-xl md:text-2xl text-cherry">
                  ${service.price}
                </div>
              </div>
            </div>
          ))}
          {/* Bottom border */}
          <div className="border-t border-white/10" />
        </div>

        {/* CTA */}
        <div
          className={`mt-12 text-center transition-all duration-700 ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
          style={{
            transitionDelay: `${services.length * 0.1}s`,
            transitionTimingFunction: 'var(--ease-sharp)',
          }}
        >
          <a
            href="#booking"
            className="btn-primary inline-flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              alert('Booking system coming soon! Call (506) 555-FADE to book.');
            }}
          >
            BOOK NOW
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

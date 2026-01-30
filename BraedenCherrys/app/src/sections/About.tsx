import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { teamMembers } from '@/data';

export default function About() {
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-noir-rich"
    >
      <div className="w-full section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Image */}
          <div
            className={`relative transition-all duration-700 ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : '-translate-x-12 opacity-0'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-sharp)' }}
          >
            <div className="aspect-[3/2] rounded-sm overflow-hidden">
              <img
                src="/images/shop-interior.jpg"
                alt="Cherry's Barbershop Interior"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-cherry rounded-sm -z-10" />
          </div>

          {/* Content */}
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
            <h2 className="font-display text-display text-white tracking-tight mb-6">
              ABOUT CHERRY'S
            </h2>
            <div className="space-y-4 font-body text-white/70 leading-relaxed">
              <p className="text-xl text-white font-medium">
                Born in Moncton. Built on precision.
              </p>
              <p>
                We're not just cutting hair — we're crafting confidence. Every
                client leaves looking sharper and feeling better than when they
                walked in.
              </p>
              <p>
                Our shop is where streetwear culture meets classic barbering.
                No frills, no fuss. Just sharp cuts and good vibes.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div
          className={`transition-all duration-700 ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
          style={{
            transitionDelay: '0.4s',
            transitionTimingFunction: 'var(--ease-sharp)',
          }}
        >
          <h3 className="font-display text-h1 text-white tracking-tight mb-8">
            THE TEAM
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-sm mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`group transition-all duration-700 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-12 opacity-0'
                }`}
                style={{
                  transitionDelay: `${0.5 + index * 0.1}s`,
                  transitionTimingFunction: 'var(--ease-sharp)',
                }}
              >
                <div className="relative aspect-square rounded-sm overflow-hidden mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ transitionTimingFunction: 'var(--ease-sharp)' }}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="text-center">
                  <h4 className="font-display text-xl text-white">
                    {member.name}
                  </h4>
                  <p className="font-mono text-sm text-cherry tracking-wide mt-1">
                    {member.role}
                  </p>
                  <p className="font-body text-sm text-gray-text mt-1">
                    {member.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

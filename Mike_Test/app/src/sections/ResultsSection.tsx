import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Medal, Target, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ResultsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        statsRef.current?.children || [],
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { number: '7+', label: 'KONA QUALIFIERS', icon: Trophy },
    { number: '4+', label: 'BOSTON QUALIFIERS', icon: Medal },
    { number: '2', label: 'SUB-3 MARATHONS', icon: Target },
    { number: '10+', label: 'YEARS COACHING', icon: Star },
  ];

  const testimonials = [
    {
      quote: "Mike's approach changed everything. The mindfulness training helped me stay focused during my Kona qualifier.",
      author: 'Sarah K.',
      achievement: 'Kona Qualifier 2024',
    },
    {
      quote: "The data-driven approach combined with recovery focus took my performance to the next level.",
      author: 'James M.',
      achievement: 'Boston Marathon Finisher',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="results"
      className="section-spacing bg-[#F8F8F8]"
    >
      <div className="px-6 lg:px-16 max-w-7xl mx-auto">
        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="card-light p-6 text-center">
              <div className="w-10 h-10 rounded-lg bg-[#C41E3A]/10 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-[#C41E3A]" />
              </div>
              <div className="stat-number mb-1">{stat.number}</div>
              <div className="font-mono-label text-[10px] text-[#6B6B6B] tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div ref={contentRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image - Better centered */}
            <div className="image-card aspect-[10/9]">
              <img
                src="/images/MikeWithMarathonRunner.jpg"
                alt="Coach Mike with marathon finisher"
                className="w-full h-full object-cover object-[center_15%]"
              />
            </div>
            
            {/* Text Content */}
            <div>
              <span className="font-mono-label text-[11px] text-[#C41E3A] tracking-widest mb-4 block">
                ATHLETE SUCCESS
              </span>
              <h2 className="font-display text-section text-[#1A1A1A] mb-4">
                JOIN THE<br />
                <span className="text-[#C41E3A]">TEAM</span>
              </h2>
              <div className="accent-rule w-20 mb-6" />
              <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
                Train with a crew that keeps you consistent—group sessions, 
                race meetups, and honest support. My athletes don't just train; 
                they become part of a community.
              </p>
              
              {/* Testimonials */}
              <div className="space-y-4">
                {testimonials.map((t, i) => (
                  <div key={i} className="border-l-2 border-[#C41E3A]/30 pl-4">
                    <p className="text-[#4A4A4A] italic mb-2">"{t.quote}"</p>
                    <p className="text-sm text-[#1A1A1A]">
                      {t.author} <span className="text-[#6B6B6B]">— {t.achievement}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

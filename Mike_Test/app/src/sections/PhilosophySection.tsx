import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Heart, Zap, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.children || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pillars = [
    {
      icon: Brain,
      title: 'MINDFULNESS',
      description: 'Mental training to stay present, focused, and resilient under pressure.',
    },
    {
      icon: Zap,
      title: 'ERGONOMICS',
      description: 'Science-backed nutrition and supplementation strategies.',
    },
    {
      icon: Heart,
      title: 'RECOVERY',
      description: 'Sleep optimization, active recovery, and injury prevention.',
    },
    {
      icon: TrendingUp,
      title: 'PERFORMANCE',
      description: 'Evidence-based training protocols for peak results.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="section-spacing bg-[#F8F8F8]"
    >
      <div className="px-6 lg:px-16 max-w-7xl mx-auto">
        <div ref={contentRef}>
          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-mono-label text-[11px] text-[#C41E3A] tracking-widest mb-4 block">
              COACHING PHILOSOPHY
            </span>
            <h2 className="font-display text-section text-[#1A1A1A] mb-4">
              TRAIN SMART
            </h2>
            <div className="accent-rule w-20 mx-auto mb-6" />
            <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto leading-relaxed">
              I take a holistic approach to coaching—incorporating mindfulness and ergogenics 
              along with a strong focus on recovery, with best practices in high-performance 
              training, to elicit peak performance from my athletes.
            </p>
          </div>

          {/* Four Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {pillars.map((pillar) => (
              <div 
                key={pillar.title}
                className="card-light hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C41E3A]/10 flex items-center justify-center mb-4">
                  <pillar.icon className="w-6 h-6 text-[#C41E3A]" />
                </div>
                <h3 className="font-mono-label text-xs text-[#1A1A1A] tracking-widest mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="relative max-w-3xl mx-auto">
            <div className="card-light p-8 lg:p-12 text-center relative">
              <div className="quote-mark absolute top-0 left-6">"</div>
              <blockquote className="relative z-10">
                <p className="font-display text-3xl lg:text-5xl text-[#1A1A1A] mb-4">
                  DON'T STRAIN<br />
                  <span className="text-[#C41E3A]">BUT TRAIN</span>
                </p>
                <footer className="font-mono-label text-xs text-[#6B6B6B] tracking-widest">
                  — COACH MIKE ON
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.2 }
      );
      
      gsap.fromTo(
        imageRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.4 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center bg-[#FAFAFA]"
    >
      <div className="w-full px-6 lg:px-16 py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div ref={contentRef} className="order-2 lg:order-1">
            <span className="font-mono-label text-[11px] text-[#C41E3A] tracking-widest mb-4 block">
              TRIATHLON & RUN COACHING
            </span>
            
            <h1 className="font-display text-hero text-[#1A1A1A] leading-[0.9] mb-6">
              COACH<br />
              <span className="text-[#C41E3A]">MIKE</span> ON
            </h1>
            
            <div className="accent-rule w-20 mb-6" />
            
            <p className="text-lg lg:text-xl text-[#4A4A4A] max-w-lg leading-relaxed mb-8">
              Holistic coaching that incorporates mindfulness, ergogenics, and recovery—
              combined with best practices in high-performance training.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="feature-tag">MINDFULNESS</span>
              <span className="feature-tag">DATA-DRIVEN</span>
              <span className="feature-tag">RECOVERY FOCUSED</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => scrollToSection('programs')}
                className="btn-primary"
              >
                EXPLORE PROGRAMS
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="btn-outline"
              >
                BOOK A CALL
              </button>
            </div>
          </div>
          
          {/* Right Image - Mike's Headshot */}
          <div ref={imageRef} className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="image-card w-full max-w-md aspect-[3/4] rounded-[2rem]">
              <img
                src="/images/MikeProfessionalHeadshot.jpg"
                alt="Coach Mike On"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-[#9B9B9B]" />
      </div>
    </section>
  );
}

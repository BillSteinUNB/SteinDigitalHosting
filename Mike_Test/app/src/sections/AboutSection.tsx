import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, BookOpen, Users, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
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

  const credentials = [
    { icon: Award, text: 'MSc Kinesiology, Sport Sciences (Mindfulness)' },
    { icon: BookOpen, text: 'Chartered Professional Coach (ChPC)' },
    { icon: Users, text: 'NCCP Certified Triathlon Competition Coach' },
    { icon: MapPin, text: 'World Triathlon Level 2 Coach' },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-spacing bg-[#FAFAFA]"
    >
      <div className="px-6 lg:px-16 max-w-7xl mx-auto">
        <div ref={contentRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="image-card aspect-[4/3]">
              <img
                src="/images/MikeWithTeamNB.jpg"
                alt="Coach Mike with Team NB"
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Content */}
            <div>
              <span className="font-mono-label text-[11px] text-[#C41E3A] tracking-widest mb-4 block">
                ABOUT THE COACH
              </span>
              <h2 className="font-display text-section text-[#1A1A1A] mb-4">
                BUILD<br />
                <span className="text-[#C41E3A]">CONFIDENCE</span>
              </h2>
              <div className="accent-rule w-20 mb-6" />
              
              <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                Mike brings years of racing and coaching experience—clear guidance, 
                honest feedback, and a plan that adapts to you. Based in Fredericton, 
                New Brunswick, he works with athletes locally and worldwide.
              </p>
              
              <p className="text-[#4A4A4A] leading-relaxed mb-8">
                His holistic approach combines the science of performance with the 
                art of mindfulness, helping athletes not just reach their goals, 
                but exceed them while maintaining balance in their lives.
              </p>
              
              {/* Credentials */}
              <div className="space-y-3">
                <h4 className="font-mono-label text-xs text-[#1A1A1A] tracking-widest mb-4">
                  CREDENTIALS
                </h4>
                {credentials.map((cred, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C41E3A]/10 flex items-center justify-center flex-shrink-0">
                      <cred.icon className="w-4 h-4 text-[#C41E3A]" />
                    </div>
                    <span className="text-sm text-[#4A4A4A]">{cred.text}</span>
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

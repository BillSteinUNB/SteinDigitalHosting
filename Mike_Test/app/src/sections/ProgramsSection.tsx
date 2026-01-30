import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, User, ClipboardList, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ProgramsSection() {
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

  const programs = [
    {
      icon: User,
      title: '1-ON-1 COACHING',
      description: 'Personalized training plans tailored to your goals, schedule, and fitness level. Weekly check-ins and unlimited messaging support.',
      features: ['Custom training plans', 'Weekly video calls', 'Race strategy', 'Nutrition guidance'],
    },
    {
      icon: Users,
      title: 'GROUP PROGRAMS',
      description: 'Train alongside like-minded athletes. Weekly group sessions, shared motivation, and a supportive community.',
      features: ['Group workouts', 'Team challenges', 'Race meetups', 'Accountability partners'],
    },
    {
      icon: ClipboardList,
      title: 'CONSULTS & PLANS',
      description: 'One-time consultations or standalone training plans for self-directed athletes.',
      features: ['Training plan design', 'Form analysis', 'Race preparation', 'Season planning'],
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="programs"
      className="section-spacing bg-[#FAFAFA]"
    >
      <div className="px-6 lg:px-16 max-w-7xl mx-auto">
        <div ref={contentRef}>
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span className="font-mono-label text-[11px] text-[#C41E3A] tracking-widest mb-4 block">
                WHAT I OFFER
              </span>
              <h2 className="font-display text-section text-[#1A1A1A] mb-4">
                PERSONALIZED<br />
                <span className="text-[#C41E3A]">COACHING</span>
              </h2>
              <div className="accent-rule w-20 mb-6" />
              <p className="text-lg text-[#4A4A4A] leading-relaxed">
                Whether you're training for your first 5K or your next IRONMAN, 
                I have a program that fits your lifestyle and goals.
              </p>
            </div>
            
            {/* Image */}
            <div className="image-card aspect-video">
              <img
                src="/images/MikeWithTrainingGroup.jpg"
                alt="Coach Mike with training group"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Program Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div 
                key={program.title}
                className="card-light hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-[#C41E3A]/10 flex items-center justify-center mb-6">
                  <program.icon className="w-7 h-7 text-[#C41E3A]" />
                </div>
                
                <h3 className="font-mono-label text-sm text-[#1A1A1A] tracking-widest mb-3">
                  {program.title}
                </h3>
                
                <p className="text-[#4A4A4A] leading-relaxed mb-6">
                  {program.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="flex items-center gap-2 text-[#C41E3A] text-sm font-medium hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, Instagram, MapPin, Send, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', goal: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-spacing bg-[#F8F8F8]"
    >
      <div className="px-6 lg:px-16 max-w-7xl mx-auto">
        <div ref={contentRef}>
          {/* Header */}
          <div className="text-center mb-12">
            <span className="font-mono-label text-[11px] text-[#C41E3A] tracking-widest mb-4 block">
              GET IN TOUCH
            </span>
            <h2 className="font-display text-section text-[#1A1A1A] mb-4">
              READY WHEN<br />
              <span className="text-[#C41E3A]">YOU ARE</span>
            </h2>
            <div className="accent-rule w-20 mx-auto mb-6" />
            <p className="text-lg text-[#4A4A4A] max-w-xl mx-auto">
              Tell me your goal. I'll reply within 24 hours with a plan outline and next steps.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Image & Contact Info */}
            <div>
              <div className="image-card aspect-[4/3] mb-8">
                <img
                  src="/images/MikeWithSwimCoach.jpg"
                  alt="Coach Mike at the pool"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              <div className="space-y-3">
                <a 
                  href="mailto:mike@teamontri.com" 
                  className="flex items-center gap-4 text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors p-3 rounded-xl hover:bg-[#F5F5F5]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#C41E3A]/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#C41E3A]" />
                  </div>
                  <div>
                    <div className="font-mono-label text-[10px] text-[#6B6B6B] tracking-widest mb-0.5">EMAIL</div>
                    <div className="text-sm">mike@teamontri.com</div>
                  </div>
                </a>
                
                <a 
                  href="tel:+15550142207" 
                  className="flex items-center gap-4 text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors p-3 rounded-xl hover:bg-[#F5F5F5]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#C41E3A]/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#C41E3A]" />
                  </div>
                  <div>
                    <div className="font-mono-label text-[10px] text-[#6B6B6B] tracking-widest mb-0.5">PHONE</div>
                    <div className="text-sm">+1 (555) 014-2207</div>
                  </div>
                </a>
                
                <a 
                  href="https://instagram.com/mikeonruns" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors p-3 rounded-xl hover:bg-[#F5F5F5]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#C41E3A]/10 flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-[#C41E3A]" />
                  </div>
                  <div>
                    <div className="font-mono-label text-[10px] text-[#6B6B6B] tracking-widest mb-0.5">INSTAGRAM</div>
                    <div className="text-sm">@mikeonruns</div>
                  </div>
                </a>
                
                <div className="flex items-center gap-4 text-[#4A4A4A] p-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C41E3A]/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#C41E3A]" />
                  </div>
                  <div>
                    <div className="font-mono-label text-[10px] text-[#6B6B6B] tracking-widest mb-0.5">LOCATION</div>
                    <div className="text-sm">Fredericton, NB, Canada</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="card-light p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#C41E3A] flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display text-2xl text-[#1A1A1A] mb-2">MESSAGE SENT</h3>
                  <p className="text-[#4A4A4A]">I'll be in touch within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="font-mono-label text-[10px] text-[#6B6B6B] tracking-widest mb-2 block">
                      NAME
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label className="font-mono-label text-[10px] text-[#6B6B6B] tracking-widest mb-2 block">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label className="font-mono-label text-[10px] text-[#6B6B6B] tracking-widest mb-2 block">
                      YOUR GOAL
                    </label>
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      required
                      className="form-input appearance-none cursor-pointer"
                    >
                      <option value="">Select your goal</option>
                      <option value="5k">5K Race</option>
                      <option value="10k">10K Race</option>
                      <option value="half-marathon">Half Marathon</option>
                      <option value="marathon">Marathon</option>
                      <option value="triathlon">Triathlon</option>
                      <option value="ironman">IRONMAN</option>
                      <option value="general">General Fitness</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="font-mono-label text-[10px] text-[#6B6B6B] tracking-widest mb-2 block">
                      MESSAGE
                    </label>
                    <textarea
                      name="message"
                      placeholder="Tell me about yourself and your goals..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      required
                      className="form-input resize-none"
                    />
                  </div>
                  
                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    SEND MESSAGE
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

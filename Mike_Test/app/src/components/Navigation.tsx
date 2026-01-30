import { useEffect, useState } from 'react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-6 lg:px-12 py-4 flex items-center justify-between transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-lg shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      {/* Logo */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="font-mono-label text-sm text-[#1A1A1A] tracking-widest hover:text-[#C41E3A] transition-colors"
      >
        MIKE ON
      </button>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <button onClick={() => scrollToSection('philosophy')} className="nav-link">
          PHILOSOPHY
        </button>
        <button onClick={() => scrollToSection('programs')} className="nav-link">
          PROGRAMS
        </button>
        <button onClick={() => scrollToSection('results')} className="nav-link">
          RESULTS
        </button>
        <button onClick={() => scrollToSection('about')} className="nav-link">
          ABOUT
        </button>
      </div>

      {/* CTA Button */}
      <button 
        onClick={() => scrollToSection('contact')}
        className="px-5 py-2 bg-[#C41E3A] rounded-full font-mono-label text-[10px] tracking-widest text-white hover:bg-[#9B1B30] transition-all duration-300"
      >
        BOOK A CALL
      </button>
    </nav>
  );
}

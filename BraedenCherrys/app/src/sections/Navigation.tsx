import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { name: 'GALLERY', href: '#gallery' },
  { name: 'SERVICES', href: '#services' },
  { name: 'SHOP', href: '#shop' },
  { name: 'ABOUT', href: '#about' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass py-3'
            : 'bg-transparent py-6'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-sharp)' }}
      >
        <div className="w-full section-padding">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#"
              className="font-display text-2xl md:text-3xl tracking-wide text-white hover:text-cherry transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              CHERRY'S BARBERSHOP
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="razor-swipe font-body text-sm tracking-ultra text-white/80 hover:text-white transition-colors duration-200 py-2"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-white/80 hover:text-white transition-colors duration-200"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-cherry text-white text-xs font-mono rounded-full flex items-center justify-center animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Book Button - Desktop */}
              <a
                href="#booking"
                className="hidden md:block btn-primary text-sm tracking-wide"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Booking system coming soon! Call (506) 555-FADE to book.');
                }}
              >
                BOOK NOW
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-noir-rich transition-all duration-500 md:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-sharp)' }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="font-display text-4xl text-white hover:text-cherry transition-colors duration-200"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: isMobileMenuOpen ? 'slide-up 0.5s ease forwards' : 'none',
              }}
            >
              {link.name}
            </button>
          ))}
          <a
            href="#booking"
            className="btn-primary mt-8 text-lg"
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              alert('Booking system coming soon! Call (506) 555-FADE to book.');
            }}
          >
            BOOK NOW
          </a>
        </div>
      </div>
    </>
  );
}

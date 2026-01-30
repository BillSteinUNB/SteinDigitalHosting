import { Instagram, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#FAFAFA] border-t border-[#E5E5E5] py-12 lg:py-16">
      <div className="px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="font-mono-label text-lg text-[#1A1A1A] tracking-widest mb-3">
              MIKE ON
            </div>
            <p className="text-sm text-[#4A4A4A] max-w-sm leading-relaxed mb-4">
              Holistic triathlon & run coaching for busy athletes. Based in Fredericton, 
              serving athletes worldwide.
            </p>
            <p className="font-display text-xl text-[#C41E3A]">
              DON'T STRAIN BUT TRAIN
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-mono-label text-[10px] text-[#6B6B6B] tracking-widest mb-4">
              QUICK LINKS
            </div>
            <ul className="space-y-2">
              {[
                { label: 'Philosophy', id: 'philosophy' },
                { label: 'Programs', id: 'programs' },
                { label: 'Results', id: 'results' },
                { label: 'About', id: 'about' },
                { label: 'Contact', id: 'contact' },
              ].map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-sm text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <div className="font-mono-label text-[10px] text-[#6B6B6B] tracking-widest mb-4">
              CONNECT
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/mikeonruns"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-[#4A4A4A] hover:text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:mike@teamontri.com"
                className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-[#4A4A4A] hover:text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:+15550142207"
                className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-[#4A4A4A] hover:text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-all"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#E5E5E5] flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <p className="text-xs text-[#6B6B6B]">
            © 2025 Mike On Coaching. All rights reserved.
          </p>
          <p className="font-mono-label text-[10px] text-[#6B6B6B] tracking-widest">
            FREDERICTON, NEW BRUNSWICK, CANADA
          </p>
        </div>
      </div>
    </footer>
  );
}

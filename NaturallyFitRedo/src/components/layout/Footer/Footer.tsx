import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Facebook, Instagram } from "lucide-react";
import { contactInfo } from "@/lib/navigation";

// ============================================
// FOOTER COMPONENT
// ============================================

/**
 * Footer Component
 *
 * Full-width footer with:
 * - Navigation columns (Shop, Company, Support, Account)
 * - Contact information
 * - Social media links
 * - Newsletter signup (optional future addition)
 * - Copyright and legal links
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2b2b2b] text-[#d0d0d0]">
      {/* Top Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-8 items-start">
          {/* Logo + Tagline */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="https://nftest.dreamhosters.com/wp-content/uploads/2026/02/canadassupplementstore_footer.png"
                alt="Naturally Fit - Canada's Supplement Store"
                width={260}
                height={90}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          <FooterColumn
            title="Customer Service"
            links={[
              { label: "Help Center", href: "/help-center" },
              { label: "My Account", href: "/account" },
              { label: "Price Match", href: "/price-match" },
              { label: "Gift Cards", href: "/gift-cards" },
            ]}
          />

          <FooterColumn
            title="About Us"
            links={[{ label: "24 Hour Gym", href: "/gym" }]}
          />

          <FooterColumn
            title="Quick Links"
            links={[
              { label: "Search", href: "/search" },
              { label: "Sale Items", href: "/shop?on_sale=true" },
              { label: "Contact Us", href: "/contact" },
            ]}
          />

          {/* Veteran Badge */}
          <div className="flex lg:justify-end">
            <Image
              src="https://nftest.dreamhosters.com/wp-content/uploads/2026/02/veteran-owned-badge.png"
              alt="Veteran Owned Business"
              width={90}
              height={90}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Mid Bar */}
      <div className="border-t border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-sm font-semibold text-white">Need Help?</span>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-sm text-[#bdbdbd] hover:text-white transition-colors"
              >
                {contactInfo.email}
              </a>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-semibold text-white">Follow Us</span>
              <div className="flex items-center gap-3">
                <SocialLink
                  href={contactInfo.social.facebook}
                  icon={<Facebook size={20} strokeWidth={1.5} />}
                  label="Facebook"
                />
                <SocialLink
                  href={contactInfo.social.instagram}
                  icon={<Instagram size={20} strokeWidth={1.5} />}
                  label="Instagram"
                />
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="text-sm font-semibold text-white">We Accept</span>
              <Image
                src="https://nftest.dreamhosters.com/wp-content/uploads/2026/02/footer1_2026.png"
                alt="Accepted payment methods"
                width={180}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-4">
          <p className="text-xs text-[#9a9a9a] text-center">
            Copyright © {currentYear} Naturally Fit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// FOOTER NAV COLUMN
// ============================================

interface FooterColumnProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-3">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[#bdbdbd] hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// SOCIAL LINK
// ============================================

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "flex items-center justify-center",
        "w-10 h-10 min-w-[44px] min-h-[44px]",
        "bg-[#3a3a3a] text-[#bdbdbd]",
        "hover:bg-[#4a4a4a] hover:text-white",
        "transition-colors"
      )}
    >
      {icon}
    </a>
  );
}

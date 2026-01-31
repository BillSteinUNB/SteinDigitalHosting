import Link from "next/link";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";
import { footerNavigation, contactInfo } from "@/lib/navigation";

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
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo placeholder - will be replaced with actual logo */}
            <Link href="/" className="inline-block mb-4">
              <span className="font-heading text-2xl uppercase tracking-wide text-white">
                Naturally Fit
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Canada&apos;s premier supplement retailer since 1999. Veteran-owned with
              a price-match guarantee.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
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
              <SocialLink
                href={contactInfo.social.twitter}
                icon={<Twitter size={20} strokeWidth={1.5} />}
                label="Twitter"
              />
            </div>
          </div>

          {/* Shop Column */}
          <FooterNavColumn
            title={footerNavigation.shop.title}
            links={footerNavigation.shop.links}
          />

          {/* Company Column */}
          <FooterNavColumn
            title={footerNavigation.company.title}
            links={footerNavigation.company.links}
          />

          {/* Support Column */}
          <FooterNavColumn
            title={footerNavigation.support.title}
            links={footerNavigation.support.links}
          />

          {/* Contact Column */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-wide mb-4 text-white">
              Contact Us
            </h3>
            <ul className="space-y-3">
              {/* Phone */}
              <li>
                <a
                  href={`tel:${contactInfo.phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-start gap-2 text-sm text-gray-400 hover:text-red-primary transition-colors"
                >
                  <Phone size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                  <span>{contactInfo.phone}</span>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-start gap-2 text-sm text-gray-400 hover:text-red-primary transition-colors break-all"
                >
                  <Mail size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                  <span>{contactInfo.email}</span>
                </a>
              </li>

              {/* Address */}
              <li>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                  <address className="not-italic">
                    {contactInfo.address.street}
                    <br />
                    {contactInfo.address.city}, {contactInfo.address.province}
                    <br />
                    {contactInfo.address.postalCode}
                  </address>
                </div>
              </li>

              {/* Hours */}
              <li className="pt-2">
                <p className="text-xs text-gray-500">{contactInfo.hours.weekdays}</p>
                <p className="text-xs text-gray-500">{contactInfo.hours.saturday}</p>
                <p className="text-xs text-gray-500">{contactInfo.hours.sunday}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-gray-500 text-center sm:text-left">
              &copy; {currentYear} Naturally Fit. All rights reserved.
            </p>

            {/* Legal Links */}
            <nav aria-label="Legal links">
              <ul className="flex flex-wrap items-center justify-center gap-4 text-xs">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/accessibility"
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    Accessibility
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Payment Methods Placeholder */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">We accept:</span>
              {/* Payment icons will be added as images */}
              <div className="flex gap-1">
                <PaymentIcon label="Visa" />
                <PaymentIcon label="MC" />
                <PaymentIcon label="Amex" />
                <PaymentIcon label="PayPal" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// FOOTER NAV COLUMN
// ============================================

interface FooterNavColumnProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterNavColumn({ title, links }: FooterNavColumnProps) {
  return (
    <div>
      <h3 className="font-heading text-sm uppercase tracking-wide mb-4 text-white">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-gray-400 hover:text-red-primary transition-colors"
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
        "bg-gray-800 text-gray-400",
        "hover:bg-red-primary hover:text-white",
        "transition-colors"
      )}
    >
      {icon}
    </a>
  );
}

// ============================================
// PAYMENT ICON PLACEHOLDER
// ============================================

interface PaymentIconProps {
  label: string;
}

function PaymentIcon({ label }: PaymentIconProps) {
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-5 bg-gray-800 text-[10px] text-gray-400"
      aria-label={label}
    >
      {label}
    </span>
  );
}

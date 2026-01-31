import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: "Privacy Policy | Naturally Fit",
  description:
    "Learn how Naturally Fit collects, uses, and protects your personal information when you shop with us.",
};

// ============================================
// SECTION HEADING COMPONENT
// ============================================

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-heading font-bold uppercase text-black text-xl md:text-2xl",
        "flex items-center gap-3 mb-4",
        className
      )}
    >
      {children}
      <span className="w-2.5 h-2.5 bg-red-primary flex-shrink-0" aria-hidden="true" />
    </h2>
  );
}

// ============================================
// PRIVACY POLICY PAGE
// ============================================

export default function PrivacyPolicyPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-light">
              Last updated: January 1, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-gray-dark leading-relaxed mb-4">
                Naturally Fit (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
                committed to protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your personal information when you
                visit our website at naturallyfit.ca, make a purchase, or interact with us
                in any way.
              </p>
              <p className="text-gray-dark leading-relaxed">
                By using our website or services, you consent to the data practices
                described in this policy. If you do not agree with these practices, please
                do not use our website.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <SectionHeading>Information We Collect</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                We collect information you provide directly to us, as well as information
                collected automatically when you use our services.
              </p>

              <h3 className="font-heading font-bold uppercase text-lg mt-6 mb-3">
                Information You Provide
              </h3>
              <ul className="list-disc list-inside text-gray-dark space-y-2 mb-4">
                <li>
                  <strong>Account Information:</strong> Name, email address, password, phone
                  number, and billing/shipping addresses when you create an account
                </li>
                <li>
                  <strong>Order Information:</strong> Payment details, purchase history, and
                  delivery preferences when you make a purchase
                </li>
                <li>
                  <strong>Communication Data:</strong> Information you provide when you
                  contact us, leave reviews, or subscribe to our newsletter
                </li>
                <li>
                  <strong>Wholesale Applications:</strong> Business information, tax
                  identification numbers, and references when applying for wholesale
                  accounts
                </li>
              </ul>

              <h3 className="font-heading font-bold uppercase text-lg mt-6 mb-3">
                Information Collected Automatically
              </h3>
              <ul className="list-disc list-inside text-gray-dark space-y-2">
                <li>
                  <strong>Device Information:</strong> IP address, browser type, operating
                  system, and device identifiers
                </li>
                <li>
                  <strong>Usage Data:</strong> Pages visited, time spent on pages, links
                  clicked, and referring websites
                </li>
                <li>
                  <strong>Cookies:</strong> Small data files stored on your device to
                  enhance your browsing experience
                </li>
                <li>
                  <strong>Location Data:</strong> General geographic location based on IP
                  address
                </li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12">
              <SectionHeading>How We Use Your Information</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-dark space-y-2">
                <li>Process and fulfill your orders, including shipping and payment</li>
                <li>Create and manage your account</li>
                <li>
                  Communicate with you about orders, products, services, and promotions
                </li>
                <li>Provide customer support and respond to your inquiries</li>
                <li>Personalize your shopping experience and recommend products</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website, products, and services</li>
                <li>Detect and prevent fraud and unauthorized activities</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <SectionHeading>Information Sharing</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                We do not sell your personal information. We may share your information
                with:
              </p>
              <ul className="list-disc list-inside text-gray-dark space-y-2">
                <li>
                  <strong>Service Providers:</strong> Third parties that help us operate our
                  business (payment processors, shipping carriers, email providers, etc.)
                </li>
                <li>
                  <strong>Business Partners:</strong> Partners who offer products or
                  services jointly with us
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law, court order, or
                  government request
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a merger,
                  acquisition, or sale of assets
                </li>
                <li>
                  <strong>With Your Consent:</strong> When you have given us permission to
                  share your information
                </li>
              </ul>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <SectionHeading>Cookies & Tracking Technologies</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-dark space-y-2 mb-4">
                <li>Keep you logged in to your account</li>
                <li>Remember your shopping cart</li>
                <li>Understand how you use our website</li>
                <li>Personalize your experience</li>
                <li>Deliver relevant advertisements</li>
              </ul>
              <p className="text-gray-dark leading-relaxed">
                You can control cookies through your browser settings. Note that disabling
                cookies may affect the functionality of our website.
              </p>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <SectionHeading>Data Security</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                We implement industry-standard security measures to protect your personal
                information:
              </p>
              <ul className="list-disc list-inside text-gray-dark space-y-2 mb-4">
                <li>SSL/TLS encryption for all data transmission</li>
                <li>PCI-DSS compliance for payment processing</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and employee training</li>
                <li>Secure data storage with leading cloud providers</li>
              </ul>
              <p className="text-gray-dark leading-relaxed">
                While we strive to protect your information, no method of transmission over
                the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <SectionHeading>Your Privacy Rights</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-dark space-y-2 mb-4">
                <li>
                  <strong>Access:</strong> Request a copy of the personal information we
                  hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate or
                  incomplete information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal information
                </li>
                <li>
                  <strong>Opt-Out:</strong> Unsubscribe from marketing communications at any
                  time
                </li>
                <li>
                  <strong>Portability:</strong> Request your data in a portable format
                </li>
              </ul>
              <p className="text-gray-dark leading-relaxed">
                To exercise these rights, please contact us at{" "}
                <a
                  href="mailto:privacy@naturallyfit.ca"
                  className="text-red-primary hover:underline"
                >
                  privacy@naturallyfit.ca
                </a>
                .
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <SectionHeading>Data Retention</SectionHeading>
              <p className="text-gray-dark leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the
                purposes outlined in this policy, unless a longer retention period is
                required by law. When you close your account, we will delete or anonymize
                your information within 90 days, except where we need to retain it for
                legal, tax, or audit purposes.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <SectionHeading>Children&apos;s Privacy</SectionHeading>
              <p className="text-gray-dark leading-relaxed">
                Our website is not intended for children under 16 years of age. We do not
                knowingly collect personal information from children. If you believe we
                have collected information from a child, please contact us immediately.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <SectionHeading>Changes to This Policy</SectionHeading>
              <p className="text-gray-dark leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of
                any material changes by posting the new policy on this page and updating
                the &quot;Last updated&quot; date. We encourage you to review this policy
                periodically.
              </p>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <SectionHeading>Contact Us</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices,
                please contact us:
              </p>
              <div className="bg-gray-light p-6">
                <p className="text-gray-dark mb-2">
                  <strong>Naturally Fit</strong>
                </p>
                <p className="text-gray-dark mb-2">Privacy Officer</p>
                <p className="text-gray-dark mb-2">
                  Email:{" "}
                  <a
                    href="mailto:privacy@naturallyfit.ca"
                    className="text-red-primary hover:underline"
                  >
                    privacy@naturallyfit.ca
                  </a>
                </p>
                <p className="text-gray-dark">Phone: 1-800-555-1234</p>
              </div>
            </div>

            {/* Related Links */}
            <div className="border-t border-gray-border pt-8">
              <p className="text-small text-gray-medium mb-4">Related Policies:</p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/terms"
                  className="text-red-primary hover:underline text-small"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/shipping"
                  className="text-red-primary hover:underline text-small"
                >
                  Shipping & Returns Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

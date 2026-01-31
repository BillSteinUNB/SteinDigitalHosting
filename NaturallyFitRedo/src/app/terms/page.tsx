import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: "Terms of Service | Naturally Fit",
  description:
    "Read the terms and conditions that govern your use of the Naturally Fit website and services.",
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
// TERMS OF SERVICE PAGE
// ============================================

export default function TermsOfServicePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-4">
              Terms of Service
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
                Welcome to Naturally Fit. These Terms of Service (&quot;Terms&quot;) govern
                your access to and use of our website at naturallyfit.ca, our mobile
                applications, and all related services (collectively, the
                &quot;Services&quot;).
              </p>
              <p className="text-gray-dark leading-relaxed mb-4">
                By accessing or using our Services, you agree to be bound by these Terms.
                If you do not agree to these Terms, please do not use our Services.
              </p>
              <p className="text-gray-dark leading-relaxed">
                &quot;Naturally Fit&quot;, &quot;we&quot;, &quot;us&quot;, and
                &quot;our&quot; refer to Naturally Fit Ltd., a corporation registered in
                Alberta, Canada.
              </p>
            </div>

            {/* Account Terms */}
            <div className="mb-12">
              <SectionHeading>1. Account Registration</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                To access certain features of our Services, you may need to create an
                account. When creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-dark space-y-2 mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Keep your password secure and confidential</li>
                <li>Be responsible for all activities under your account</li>
                <li>
                  Notify us immediately of any unauthorized access or security breach
                </li>
              </ul>
              <p className="text-gray-dark leading-relaxed">
                You must be at least 16 years old to create an account. We reserve the
                right to suspend or terminate accounts that violate these Terms or are
                inactive for extended periods.
              </p>
            </div>

            {/* Products and Pricing */}
            <div className="mb-12">
              <SectionHeading>2. Products & Pricing</SectionHeading>

              <h3 className="font-heading font-bold uppercase text-lg mt-6 mb-3">
                Product Information
              </h3>
              <p className="text-gray-dark leading-relaxed mb-4">
                We strive to display accurate product descriptions, images, and pricing.
                However, we do not warrant that product descriptions, images, or other
                content is accurate, complete, or error-free. Colors may vary due to
                monitor settings.
              </p>

              <h3 className="font-heading font-bold uppercase text-lg mt-6 mb-3">
                Pricing
              </h3>
              <p className="text-gray-dark leading-relaxed mb-4">
                All prices are displayed in Canadian Dollars (CAD) and do not include
                applicable taxes or shipping costs, which will be calculated at checkout.
                We reserve the right to change prices at any time without notice.
              </p>
              <p className="text-gray-dark leading-relaxed mb-4">
                In the event of a pricing error, we reserve the right to cancel any orders
                placed at the incorrect price. We will notify you and offer the option to
                reorder at the correct price.
              </p>

              <h3 className="font-heading font-bold uppercase text-lg mt-6 mb-3">
                Availability
              </h3>
              <p className="text-gray-dark leading-relaxed">
                Products are subject to availability. We reserve the right to limit
                quantities, discontinue products, or modify products without notice. If a
                product you ordered is unavailable, we will contact you to offer
                alternatives or a refund.
              </p>
            </div>

            {/* Orders */}
            <div className="mb-12">
              <SectionHeading>3. Orders & Payment</SectionHeading>

              <h3 className="font-heading font-bold uppercase text-lg mt-6 mb-3">
                Order Acceptance
              </h3>
              <p className="text-gray-dark leading-relaxed mb-4">
                Your order is an offer to purchase products. We reserve the right to accept
                or reject any order at our sole discretion. An order is not accepted until
                we send you an order confirmation email.
              </p>

              <h3 className="font-heading font-bold uppercase text-lg mt-6 mb-3">
                Payment
              </h3>
              <p className="text-gray-dark leading-relaxed mb-4">
                We accept major credit cards, PayPal, Apple Pay, Google Pay, and other
                payment methods as displayed at checkout. By providing payment information,
                you represent that you are authorized to use the payment method.
              </p>
              <p className="text-gray-dark leading-relaxed mb-4">
                Payment is processed at the time of order. If your payment cannot be
                processed, we will attempt to contact you. Orders may be cancelled if
                payment issues are not resolved within 48 hours.
              </p>

              <h3 className="font-heading font-bold uppercase text-lg mt-6 mb-3">
                Order Cancellation
              </h3>
              <p className="text-gray-dark leading-relaxed">
                You may request to cancel an order within 1 hour of placement by contacting
                us. Once an order has been shipped, it cannot be cancelled and must be
                returned according to our Return Policy.
              </p>
            </div>

            {/* Shipping */}
            <div className="mb-12">
              <SectionHeading>4. Shipping & Delivery</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                We currently ship within Canada only. Shipping times and costs vary based
                on your location and selected shipping method. Estimated delivery times are
                not guaranteed.
              </p>
              <p className="text-gray-dark leading-relaxed mb-4">
                Risk of loss and title for purchased items pass to you upon delivery to the
                carrier. We are not responsible for delays caused by carriers, customs, or
                circumstances beyond our control.
              </p>
              <p className="text-gray-dark leading-relaxed">
                For complete shipping information, please see our{" "}
                <Link href="/shipping" className="text-red-primary hover:underline">
                  Shipping & Returns Policy
                </Link>
                .
              </p>
            </div>

            {/* Returns */}
            <div className="mb-12">
              <SectionHeading>5. Returns & Refunds</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                We offer a 30-day return policy on unopened products in their original
                packaging. Opened or used products are not eligible for return unless
                defective.
              </p>
              <p className="text-gray-dark leading-relaxed mb-4">
                Refunds are processed within 5-7 business days of receiving returned items.
                Original shipping costs are non-refundable unless the return is due to our
                error.
              </p>
              <p className="text-gray-dark leading-relaxed">
                For complete return information, please see our{" "}
                <Link href="/shipping" className="text-red-primary hover:underline">
                  Shipping & Returns Policy
                </Link>
                .
              </p>
            </div>

            {/* Price Match */}
            <div className="mb-12">
              <SectionHeading>6. Price Match Guarantee</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                We match prices from authorized Canadian retailers on identical products
                (same brand, size, and flavor) that are in stock. To request a price match:
              </p>
              <ul className="list-disc list-inside text-gray-dark space-y-2 mb-4">
                <li>Contact us with a link to the competitor&apos;s current listing</li>
                <li>The product must be in stock at the competitor</li>
                <li>Request must be made before or within 7 days of purchase</li>
              </ul>
              <p className="text-gray-dark leading-relaxed">
                Exclusions: Clearance items, limited-time flash sales, auction sites,
                marketplace sellers, and prices requiring membership or coupon codes are
                excluded.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <SectionHeading>7. Intellectual Property</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                All content on our Services, including text, graphics, logos, images,
                product descriptions, and software, is the property of Naturally Fit or our
                content suppliers and is protected by Canadian and international copyright,
                trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-dark leading-relaxed">
                You may not reproduce, distribute, modify, display, or create derivative
                works from any content without our prior written permission.
              </p>
            </div>

            {/* User Conduct */}
            <div className="mb-12">
              <SectionHeading>8. User Conduct</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-dark space-y-2">
                <li>Use our Services for any unlawful purpose</li>
                <li>
                  Interfere with or disrupt the Services or servers connected to them
                </li>
                <li>Attempt to gain unauthorized access to any part of our Services</li>
                <li>Use automated tools to scrape or collect data from our Services</li>
                <li>
                  Post false, misleading, or fraudulent content (including reviews)
                </li>
                <li>
                  Impersonate any person or entity, or misrepresent your affiliation
                </li>
                <li>Engage in any conduct that restricts others from using our Services</li>
                <li>Use our Services to distribute spam, malware, or harmful content</li>
              </ul>
            </div>

            {/* User Content */}
            <div className="mb-12">
              <SectionHeading>9. User Content</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                You may submit reviews, comments, and other content (&quot;User
                Content&quot;) to our Services. By submitting User Content, you:
              </p>
              <ul className="list-disc list-inside text-gray-dark space-y-2 mb-4">
                <li>
                  Grant us a non-exclusive, royalty-free, perpetual, worldwide license to
                  use, reproduce, modify, and display your User Content
                </li>
                <li>
                  Represent that you own or have the right to submit the User Content
                </li>
                <li>
                  Agree that your User Content will not violate any third-party rights
                </li>
              </ul>
              <p className="text-gray-dark leading-relaxed">
                We reserve the right to remove any User Content that violates these Terms
                or that we deem inappropriate, without notice.
              </p>
            </div>

            {/* Disclaimers */}
            <div className="mb-12">
              <SectionHeading>10. Disclaimers</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4 font-semibold">
                PRODUCTS SOLD ON OUR SERVICES ARE NOT INTENDED TO DIAGNOSE, TREAT, CURE, OR
                PREVENT ANY DISEASE. CONSULT A HEALTHCARE PROFESSIONAL BEFORE USING ANY
                SUPPLEMENT.
              </p>
              <p className="text-gray-dark leading-relaxed mb-4">
                Our Services are provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
                without warranties of any kind, either express or implied. We do not
                warrant that our Services will be uninterrupted, error-free, or free of
                viruses or other harmful components.
              </p>
              <p className="text-gray-dark leading-relaxed">
                To the maximum extent permitted by law, we disclaim all warranties,
                including implied warranties of merchantability, fitness for a particular
                purpose, and non-infringement.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <SectionHeading>11. Limitation of Liability</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                To the maximum extent permitted by law, Naturally Fit shall not be liable
                for any indirect, incidental, special, consequential, or punitive damages,
                or any loss of profits, revenue, data, or goodwill, arising from your use
                of our Services.
              </p>
              <p className="text-gray-dark leading-relaxed">
                Our total liability for any claims arising from your use of our Services
                shall not exceed the amount you paid to us in the 12 months preceding the
                claim.
              </p>
            </div>

            {/* Indemnification */}
            <div className="mb-12">
              <SectionHeading>12. Indemnification</SectionHeading>
              <p className="text-gray-dark leading-relaxed">
                You agree to indemnify, defend, and hold harmless Naturally Fit and its
                officers, directors, employees, and agents from any claims, damages, losses,
                liabilities, costs, and expenses (including legal fees) arising from your
                use of our Services, your violation of these Terms, or your violation of
                any rights of third parties.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <SectionHeading>13. Governing Law</SectionHeading>
              <p className="text-gray-dark leading-relaxed">
                These Terms are governed by the laws of the Province of Alberta and the
                federal laws of Canada applicable therein, without regard to conflict of
                law principles. Any disputes arising from these Terms or your use of our
                Services shall be resolved exclusively in the courts of Alberta, Canada.
              </p>
            </div>

            {/* Changes */}
            <div className="mb-12">
              <SectionHeading>14. Changes to These Terms</SectionHeading>
              <p className="text-gray-dark leading-relaxed">
                We may update these Terms from time to time. We will notify you of material
                changes by posting the new Terms on this page and updating the &quot;Last
                updated&quot; date. Your continued use of our Services after changes are
                posted constitutes acceptance of the revised Terms.
              </p>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <SectionHeading>15. Contact Us</SectionHeading>
              <p className="text-gray-dark leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-light p-6">
                <p className="text-gray-dark mb-2">
                  <strong>Naturally Fit Ltd.</strong>
                </p>
                <p className="text-gray-dark mb-2">
                  Email:{" "}
                  <a
                    href="mailto:legal@naturallyfit.ca"
                    className="text-red-primary hover:underline"
                  >
                    legal@naturallyfit.ca
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
                  href="/privacy"
                  className="text-red-primary hover:underline text-small"
                >
                  Privacy Policy
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

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { replaceWordPressBase } from "@/lib/config/wordpress";

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: "Purchase Discounts | Naturally Fit",
  description:
    "Learn about our discount programs for students, military, first responders, and more.",
};

// ============================================
// WORDPRESS IMAGE REFERENCES
// ============================================

const WP_IMAGES = {
  // Purchase Discounts page images from WordPress
  discountsHero: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2020/05/discounts.png"),
};

// ============================================
// PURCHASE DISCOUNTS PAGE
// ============================================

export default function DiscountsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-black py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-red-primary font-heading uppercase tracking-wider mb-4">
              Save More
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase text-white mb-6">
              Purchase Discounts
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              We offer special discounts for those who serve and students working toward their goals.
            </p>
          </div>
        </div>
      </section>

      {/* Discounts Image */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video mb-12">
              <Image
                src={WP_IMAGES.discountsHero}
                alt="Discount Programs"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Discount Categories */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-center mb-12">
            Who Qualifies?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-red-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎖️</span>
              </div>
              <h3 className="text-lg font-heading font-bold uppercase mb-2">Military</h3>
              <p className="text-gray-600 text-sm">
                Active duty and veterans receive special pricing on all products.
              </p>
            </div>
            <div className="bg-white p-6 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-red-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚒</span>
              </div>
              <h3 className="text-lg font-heading font-bold uppercase mb-2">First Responders</h3>
              <p className="text-gray-600 text-sm">
                Police, fire, and EMS personnel qualify for our hero discount.
              </p>
            </div>
            <div className="bg-white p-6 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-red-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-lg font-heading font-bold uppercase mb-2">Students</h3>
              <p className="text-gray-600 text-sm">
                Valid student ID holders save on supplements to fuel their studies and workouts.
              </p>
            </div>
            <div className="bg-white p-6 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-red-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏥</span>
              </div>
              <h3 className="text-lg font-heading font-bold uppercase mb-2">Healthcare Workers</h3>
              <p className="text-gray-600 text-sm">
                Nurses, doctors, and healthcare staff receive exclusive savings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Redeem */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase mb-6">
              How to Redeem
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              To receive your discount, simply show valid ID at checkout in-store or contact
              our customer service team for online orders. Discounts cannot be combined with
              other promotions.
            </p>
            <div className="bg-gray-50 border border-gray-200 p-6">
              <p className="text-gray-600">
                <strong>In Store:</strong> Present valid ID at checkout<br />
                <strong>Online:</strong> Contact customer service before placing your order
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-4">
            Questions About Discounts?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us if you have questions about eligibility or how to redeem your discount.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 font-heading font-bold uppercase tracking-wide bg-white text-black hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}

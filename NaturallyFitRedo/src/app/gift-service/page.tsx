import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { replaceWordPressBase } from "@/lib/config/wordpress";

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: "Gift Service | Naturally Fit",
  description:
    "Give the gift of fitness. Our gift service makes it easy to share supplements with friends and family.",
};

// ============================================
// WORDPRESS IMAGE REFERENCES
// ============================================

const WP_IMAGES = {
  // Gift Service page images from WordPress
  gift1: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2020/12/gift1.png"),
  gift2: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2020/12/gift2.png"),
  // Gift card designs
  giftCard: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2021/10/gift-card2.png"),
  happyHolidays: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2021/11/happy-holidays.jpeg"),
  merryChristmas: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2021/11/merrychristmas.jpg"),
  merryLiftmas: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2021/11/merry-liftmas.jpg"),
};

// ============================================
// GIFT SERVICE PAGE
// ============================================

export default function GiftServicePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-black py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-red-primary font-heading uppercase tracking-wider mb-4">
              Give the Gift of Fitness
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase text-white mb-6">
              Gift Service
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Share your passion for fitness with friends and family. Our gift service
              makes it easy to give the perfect present.
            </p>
          </div>
        </div>
      </section>

      {/* Gift Images Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-square">
              <Image
                src={WP_IMAGES.gift1}
                alt="Gift Service"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase mb-6">
                Perfect for Any Occasion
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Whether it&apos;s a birthday, holiday, or just because - a gift from Naturally Fit
                shows you care about their health and fitness goals.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We offer gift wrapping and personalized messages to make your gift extra special.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Second Gift Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase mb-6">
                Easy Gifting Options
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Not sure what to get? Our gift cards let them choose exactly what they need.
                Available in various amounts to fit any budget.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-4 font-heading font-bold uppercase tracking-wide bg-red-primary text-white hover:bg-red-hover transition-colors"
              >
                Shop Gift Cards
              </Link>
            </div>
            <div className="relative aspect-square order-1 md:order-2">
              <Image
                src={WP_IMAGES.gift2}
                alt="Gift Options"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gift Card Designs */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-center mb-12">
            Gift Card Designs
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden">
              <Image
                src={WP_IMAGES.giftCard}
                alt="Gift Card"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden">
              <Image
                src={WP_IMAGES.happyHolidays}
                alt="Happy Holidays Gift Card"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden">
              <Image
                src={WP_IMAGES.merryChristmas}
                alt="Merry Christmas Gift Card"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden">
              <Image
                src={WP_IMAGES.merryLiftmas}
                alt="Merry Liftmas Gift Card"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-4">
            Questions About Gifting?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us for custom gift orders or bulk purchases. We&apos;re happy to help
            make your gift extra special.
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

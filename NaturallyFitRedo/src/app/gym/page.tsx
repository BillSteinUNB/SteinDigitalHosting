import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: "24 Hour Gym | Naturally Fit",
  description:
    "Access our 24-hour gym facility. Train on your schedule with premium equipment and a supportive community.",
};

// ============================================
// WORDPRESS IMAGE REFERENCES
// ============================================

const WP_IMAGES = {
  // 24 Hour Gym page images from WordPress
  heroImage: "https://naturallyfit.ca/wp-content/uploads/2026/01/24-HR-ACCESS-7.png",
  communityImage: "https://naturallyfit.ca/wp-content/uploads/2025/01/serving-the-community.png",
  gymPhoto: "https://naturallyfit.ca/wp-content/uploads/2025/10/Untitled-design-2025-10-29T125128.244.png",
  backToBasics: "https://naturallyfit.ca/wp-content/uploads/2022/02/back2basics.jpg",
  hwhLogo: "https://naturallyfit.ca/wp-content/uploads/2022/02/hwh-logo.png",
};

// ============================================
// 24 HOUR GYM PAGE
// ============================================

export default function GymPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-black py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={WP_IMAGES.heroImage}
            alt="24 Hour Gym Access"
            fill
            className="object-cover opacity-60"
            sizes="100vw"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase text-white mb-6">
              24 Hour Gym Access
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              Train on your schedule. Our facility is open 24/7 for members.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 font-heading font-bold uppercase tracking-wide bg-red-primary text-white hover:bg-red-hover transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Gym Photo Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video">
              <Image
                src={WP_IMAGES.gymPhoto}
                alt="Gym Facility"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase mb-6">
                Premium Equipment
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our gym features top-of-the-line equipment for all your training needs.
                From free weights to cardio machines, we have everything you need to reach your goals.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Members enjoy 24/7 access with key card entry, ensuring you can train
                whenever fits your schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase mb-6">
                Serving the Community
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We're proud to be part of our local community. Our gym is more than just
                a place to work out - it's a place to connect with like-minded individuals.
              </p>
            </div>
            <div className="relative aspect-video order-1 md:order-2">
              <Image
                src={WP_IMAGES.communityImage}
                alt="Serving the Community"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Back to Basics Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video">
              <Image
                src={WP_IMAGES.backToBasics}
                alt="Back to Basics Training"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase mb-6">
                Back to Basics
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Sometimes the best results come from focusing on the fundamentals.
                Our facility supports all training styles and fitness levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logo */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 mb-4 uppercase tracking-wide text-sm">In Partnership With</p>
          <div className="relative w-48 h-24 mx-auto">
            <Image
              src={WP_IMAGES.hwhLogo}
              alt="Partner Logo"
              fill
              className="object-contain"
              sizes="192px"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-4">
            Ready to Join?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about membership options and start your fitness journey.
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

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: "Athletes | Naturally Fit",
  description:
    "Meet the athletes who trust Naturally Fit for their supplement needs. Join our team of sponsored athletes.",
};

// ============================================
// WORDPRESS IMAGE REFERENCES
// ============================================

const WP_IMAGES = {
  // Athletes page images from WordPress
  athlete1: "https://naturallyfit.ca/wp-content/uploads/2018/09/IMG_0741.jpg",
  athlete2: "https://naturallyfit.ca/wp-content/uploads/2018/09/IMG_1293.jpg",
};

// ============================================
// ATHLETES PAGE
// ============================================

export default function AthletesPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-black py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-red-primary font-heading uppercase tracking-wider mb-4">
              Team Naturally Fit
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase text-white mb-6">
              Our Athletes
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Meet the dedicated athletes who represent Naturally Fit. These competitors
              trust us for their supplement needs and we&apos;re proud to support their journeys.
            </p>
          </div>
        </div>
      </section>

      {/* Athletes Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Athlete 1 */}
            <div className="bg-white border border-gray-200 overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={WP_IMAGES.athlete1}
                  alt="Sponsored Athlete"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold uppercase mb-2">
                  Sponsored Athlete
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Dedicated competitor and proud member of Team Naturally Fit.
                </p>
              </div>
            </div>

            {/* Athlete 2 */}
            <div className="bg-white border border-gray-200 overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={WP_IMAGES.athlete2}
                  alt="Sponsored Athlete"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold uppercase mb-2">
                  Sponsored Athlete
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Dedicated competitor and proud member of Team Naturally Fit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Team Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase mb-6">
            Want to Join the Team?
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            We&apos;re always looking for dedicated athletes to represent Naturally Fit.
            If you&apos;re a competitive athlete interested in sponsorship opportunities,
            we&apos;d love to hear from you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 font-heading font-bold uppercase tracking-wide bg-red-primary text-white hover:bg-red-hover transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </main>
  );
}

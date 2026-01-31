import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Users, Clock, Heart, Shield, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: "About Us | Naturally Fit",
  description:
    "Canada's premier supplement retailer since 1999. Veteran-owned and committed to helping Canadians achieve their fitness goals with quality products and expert advice.",
};

// ============================================
// SECTION HEADING COMPONENT
// ============================================

function SectionHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-heading font-bold uppercase text-black",
        "flex items-center gap-3",
        className
      )}
    >
      {children}
      <span className="w-3 h-3 bg-red-primary flex-shrink-0" aria-hidden="true" />
    </Tag>
  );
}

// ============================================
// STATS COMPONENT
// ============================================

interface StatItemProps {
  value: string;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-heading font-bold text-red-primary mb-2">
        {value}
      </p>
      <p className="text-small text-gray-medium uppercase tracking-wide">{label}</p>
    </div>
  );
}

// ============================================
// VALUE CARD COMPONENT
// ============================================

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="bg-white p-6 border border-gray-border">
      <div className="w-12 h-12 bg-red-primary/10 flex items-center justify-center mb-4">
        <span className="text-red-primary">{icon}</span>
      </div>
      <h3 className="font-heading font-bold uppercase text-lg mb-2">{title}</h3>
      <p className="text-gray-dark leading-relaxed">{description}</p>
    </div>
  );
}

// ============================================
// TEAM MEMBER COMPONENT
// ============================================

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

function TeamMember({ name, role, image, bio }: TeamMemberProps) {
  return (
    <div className="text-center">
      <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden bg-gray-light">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="160px"
        />
      </div>
      <h3 className="font-heading font-bold uppercase text-lg">{name}</h3>
      <p className="text-red-primary text-small uppercase tracking-wide mb-2">{role}</p>
      <p className="text-gray-dark text-small leading-relaxed">{bio}</p>
    </div>
  );
}

// ============================================
// ABOUT PAGE
// ============================================

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-black py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/about/hero-bg.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <p className="text-red-primary font-heading uppercase tracking-wider mb-4">
              Since 1999
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase text-white mb-6">
              Canada&apos;s Premier Supplement Retailer
            </h1>
            <p className="text-lg md:text-xl text-gray-light leading-relaxed">
              For over 25 years, Naturally Fit has been helping Canadians achieve their
              fitness goals with quality products, expert advice, and unmatched customer
              service.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-light py-12 border-b border-gray-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="25+" label="Years in Business" />
            <StatItem value="50K+" label="Happy Customers" />
            <StatItem value="5000+" label="Products" />
            <StatItem value="3" label="Store Locations" />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading className="text-2xl md:text-3xl mb-6">
                Our Story
              </SectionHeading>
              <div className="space-y-4 text-gray-dark leading-relaxed">
                <p>
                  Naturally Fit was founded in 1999 by a Canadian Armed Forces veteran
                  with a passion for fitness and a vision to bring quality supplements
                  to the Canadian market at fair prices.
                </p>
                <p>
                  What started as a small store in Edmonton has grown into one of
                  Canada&apos;s most trusted supplement retailers, with three locations
                  and thousands of satisfied customers across the country.
                </p>
                <p>
                  Our commitment to quality hasn&apos;t changed. We still personally vet
                  every product we carry, ensuring our customers get only the best,
                  most effective supplements available.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src="/images/about/veteran-badge.png"
                    alt="Veteran Owned Business"
                    width={80}
                    height={80}
                    className="w-20 h-20"
                  />
                </div>
                <div>
                  <p className="font-heading font-bold uppercase text-sm">
                    Proudly Veteran Owned
                  </p>
                  <p className="text-small text-gray-medium">
                    Supporting those who served
                  </p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] bg-gray-light overflow-hidden">
              <Image
                src="/images/about/store-front.jpg"
                alt="Naturally Fit Store"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SectionHeading className="text-2xl md:text-3xl justify-center mb-4">
              Our Values
            </SectionHeading>
            <p className="text-gray-dark max-w-2xl mx-auto">
              These core values guide everything we do at Naturally Fit.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ValueCard
              icon={<Shield size={24} strokeWidth={1.5} />}
              title="Quality First"
              description="We only carry products we believe in. Every supplement is vetted for quality, purity, and effectiveness."
            />
            <ValueCard
              icon={<Heart size={24} strokeWidth={1.5} />}
              title="Customer Care"
              description="Our knowledgeable staff are here to help you find the right products for your goals, not just make a sale."
            />
            <ValueCard
              icon={<Award size={24} strokeWidth={1.5} />}
              title="Best Prices"
              description="We match any Canadian retailer's price. Quality supplements shouldn't break the bank."
            />
            <ValueCard
              icon={<Users size={24} strokeWidth={1.5} />}
              title="Community"
              description="We support local athletes, gyms, and fitness events. Your success is our success."
            />
            <ValueCard
              icon={<Clock size={24} strokeWidth={1.5} />}
              title="Fast Service"
              description="Same-day order processing and fast shipping across Canada. Get your supplements when you need them."
            />
            <ValueCard
              icon={<MapPin size={24} strokeWidth={1.5} />}
              title="Local Presence"
              description="With three Alberta locations, we're always nearby for in-person advice and immediate pickup."
            />
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SectionHeading className="text-2xl md:text-3xl justify-center mb-4">
              Meet Our Team
            </SectionHeading>
            <p className="text-gray-dark max-w-2xl mx-auto">
              Our team brings decades of combined experience in fitness, nutrition, and
              supplementation.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <TeamMember
              name="Mike Johnson"
              role="Founder & CEO"
              image="/images/team/mike.jpg"
              bio="Canadian Armed Forces veteran with 30+ years in the fitness industry."
            />
            <TeamMember
              name="Sarah Chen"
              role="Head of Operations"
              image="/images/team/sarah.jpg"
              bio="Certified nutritionist ensuring our product selection meets the highest standards."
            />
            <TeamMember
              name="Dave Williams"
              role="Store Manager"
              image="/images/team/dave.jpg"
              bio="Former competitive bodybuilder with expertise in sports nutrition."
            />
            <TeamMember
              name="Lisa Park"
              role="Customer Success"
              image="/images/team/lisa.jpg"
              bio="Dedicated to making sure every customer finds their perfect fit."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Visit one of our stores or shop online. Our team is ready to help you find
            the right supplements for your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className={cn(
                "inline-flex items-center justify-center",
                "px-8 py-4 min-h-[52px]",
                "font-heading font-bold uppercase tracking-button",
                "bg-white text-black hover:bg-gray-light",
                "transition-all duration-200"
              )}
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center justify-center",
                "px-8 py-4 min-h-[52px]",
                "font-heading font-bold uppercase tracking-button",
                "bg-transparent text-white border-2 border-white",
                "hover:bg-white hover:text-black",
                "transition-all duration-200"
              )}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

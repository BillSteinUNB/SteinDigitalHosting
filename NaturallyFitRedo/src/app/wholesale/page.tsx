"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import {
  BadgePercent,
  Truck,
  HeadphonesIcon,
  CreditCard,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  wholesaleInquirySchema,
  yearsInBusinessOptions,
  type WholesaleInquiryInput,
} from "@/lib/wholesale/schema";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

// ============================================
// WORDPRESS IMAGE REFERENCES
// ============================================
const WP_IMAGES = {
  heroBg: "/images/wholesale/hero-bg.jpg",
};

type WholesaleFormData = WholesaleInquiryInput;

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
        "font-heading font-bold uppercase text-black",
        "flex items-center gap-3",
        className
      )}
    >
      {children}
      <span className="w-3 h-3 bg-red-primary flex-shrink-0" aria-hidden="true" />
    </h2>
  );
}

// ============================================
// BENEFIT CARD COMPONENT
// ============================================

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-red-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-red-primary">{icon}</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-heading font-bold uppercase text-lg mb-1">{title}</h3>
        <p className="text-gray-dark">{description}</p>
      </div>
    </div>
  );
}

// ============================================
// FORM SECTION COMPONENT
// ============================================

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3 className="font-heading font-bold uppercase text-lg mb-4 pb-2 border-b border-gray-border">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ============================================
// WHOLESALE PAGE
// ============================================

export default function WholesalePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WholesaleFormData>({
    resolver: zodResolver(wholesaleInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      businessName: "",
      businessNumber: "",
      businessAddress: "",
      brandsCarried: "",
      brandsInterested: "",
      additionalInfo: "",
    },
  });

  const onSubmit = async (data: WholesaleFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/wholesale-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "We couldn’t submit your request. Please try again.");
      }

      setSubmitSuccess(true);
      reset();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Wholesale inquiry submit error:", error);
      setServerError(
        error instanceof Error
          ? error.message
          : "We couldn’t submit your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message after submission
  if (submitSuccess) {
    return (
      <main>
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} strokeWidth={1.5} className="text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-4">
                Request Received!
              </h1>
              <p className="text-lg text-gray-dark mb-8">
                Thank you for your interest in our wholesale program. Our team will review
                your request and contact you within 1-2 business days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login?callbackUrl=%2Fshop"
                  className={cn(
                    "inline-flex items-center justify-center",
                    "px-8 py-4 min-h-[52px]",
                    "font-heading font-bold uppercase tracking-button",
                    "bg-red-primary text-white hover:bg-red-hover",
                    "transition-all duration-200"
                  )}
                >
                  Wholesale Login
                </Link>
                <Link
                  href="/shop"
                  className={cn(
                    "inline-flex items-center justify-center",
                    "px-8 py-4 min-h-[52px]",
                    "font-heading font-bold uppercase tracking-button",
                    "bg-transparent text-black border-2 border-black",
                    "hover:bg-black hover:text-white",
                    "transition-all duration-200"
                  )}
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-black py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={WP_IMAGES.heroBg}
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
              For Gyms & Retailers
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold uppercase text-white mb-6">
              Wholesale Program
            </h1>
            <p className="text-lg text-gray-light leading-relaxed">
              Partner with Canada&apos;s premier supplement retailer. Get exclusive
              pricing, dedicated support, and access to over 5,000 products from top
              brands.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a
                href="#apply"
                className={cn(
                  "inline-flex items-center justify-center",
                  "px-10 py-4 min-h-[52px]",
                  "font-heading font-bold uppercase tracking-button text-lg",
                  "bg-red-primary text-white hover:bg-red-hover",
                  "transition-all duration-200"
                )}
                style={{ transform: "skewX(-15deg)" }}
              >
                <span style={{ transform: "skewX(15deg)", display: "inline-block" }}>
                  Apply for Wholesale
                </span>
              </a>
              <Link
                href="/login?callbackUrl=%2Fshop"
                className={cn(
                  "inline-flex items-center justify-center",
                  "px-10 py-4 min-h-[52px]",
                  "font-heading font-bold uppercase tracking-button text-lg",
                  "bg-white text-black hover:bg-gray-light",
                  "transition-all duration-200"
                )}
                style={{ transform: "skewX(-15deg)" }}
              >
                <span style={{ transform: "skewX(15deg)", display: "inline-block" }}>
                  Wholesale Login
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale Portal Options */}
      <section className="py-10 bg-gray-light border-b border-gray-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-border p-6">
              <h3 className="font-heading font-bold uppercase text-lg mb-2">Wholesale Ordering</h3>
              <p className="text-gray-dark mb-4">
                Approved partners can order online and access wholesale pricing.
              </p>
              <Link
                href="/shop"
                className={cn(
                  "inline-flex items-center justify-center",
                  "px-6 py-3 min-h-[44px]",
                  "font-heading font-bold uppercase tracking-button text-small",
                  "bg-black text-white hover:bg-gray-dark",
                  "transition-all duration-200"
                )}
              >
                Wholesale Shop
              </Link>
            </div>

            <div className="bg-white border border-gray-border p-6">
              <h3 className="font-heading font-bold uppercase text-lg mb-2">
                Already Have a Wholesale Account?
              </h3>
              <p className="text-gray-dark mb-4">
                Sign in to see wholesale pricing and place your order.
              </p>
              <Link
                href="/login?callbackUrl=%2Fshop"
                className={cn(
                  "inline-flex items-center justify-center",
                  "px-6 py-3 min-h-[44px]",
                  "font-heading font-bold uppercase tracking-button text-small",
                  "bg-red-primary text-white hover:bg-red-hover",
                  "transition-all duration-200"
                )}
              >
                Wholesale Login
              </Link>
            </div>

            <div className="bg-white border border-gray-border p-6">
              <h3 className="font-heading font-bold uppercase text-lg mb-2">New Wholesale Account</h3>
              <p className="text-gray-dark mb-4">
                Fill out a quick inquiry and we&apos;ll follow up within 1-2 business days.
              </p>
              <a
                href="#apply"
                className={cn(
                  "inline-flex items-center justify-center",
                  "px-6 py-3 min-h-[44px]",
                  "font-heading font-bold uppercase tracking-button text-small",
                  "bg-transparent text-black border-2 border-black",
                  "hover:bg-black hover:text-white",
                  "transition-all duration-200"
                )}
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SectionHeading className="text-2xl md:text-3xl justify-center mb-4">
              Wholesale Benefits
            </SectionHeading>
            <p className="text-gray-dark max-w-2xl mx-auto">
              Join hundreds of gyms, fitness studios, and retailers who trust Naturally
              Fit as their supplement partner.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <BenefitCard
              icon={<BadgePercent size={24} strokeWidth={1.5} />}
              title="Up to 40% Off"
              description="Enjoy significant discounts on all products, with volume-based pricing tiers."
            />
            <BenefitCard
              icon={<Truck size={24} strokeWidth={1.5} />}
              title="Free Shipping"
              description="Free shipping on all wholesale orders over $500 anywhere in Canada."
            />
            <BenefitCard
              icon={<HeadphonesIcon size={24} strokeWidth={1.5} />}
              title="Dedicated Support"
              description="Personal account manager to help with orders, product selection, and marketing."
            />
            <BenefitCard
              icon={<CreditCard size={24} strokeWidth={1.5} />}
              title="Flexible Payment"
              description="Net-30 payment terms available for qualified accounts after 3 months."
            />
            <BenefitCard
              icon={<Building2 size={24} strokeWidth={1.5} />}
              title="Drop Shipping"
              description="We can ship directly to your customers with your branding (available plans)."
            />
            <BenefitCard
              icon={<Users size={24} strokeWidth={1.5} />}
              title="Marketing Support"
              description="Access to product images, descriptions, and promotional materials."
            />
          </div>
        </div>
      </section>

      {/* Who Qualifies */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <SectionHeading className="text-2xl md:text-3xl mb-6">
              Who Qualifies?
            </SectionHeading>
            <p className="text-gray-dark mb-6">
              Our wholesale program is designed for businesses in the health and fitness
              industry:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Gyms & Fitness Centers",
                "Personal Trainers",
                "Health Food Stores",
                "Supplement Retailers",
                "Wellness Clinics",
                "Naturopaths & Nutritionists",
                "Sports Teams & Organizations",
                "Online Health Retailers",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    strokeWidth={1.5}
                    className="text-red-primary flex-shrink-0"
                  />
                  <span className="text-gray-dark">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-medium text-small mt-6">
              Not listed? Contact us to discuss your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Wholesale Inquiry Form */}
      <section id="apply" className="py-16 md:py-24 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <SectionHeading className="text-2xl md:text-3xl mb-6">
              Wholesale Inquiry
            </SectionHeading>
            <p className="text-gray-dark mb-8">
              Tell us a bit about your business and what you carry today. We&apos;ll review
              your request and follow up with next steps.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-gray-light p-6 md:p-8 border border-gray-border"
              noValidate
            >
              {/* Server Error */}
              {serverError && (
                <div className="bg-error/10 border border-error text-error px-4 py-3 mb-6">
                  <p className="font-semibold">Submission failed</p>
                  <p className="text-small">{serverError}</p>
                </div>
              )}

              {/* Contact Information */}
              <FormSection title="Contact Information">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Your name *"
                    placeholder="Your name"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="Your email *"
                    type="email"
                    placeholder="you@business.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>
                <Input
                  label="Your phone *"
                  type="tel"
                  placeholder="(506) 451-8707"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </FormSection>

              {/* Business Information */}
              <FormSection title="Business Information">
                <Input
                  label="Your business name *"
                  placeholder="Business name"
                  error={errors.businessName?.message}
                  {...register("businessName")}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Your business number *"
                    placeholder="Business number"
                    error={errors.businessNumber?.message}
                    {...register("businessNumber")}
                  />
                  <Select
                    label="How long have you been in business? *"
                    placeholder="Select"
                    error={errors.yearsInBusiness?.message}
                    options={yearsInBusinessOptions.map((o) => ({
                      value: o.value,
                      label: o.label,
                    }))}
                    {...register("yearsInBusiness")}
                  />
                </div>

                <Textarea
                  label="Your business address *"
                  placeholder="Business address"
                  rows={3}
                  error={errors.businessAddress?.message}
                  {...register("businessAddress")}
                />
              </FormSection>

              {/* Brands */}
              <FormSection title="Brands">
                <Textarea
                  label="What brands do you carry? *"
                  placeholder="List the brands you currently carry (comma-separated is fine)"
                  rows={4}
                  error={errors.brandsCarried?.message}
                  {...register("brandsCarried")}
                />
                <Textarea
                  label="What brands would you like to carry? *"
                  placeholder="List the brands you’d like to carry"
                  rows={4}
                  error={errors.brandsInterested?.message}
                  {...register("brandsInterested")}
                />
              </FormSection>

              {/* Additional Info */}
              <FormSection title="Additional Information">
                <Textarea
                  label="Additional Information"
                  placeholder="Anything else we should know? (locations, monthly volume, preferred ordering method, etc.)"
                  rows={4}
                  {...register("additionalInfo")}
                />
              </FormSection>

              {/* Submit */}
              <div className="border-t border-gray-border pt-6 flex flex-col sm:flex-row gap-4 items-start">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight size={18} strokeWidth={1.5} />}
                  className="w-full sm:w-auto"
                >
                  Submit Inquiry
                </Button>
                <Link
                  href="/login?callbackUrl=%2Fshop"
                  className={cn(
                    "inline-flex items-center justify-center w-full sm:w-auto",
                    "px-8 py-4 min-h-[52px]",
                    "font-heading font-bold uppercase tracking-button",
                    "bg-transparent text-black border-2 border-black",
                    "hover:bg-black hover:text-white",
                    "transition-all duration-200"
                  )}
                >
                  Wholesale Login
                </Link>
              </div>

              <p className="text-tiny text-gray-medium mt-4">
                By submitting this form, you agree to our{" "}
                <Link href="/privacy" className="text-red-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-4">
            Questions Before Applying?
          </h2>
          <p className="text-gray-light mb-8 max-w-2xl mx-auto">
            Our wholesale team is happy to answer any questions about the program,
            pricing, or product availability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:wholesale@naturallyfit.ca"
              className={cn(
                "inline-flex items-center justify-center",
                "px-8 py-4 min-h-[52px]",
                "font-heading font-bold uppercase tracking-button",
                "bg-white text-black hover:bg-gray-light",
                "transition-all duration-200"
              )}
            >
              Email Wholesale Team
            </a>
            <a
              href="tel:18005555678"
              className={cn(
                "inline-flex items-center justify-center",
                "px-8 py-4 min-h-[52px]",
                "font-heading font-bold uppercase tracking-button",
                "bg-transparent text-white border-2 border-white",
                "hover:bg-white hover:text-black",
                "transition-all duration-200"
              )}
            >
              Call 1-800-555-5678
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

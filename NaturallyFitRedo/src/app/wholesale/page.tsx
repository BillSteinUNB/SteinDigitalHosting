"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

// ============================================
// VALIDATION SCHEMA
// ============================================

const wholesaleSchema = z.object({
  // Business Information
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Please select a business type"),
  yearsInBusiness: z.string().min(1, "Please select years in business"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  taxId: z.string().min(1, "Tax ID / Business Number is required"),

  // Contact Information
  contactName: z.string().min(2, "Contact name is required"),
  contactTitle: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),

  // Address
  streetAddress: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(1, "Please select a province"),
  postalCode: z.string().min(6, "Please enter a valid postal code"),

  // Business Details
  estimatedMonthlyOrders: z.string().min(1, "Please select estimated monthly orders"),
  primaryProducts: z.string().min(1, "Please select primary product interest"),
  howDidYouHear: z.string().optional(),
  additionalInfo: z.string().optional(),

  // Terms
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type WholesaleFormData = z.infer<typeof wholesaleSchema>;

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WholesaleFormData>({
    resolver: zodResolver(wholesaleSchema),
  });

  const onSubmit = async (data: WholesaleFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Wholesale application submitted:", data);
    setSubmitSuccess(true);
    reset();
    setIsSubmitting(false);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                Application Submitted!
              </h1>
              <p className="text-lg text-gray-dark mb-8">
                Thank you for your interest in our wholesale program. Our team will review
                your application and contact you within 2-3 business days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop"
                  className={cn(
                    "inline-flex items-center justify-center",
                    "px-8 py-4 min-h-[52px]",
                    "font-heading font-bold uppercase tracking-button",
                    "bg-red-primary text-white hover:bg-red-hover",
                    "transition-all duration-200"
                  )}
                >
                  Browse Products
                </Link>
                <Link
                  href="/"
                  className={cn(
                    "inline-flex items-center justify-center",
                    "px-8 py-4 min-h-[52px]",
                    "font-heading font-bold uppercase tracking-button",
                    "bg-transparent text-black border-2 border-black",
                    "hover:bg-black hover:text-white",
                    "transition-all duration-200"
                  )}
                >
                  Return Home
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
            src="/images/wholesale/hero-bg.jpg"
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

      {/* Application Form */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <SectionHeading className="text-2xl md:text-3xl mb-6">
              Apply Now
            </SectionHeading>
            <p className="text-gray-dark mb-8">
              Complete the form below to apply for a wholesale account. We&apos;ll review
              your application and respond within 2-3 business days.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-light p-6 md:p-8">
              {/* Business Information */}
              <FormSection title="Business Information">
                <Input
                  label="Business Name *"
                  placeholder="Your Company Name"
                  error={errors.businessName?.message}
                  {...register("businessName")}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Business Type *"
                    placeholder="Select type"
                    error={errors.businessType?.message}
                    options={[
                      { value: "gym", label: "Gym / Fitness Center" },
                      { value: "personal-trainer", label: "Personal Trainer" },
                      { value: "health-store", label: "Health Food Store" },
                      { value: "supplement-retailer", label: "Supplement Retailer" },
                      { value: "wellness-clinic", label: "Wellness Clinic" },
                      { value: "healthcare", label: "Healthcare Professional" },
                      { value: "sports-team", label: "Sports Team/Organization" },
                      { value: "online-retailer", label: "Online Retailer" },
                      { value: "other", label: "Other" },
                    ]}
                    {...register("businessType")}
                  />
                  <Select
                    label="Years in Business *"
                    placeholder="Select years"
                    error={errors.yearsInBusiness?.message}
                    options={[
                      { value: "less-1", label: "Less than 1 year" },
                      { value: "1-2", label: "1-2 years" },
                      { value: "3-5", label: "3-5 years" },
                      { value: "5-10", label: "5-10 years" },
                      { value: "10+", label: "10+ years" },
                    ]}
                    {...register("yearsInBusiness")}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Website (optional)"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    error={errors.website?.message}
                    {...register("website")}
                  />
                  <Input
                    label="Tax ID / Business Number *"
                    placeholder="123456789 RT0001"
                    error={errors.taxId?.message}
                    {...register("taxId")}
                  />
                </div>
              </FormSection>

              {/* Contact Information */}
              <FormSection title="Contact Information">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Contact Name *"
                    placeholder="John Smith"
                    error={errors.contactName?.message}
                    {...register("contactName")}
                  />
                  <Input
                    label="Title (optional)"
                    placeholder="Owner / Manager"
                    {...register("contactTitle")}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="john@company.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                  <Input
                    label="Phone Number *"
                    type="tel"
                    placeholder="(555) 123-4567"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>
              </FormSection>

              {/* Business Address */}
              <FormSection title="Business Address">
                <Input
                  label="Street Address *"
                  placeholder="123 Main Street"
                  error={errors.streetAddress?.message}
                  {...register("streetAddress")}
                />

                <div className="grid sm:grid-cols-3 gap-4">
                  <Input
                    label="City *"
                    placeholder="Edmonton"
                    error={errors.city?.message}
                    {...register("city")}
                  />
                  <Select
                    label="Province *"
                    placeholder="Select"
                    error={errors.province?.message}
                    options={[
                      { value: "AB", label: "Alberta" },
                      { value: "BC", label: "British Columbia" },
                      { value: "MB", label: "Manitoba" },
                      { value: "NB", label: "New Brunswick" },
                      { value: "NL", label: "Newfoundland and Labrador" },
                      { value: "NS", label: "Nova Scotia" },
                      { value: "NT", label: "Northwest Territories" },
                      { value: "NU", label: "Nunavut" },
                      { value: "ON", label: "Ontario" },
                      { value: "PE", label: "Prince Edward Island" },
                      { value: "QC", label: "Quebec" },
                      { value: "SK", label: "Saskatchewan" },
                      { value: "YT", label: "Yukon" },
                    ]}
                    {...register("province")}
                  />
                  <Input
                    label="Postal Code *"
                    placeholder="T5J 2R4"
                    error={errors.postalCode?.message}
                    {...register("postalCode")}
                  />
                </div>
              </FormSection>

              {/* Additional Details */}
              <FormSection title="Additional Details">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Estimated Monthly Orders *"
                    placeholder="Select range"
                    error={errors.estimatedMonthlyOrders?.message}
                    options={[
                      { value: "under-500", label: "Under $500" },
                      { value: "500-1000", label: "$500 - $1,000" },
                      { value: "1000-2500", label: "$1,000 - $2,500" },
                      { value: "2500-5000", label: "$2,500 - $5,000" },
                      { value: "5000-10000", label: "$5,000 - $10,000" },
                      { value: "10000+", label: "$10,000+" },
                    ]}
                    {...register("estimatedMonthlyOrders")}
                  />
                  <Select
                    label="Primary Product Interest *"
                    placeholder="Select category"
                    error={errors.primaryProducts?.message}
                    options={[
                      { value: "protein", label: "Protein & Amino Acids" },
                      { value: "pre-workout", label: "Pre-Workout & Energy" },
                      { value: "vitamins", label: "Vitamins & Health" },
                      { value: "weight-management", label: "Weight Management" },
                      { value: "sports-nutrition", label: "Sports Nutrition" },
                      { value: "multiple", label: "Multiple Categories" },
                    ]}
                    {...register("primaryProducts")}
                  />
                </div>

                <Select
                  label="How did you hear about us?"
                  placeholder="Select option"
                  options={[
                    { value: "search", label: "Search Engine" },
                    { value: "social", label: "Social Media" },
                    { value: "referral", label: "Referral / Word of Mouth" },
                    { value: "tradeshow", label: "Trade Show / Event" },
                    { value: "advertisement", label: "Advertisement" },
                    { value: "existing-customer", label: "Existing Customer" },
                    { value: "other", label: "Other" },
                  ]}
                  {...register("howDidYouHear")}
                />

                <Textarea
                  label="Additional Information (optional)"
                  placeholder="Tell us about your business, specific product needs, or any questions you have..."
                  rows={4}
                  {...register("additionalInfo")}
                />
              </FormSection>

              {/* Terms & Submit */}
              <div className="border-t border-gray-border pt-6">
                <label className="flex items-start gap-3 cursor-pointer mb-6">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 accent-red-primary"
                    {...register("agreeTerms")}
                  />
                  <span className="text-small text-gray-dark">
                    I agree to the{" "}
                    <Link href="/terms" className="text-red-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-red-primary hover:underline">
                      Privacy Policy
                    </Link>
                    . I understand that my application will be reviewed and I will be
                    contacted within 2-3 business days.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-error text-tiny mb-4">{errors.agreeTerms.message}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight size={18} strokeWidth={1.5} />}
                  className="w-full sm:w-auto"
                >
                  Submit Application
                </Button>
              </div>
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

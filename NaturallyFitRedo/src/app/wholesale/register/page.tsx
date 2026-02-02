"use client";

// ============================================
// WHOLESALE REGISTRATION PAGE
// ============================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Input, Textarea } from "@/components/ui";
import { Container } from "@/components/ui";

// ============================================
// VALIDATION SCHEMA
// ============================================

const wholesaleRegisterSchema = z.object({
  // Business Info
  businessName: z.string().min(2, "Business name is required"),
  businessNumber: z.string().min(1, "Business number is required"),
  businessAddress: z.string().min(5, "Business address is required"),
  
  // Contact Info
  name: z.string().min(2, "Your name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number is required"),
  
  // Business Details
  yearsInBusiness: z.string().min(1, "Please select years in business"),
  brandsCarry: z.string().optional(),
  brandsWant: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type WholesaleRegisterFormData = z.infer<typeof wholesaleRegisterSchema>;

// ============================================
// PAGE COMPONENT
// ============================================

export default function WholesaleRegisterPage() {
  const _router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WholesaleRegisterFormData>({
    resolver: zodResolver(wholesaleRegisterSchema),
  });

  const onSubmit = async (data: WholesaleRegisterFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      // Submit wholesale application
      const response = await fetch("/api/wholesale-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Map form fields to inquiry schema
          name: data.name,
          email: data.email,
          phone: data.phone,
          businessName: data.businessName,
          businessNumber: data.businessNumber,
          businessAddress: data.businessAddress,
          yearsInBusiness: data.yearsInBusiness,
          brandsCarry: data.brandsCarry,
          brandsWant: data.brandsWant,
          additionalInfo: data.additionalInfo,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit application");
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      setServerError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <main className="py-12 lg:py-16 min-h-[calc(100vh-200px)]">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Building2 size={40} strokeWidth={1.5} className="text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-4">
              Application Submitted!
            </h1>
            <p className="text-lg text-gray-dark mb-8">
              Thank you for your interest in our wholesale program. Our team will review
              your application and contact you within 1-2 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/wholesale"
                className={cn(
                  "inline-flex items-center justify-center",
                  "px-8 py-4 min-h-[52px]",
                  "font-heading font-bold uppercase tracking-button",
                  "bg-red-primary text-white hover:bg-red-hover",
                  "transition-all duration-200"
                )}
              >
                Return to Wholesale
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-12 lg:py-16 min-h-[calc(100vh-200px)]">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-primary/10 flex items-center justify-center mx-auto mb-4">
              <Building2 size={32} strokeWidth={1.5} className="text-red-primary" />
            </div>
            <h1 className="font-heading font-bold text-h1 uppercase mb-2">
              Apply for Wholesale
            </h1>
            <p className="text-body text-gray-medium">
              Complete the form below to apply for a wholesale account. We&apos;ll review
              your application and respond within 1-2 business days.
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white p-6 sm:p-8 border border-gray-border">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Server Error */}
              {serverError && (
                <div className="flex items-start gap-3 p-4 bg-error/10 border border-error text-error">
                  <AlertCircle size={20} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-small font-semibold">Registration Failed</p>
                    <p className="text-small">{serverError}</p>
                  </div>
                </div>
              )}

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold uppercase text-lg pb-2 border-b border-gray-border">
                  Business Information
                </h3>

                <Input
                  {...register("businessName")}
                  label="Business Name *"
                  placeholder="Your Company Name"
                  error={errors.businessName?.message}
                  disabled={isSubmitting}
                />

                <Input
                  {...register("businessNumber")}
                  label="Business Number *"
                  placeholder="123456789 RT0001"
                  error={errors.businessNumber?.message}
                  disabled={isSubmitting}
                />

                <Textarea
                  {...register("businessAddress")}
                  label="Business Address *"
                  placeholder="123 Main Street, City, Province, Postal Code"
                  rows={3}
                  error={errors.businessAddress?.message}
                  disabled={isSubmitting}
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold uppercase text-lg pb-2 border-b border-gray-border">
                  Contact Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    {...register("name")}
                    label="Your Name *"
                    placeholder="John Smith"
                    error={errors.name?.message}
                    disabled={isSubmitting}
                  />

                  <Input
                    {...register("email")}
                    type="email"
                    label="Email Address *"
                    placeholder="john@company.com"
                    error={errors.email?.message}
                    disabled={isSubmitting}
                  />
                </div>

                <Input
                  {...register("phone")}
                  type="tel"
                  label="Phone Number *"
                  placeholder="(555) 123-4567"
                  error={errors.phone?.message}
                  disabled={isSubmitting}
                />
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold uppercase text-lg pb-2 border-b border-gray-border">
                  Business Details
                </h3>

                <div>
                  <label className="text-small font-semibold text-black mb-1.5 block">
                    How long have you been in business? *
                  </label>
                  <select
                    {...register("yearsInBusiness")}
                    className={cn(
                      "w-full px-4 py-3 min-h-[44px]",
                      "text-body font-body text-black",
                      "bg-white border border-gray-border rounded-none",
                      "transition-colors duration-200",
                      "focus:outline-none focus:border-black",
                      errors.yearsInBusiness && "border-error focus:border-error",
                      isSubmitting && "bg-gray-light cursor-not-allowed opacity-60"
                    )}
                    disabled={isSubmitting}
                  >
                    <option value="">Select...</option>
                    <option value="less-1">Less than 1 year</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {errors.yearsInBusiness && (
                    <p className="text-tiny text-error mt-1" role="alert">
                      {errors.yearsInBusiness.message}
                    </p>
                  )}
                </div>

                <Textarea
                  {...register("brandsCarry")}
                  label="What brands do you carry? (optional)"
                  placeholder="List the supplement brands you currently carry..."
                  rows={3}
                  error={errors.brandsCarry?.message}
                  disabled={isSubmitting}
                />

                <Textarea
                  {...register("brandsWant")}
                  label="What brands would you like to carry? (optional)"
                  placeholder="List the brands you're interested in..."
                  rows={3}
                  error={errors.brandsWant?.message}
                  disabled={isSubmitting}
                />

                <Textarea
                  {...register("additionalInfo")}
                  label="Additional Information (optional)"
                  placeholder="Tell us about your business, specific product needs, or any questions..."
                  rows={4}
                  error={errors.additionalInfo?.message}
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </div>

          {/* Links */}
          <div className="mt-8 text-center">
            <p className="text-small text-gray-medium">
              Already have a wholesale account?{" "}
              <Link
                href="/wholesale/login"
                className="text-red-primary font-semibold hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}

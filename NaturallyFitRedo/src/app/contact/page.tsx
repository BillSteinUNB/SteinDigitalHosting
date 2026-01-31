"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

// ============================================
// VALIDATION SCHEMA
// ============================================

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

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
// STORE LOCATION COMPONENT
// ============================================

interface StoreLocationProps {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  mapUrl: string;
}

function StoreLocation({
  name,
  address,
  city,
  phone,
  email,
  hours,
  mapUrl,
}: StoreLocationProps) {
  return (
    <div className="bg-white border border-gray-border p-6">
      <h3 className="font-heading font-bold uppercase text-lg mb-4">{name}</h3>

      <div className="space-y-4">
        {/* Address */}
        <div className="flex gap-3">
          <MapPin size={20} strokeWidth={1.5} className="text-red-primary flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-gray-dark">{address}</p>
            <p className="text-gray-dark">{city}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex gap-3">
          <Phone size={20} strokeWidth={1.5} className="text-red-primary flex-shrink-0" />
          <a
            href={`tel:${phone.replace(/[^0-9]/g, "")}`}
            className="text-gray-dark hover:text-red-primary transition-colors"
          >
            {phone}
          </a>
        </div>

        {/* Email */}
        <div className="flex gap-3">
          <Mail size={20} strokeWidth={1.5} className="text-red-primary flex-shrink-0" />
          <a
            href={`mailto:${email}`}
            className="text-gray-dark hover:text-red-primary transition-colors break-all"
          >
            {email}
          </a>
        </div>

        {/* Hours */}
        <div className="flex gap-3">
          <Clock size={20} strokeWidth={1.5} className="text-red-primary flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-gray-dark">
              <span className="font-semibold">Mon-Fri:</span> {hours.weekdays}
            </p>
            <p className="text-gray-dark">
              <span className="font-semibold">Saturday:</span> {hours.saturday}
            </p>
            <p className="text-gray-dark">
              <span className="font-semibold">Sunday:</span> {hours.sunday}
            </p>
          </div>
        </div>
      </div>

      {/* Get Directions */}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center mt-6 w-full",
          "px-6 py-3 min-h-[44px]",
          "font-heading font-bold uppercase tracking-button text-small",
          "bg-transparent border-2 border-black text-black",
          "hover:bg-black hover:text-white",
          "transition-all duration-200"
        )}
      >
        Get Directions
      </a>
    </div>
  );
}

// ============================================
// CONTACT FORM COMPONENT
// ============================================

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Contact form submitted:", data);
    setSubmitSuccess(true);
    reset();
    setIsSubmitting(false);

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3">
          <p className="font-semibold">Thank you for your message!</p>
          <p className="text-sm">We&apos;ll get back to you within 24-48 hours.</p>
        </div>
      )}

      {/* Name & Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Name *"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email *"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      {/* Phone & Subject */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Phone (optional)"
          type="tel"
          placeholder="(555) 123-4567"
          {...register("phone")}
        />
        <Select
          label="Subject *"
          placeholder="Select a subject"
          error={errors.subject?.message}
          options={[
            { value: "general", label: "General Inquiry" },
            { value: "order", label: "Order Question" },
            { value: "product", label: "Product Information" },
            { value: "wholesale", label: "Wholesale Inquiry" },
            { value: "returns", label: "Returns & Exchanges" },
            { value: "other", label: "Other" },
          ]}
          {...register("subject")}
        />
      </div>

      {/* Message */}
      <Textarea
        label="Message *"
        placeholder="How can we help you?"
        rows={5}
        error={errors.message?.message}
        {...register("message")}
      />

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        rightIcon={<Send size={18} strokeWidth={1.5} />}
        className="w-full sm:w-auto"
      >
        Send Message
      </Button>
    </form>
  );
}

// ============================================
// STORE LOCATIONS DATA
// ============================================

const storeLocations: StoreLocationProps[] = [
  {
    name: "Edmonton - West",
    address: "12345 Stony Plain Road NW",
    city: "Edmonton, AB T5N 3Y3",
    phone: "(780) 555-0101",
    email: "west@naturallyfit.ca",
    hours: {
      weekdays: "9:00 AM - 8:00 PM",
      saturday: "9:00 AM - 6:00 PM",
      sunday: "11:00 AM - 5:00 PM",
    },
    mapUrl: "https://maps.google.com/?q=Edmonton+West",
  },
  {
    name: "Edmonton - South",
    address: "4567 Calgary Trail NW",
    city: "Edmonton, AB T6H 5R7",
    phone: "(780) 555-0102",
    email: "south@naturallyfit.ca",
    hours: {
      weekdays: "9:00 AM - 8:00 PM",
      saturday: "9:00 AM - 6:00 PM",
      sunday: "11:00 AM - 5:00 PM",
    },
    mapUrl: "https://maps.google.com/?q=Edmonton+South",
  },
  {
    name: "Calgary",
    address: "7890 Macleod Trail SE",
    city: "Calgary, AB T2H 0K2",
    phone: "(403) 555-0103",
    email: "calgary@naturallyfit.ca",
    hours: {
      weekdays: "9:00 AM - 8:00 PM",
      saturday: "9:00 AM - 6:00 PM",
      sunday: "11:00 AM - 5:00 PM",
    },
    mapUrl: "https://maps.google.com/?q=Calgary+Macleod+Trail",
  },
];

// ============================================
// CONTACT PAGE
// ============================================

export default function ContactPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold uppercase text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-light">
              Have a question or need assistance? We&apos;re here to help. Reach out via
              the form below, give us a call, or visit one of our stores.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <SectionHeading className="text-2xl md:text-3xl mb-6">
                Send Us a Message
              </SectionHeading>
              <p className="text-gray-dark mb-8">
                Fill out the form below and we&apos;ll get back to you within 24-48
                hours. For urgent matters, please call your nearest store directly.
              </p>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <SectionHeading className="text-2xl md:text-3xl mb-6">
                Quick Contact
              </SectionHeading>

              <div className="bg-gray-light p-6 mb-6">
                <h3 className="font-heading font-bold uppercase mb-4">
                  General Inquiries
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Phone size={20} strokeWidth={1.5} className="text-red-primary flex-shrink-0" />
                    <a
                      href="tel:18005551234"
                      className="text-gray-dark hover:text-red-primary transition-colors"
                    >
                      1-800-555-1234
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <Mail size={20} strokeWidth={1.5} className="text-red-primary flex-shrink-0" />
                    <a
                      href="mailto:info@naturallyfit.ca"
                      className="text-gray-dark hover:text-red-primary transition-colors"
                    >
                      info@naturallyfit.ca
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gray-light p-6">
                <h3 className="font-heading font-bold uppercase mb-4">
                  Wholesale Inquiries
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Phone size={20} strokeWidth={1.5} className="text-red-primary flex-shrink-0" />
                    <a
                      href="tel:18005555678"
                      className="text-gray-dark hover:text-red-primary transition-colors"
                    >
                      1-800-555-5678
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <Mail size={20} strokeWidth={1.5} className="text-red-primary flex-shrink-0" />
                    <a
                      href="mailto:wholesale@naturallyfit.ca"
                      className="text-gray-dark hover:text-red-primary transition-colors"
                    >
                      wholesale@naturallyfit.ca
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SectionHeading className="text-2xl md:text-3xl justify-center mb-4">
              Our Locations
            </SectionHeading>
            <p className="text-gray-dark max-w-2xl mx-auto">
              Visit us in person for expert advice, immediate product pickup, and to
              meet our knowledgeable team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeLocations.map((store) => (
              <StoreLocation key={store.name} {...store} />
            ))}
          </div>
        </div>
      </section>

      {/* Map Embed Placeholder */}
      <section className="h-[400px] bg-gray-medium relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <MapPin size={48} strokeWidth={1.5} className="mx-auto mb-4" />
            <p className="font-heading uppercase tracking-wider">
              Interactive Map Coming Soon
            </p>
            <p className="text-sm mt-2 opacity-80">
              Google Maps integration will be added here
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

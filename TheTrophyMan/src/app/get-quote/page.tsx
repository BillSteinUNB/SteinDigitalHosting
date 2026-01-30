// Get a Quote Page
// Contact form with validation and file upload

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { mockServices, mockSiteSettings } from '@/lib/mockData';
import type { Service, SiteSettings } from '@/types';

// Form validation schema
const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Please describe your project (min 10 characters)'),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

function QuoteForm() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('service');

  const [services] = useState<Service[]>(mockServices);
  const [settings] = useState<SiteSettings | null>(mockSiteSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      service: preselectedService || '',
    },
  });

  useEffect(() => {
    if (preselectedService) {
      setValue('service', preselectedService);
    }
  }, [preselectedService, setValue]);

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate form submission for demo
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 bg-black-rich">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-gold font-mono text-sm uppercase tracking-ultra mb-4 block">
              Contact Us
            </span>
            <h1 className="font-display text-display font-bold text-white mb-6">
              Get a Free Quote
            </h1>
            <p className="text-xl text-text-gray">
              Tell us about your project and we'll be in touch with a custom quote.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 bg-white-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-lg shadow-lg p-8">
                {submitStatus === 'success' ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h2 className="font-display text-2xl font-bold text-text-dark mb-4">
                      Quote Request Submitted!
                    </h2>
                    <p className="text-text-muted mb-6">
                      Thank you for your inquiry. We'll review your request and get
                      back to you within 24-48 hours.
                    </p>
                    <button
                      onClick={() => setSubmitStatus('idle')}
                      className="btn-primary px-6 py-3"
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-text-dark mb-2"
                      >
                        Name *
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        id="name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-mid focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-error flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-text-dark mb-2"
                      >
                        Email *
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-mid focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-error flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-text-dark mb-2"
                      >
                        Phone
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        id="phone"
                        className="w-full px-4 py-3 rounded-lg border border-gray-mid focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                        placeholder="(506) 123-4567"
                      />
                    </div>

                    {/* Service */}
                    <div>
                      <label
                        htmlFor="service"
                        className="block text-sm font-medium text-text-dark mb-2"
                      >
                        Service Interested In *
                      </label>
                      <select
                        {...register('service')}
                        id="service"
                        className="w-full px-4 py-3 rounded-lg border border-gray-mid focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                      >
                        <option value="">Select a service...</option>
                        {services.map((service) => (
                          <option
                            key={service._id}
                            value={service.slug.current}
                          >
                            {service.title}
                          </option>
                        ))}
                        <option value="other">Other / Not Sure</option>
                      </select>
                      {errors.service && (
                        <p className="mt-1 text-sm text-error flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.service.message}
                        </p>
                      )}
                    </div>

                    {/* File Upload - Disabled for Demo */}
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Upload Logo/Artwork (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-mid rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                        <p className="text-text-muted text-sm">
                          File upload coming soon
                        </p>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-text-dark mb-2"
                      >
                        Message *
                      </label>
                      <textarea
                        {...register('message')}
                        id="message"
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-gray-mid focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
                        placeholder="Tell us about your project, including quantity, timeline, and any specific requirements..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-error flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gold text-black-pure font-semibold uppercase tracking-ultra py-4 px-8 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Request →'
                      )}
                    </button>

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-error/10 border border-error rounded-lg">
                        <p className="text-error flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Something went wrong. Please try again or contact us
                          directly.
                        </p>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2"
            >
              <div className="bg-black-elevated rounded-lg p-8 border border-black-border">
                <h2 className="font-display text-2xl font-bold text-white mb-8">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Visit Us</h3>
                      <p className="text-text-gray">
                        {settings?.address ? (
                          <>
                            {settings.address.street}
                            <br />
                            {settings.address.city}, {settings.address.province}{' '}
                            {settings.address.postalCode}
                          </>
                        ) : (
                          <>
                            4 Brizley St
                            <br />
                            Oromocto, NB E2V 1E3
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Call Us</h3>
                      <a
                        href={`tel:${
                          settings?.phone?.replace(/\s/g, '') || '506-357-1234'
                        }`}
                        className="text-text-gray hover:text-gold transition-colors"
                      >
                        {settings?.phone || '(506) 357-1234'}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Email Us</h3>
                      <a
                        href={`mailto:${settings?.email || 'info@trophyman.ca'}`}
                        className="text-text-gray hover:text-gold transition-colors"
                      >
                        {settings?.email || 'info@trophyman.ca'}
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Hours</h3>
                      <div className="text-text-gray">
                        {settings?.hours && settings.hours.length > 0 ? (
                          settings.hours.map((schedule, index) => (
                            <p key={index}>
                              {schedule.days}: {schedule.hours}
                            </p>
                          ))
                        ) : (
                          <>
                            <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
                            <p>Saturday: 10:00 AM - 2:00 PM</p>
                            <p>Sunday: Closed</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

// Wrap the form in Suspense for static generation
export default function GetQuotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black-rich flex items-center justify-center"><div className="text-gold">Loading...</div></div>}>
      <QuoteForm />
    </Suspense>
  );
}

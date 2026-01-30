// About Page
// Company history, mission, and team information

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Users, Clock, MapPin } from 'lucide-react';
import { client } from '@/lib/sanity';
import { aboutQuery, siteSettingsQuery } from '@/lib/queries';
import { urlFor } from '@/lib/sanity';
import type { About, SiteSettings } from '@/types';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about The Trophy Man - Oromocto\'s trusted source for custom trophies, awards, and engraving since 1998.',
};

export const revalidate = 3600;

export default async function AboutPage() {
  let about: About | null = null;
  let settings: SiteSettings | null = null;

  try {
    [about, settings] = await Promise.all([
      client.fetch(aboutQuery),
      client.fetch(siteSettingsQuery),
    ]);
  } catch (error) {
    console.error('Error fetching about page data:', error);
  }

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
              Our Story
            </span>
            <h1 className="font-display text-display font-bold text-white mb-6">
              About The Trophy Man
            </h1>
            <p className="text-xl text-text-gray">
              {about?.mission ||
                'Celebrating achievement and craftsmanship in Oromocto since 1998.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                {about?.teamImage ? (
                  <Image
                    src={urlFor(about.teamImage).width(800).height(600).url()}
                    alt={about.teamImage.alt || 'The Trophy Man Team'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-light flex items-center justify-center">
                    <Users className="w-24 h-24 text-gold-muted" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-h1 font-bold text-text-dark mb-6">
                Our Story
              </h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-text-muted mb-6">
                  {about?.story ||
                    `Serving Oromocto and the Maritimes for over ${
                      about?.yearsInBusiness || 25
                    } years, The Trophy Man has been the region's trusted source for custom awards and recognition products.`}
                </p>

                <p className="text-text-muted mb-6">
                  From local sports leagues to corporate events, we take pride in
                  helping our community celebrate achievements of all sizes. Our
                  commitment to quality craftsmanship and personalized service has
                  made us the go-to destination for trophies, awards, plaques, and
                  promotional products in the Oromocto area.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-mid">
                <div className="text-center">
                  <Award className="w-8 h-8 text-gold mx-auto mb-2" />
                  <p className="font-display text-3xl font-bold text-text-dark">
                    {about?.yearsInBusiness || 25}+
                  </p>
                  <p className="text-text-muted text-sm">Years in Business</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-gold mx-auto mb-2" />
                  <p className="font-display text-3xl font-bold text-text-dark">
                    1000+
                  </p>
                  <p className="text-text-muted text-sm">Happy Clients</p>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-gold mx-auto mb-2" />
                  <p className="font-display text-3xl font-bold text-text-dark">
                    Fast
                  </p>
                  <p className="text-text-muted text-sm">Turnaround</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-black-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gold font-mono text-sm uppercase tracking-ultra mb-4 block">
              Our Mission
            </span>

            <blockquote className="font-display text-2xl md:text-3xl font-bold text-white italic mb-8">
              "{about?.mission ||
                'To provide quality awards and recognition products that celebrate achievement and create lasting memories for our community.'}"
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-white-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                {about?.exteriorImage ? (
                  <Image
                    src={urlFor(about.exteriorImage).width(400).height(400).url()}
                    alt={about.exteriorImage.alt || 'Store Exterior'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-light flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gold-muted" />
                  </div>
                )}
              </div>

              <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                {about?.workshopImage ? (
                  <Image
                    src={urlFor(about.workshopImage).width(400).height(400).url()}
                    alt={about.workshopImage.alt || 'Workshop'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-light flex items-center justify-center">
                    <Award className="w-12 h-12 text-gold-muted" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Location Info */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-h1 font-bold text-text-dark mb-6">
                Visit Us
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <p className="font-semibold text-text-dark">Address</p>
                    <p className="text-text-muted">
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

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <p className="font-semibold text-text-dark">Hours</p>
                    <div className="text-text-muted">
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

              <Link
                href="/get-quote"
                className="btn-primary inline-block px-8 py-4 text-lg font-semibold uppercase tracking-ultra"
              >
                Visit Us Today →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Map */}
      {settings?.googleMapsEmbed && (
        <section className="h-96">
          <iframe
            src={settings.googleMapsEmbed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="The Trophy Man Location"
          />
        </section>
      )}
    </>
  );
}

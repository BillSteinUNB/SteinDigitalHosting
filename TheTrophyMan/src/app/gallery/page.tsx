// Gallery Page
// Filterable masonry gallery of portfolio items

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { client } from '@/lib/sanity';
import {
  allGalleryQuery,
  galleryByCategoryQuery,
  galleryCategoriesQuery,
} from '@/lib/queries';
import { urlFor } from '@/lib/sanity';
import type { GalleryItem, GalleryCategory } from '@/types';
import { categoryLabels } from '@/types';

const categories: GalleryCategory[] = [
  'all',
  'sports',
  'corporate',
  'apparel',
  'signs',
  'engraving',
  'promo',
  'other',
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, [activeCategory]);

  async function fetchItems() {
    setLoading(true);
    try {
      const query =
        activeCategory === 'all'
          ? allGalleryQuery
          : galleryByCategoryQuery(activeCategory);
      const data = await client.fetch(query);
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  }

  // Masonry breakpoints
  const breakpointColumns = {
    default: 4,
    1280: 4,
    1024: 3,
    768: 2,
    640: 1,
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
              Portfolio
            </span>
            <h1 className="font-display text-display font-bold text-white mb-6">
              Our Work
            </h1>
            <p className="text-xl text-text-gray">
              A gallery of achievement. Browse our portfolio of custom trophies,
              awards, and promotional products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 bg-black-soft border-b border-black-border sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gold text-black-pure'
                    : 'bg-black-elevated text-text-gray hover:text-white border border-black-border'
                }`}
              >
                {category === 'all' ? 'All' : categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-black-rich min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-text-gray text-lg">
                No items found in this category.
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="break-inside-avoid"
                  >
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="group w-full text-left"
                    >
                      <div className="relative overflow-hidden rounded-lg gallery-item">
                        <Image
                          src={urlFor(item.image).width(600).url()}
                          alt={item.image.alt || item.title}
                          width={600}
                          height={400}
                          className="w-full h-auto object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black-rich/90 via-black-rich/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <span className="text-gold font-mono text-xs uppercase tracking-ultra mb-1">
                            {item.category === 'all' ? 'All Categories' : categoryLabels[item.category]}
                          </span>
                          <h3 className="font-display text-lg font-bold text-white">
                            {item.title}
                          </h3>
                          {item.client && (
                            <p className="text-text-gray text-sm">{item.client}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black-pure/95 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 text-white hover:text-gold transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-black-elevated rounded-lg overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={urlFor(selectedItem.image).width(1200).url()}
                    alt={selectedItem.image.alt || selectedItem.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1280px) 100vw, 1200px"
                  />
                </div>

                <div className="p-6">
                  <span className="text-gold font-mono text-sm uppercase tracking-ultra mb-2 block">
                    {selectedItem.category === 'all' ? 'All Categories' : categoryLabels[selectedItem.category]}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-white mb-2">
                    {selectedItem.title}
                  </h2>
                  {selectedItem.client && (
                    <p className="text-gold mb-4">{selectedItem.client}</p>
                  )}
                  {selectedItem.description && (
                    <p className="text-text-gray">{selectedItem.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

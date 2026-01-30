// Sanity Schema: Service
// Represents individual services offered by The Trophy Man

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Services',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'Brief description for cards (max 100 characters)',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'text',
      rows: 6,
      description: 'Detailed description for the service page',
    }),
    defineField({
      name: 'startingPrice',
      title: 'Starting Price',
      type: 'string',
      description: 'e.g., "From $15" or "Starting at $25"',
    }),
    defineField({
      name: 'pricingTiers',
      title: 'Pricing Tiers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Tier Name', type: 'string' },
            { name: 'priceRange', title: 'Price Range', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name (e.g., "Trophy", "Award", "Shirt")',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required().error('Alt text is required for accessibility and SEO'),
        },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Service Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required().error('Alt text is required for accessibility and SEO'),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'featuredImage',
      order: 'order',
    },
    prepare({ title, media, order }) {
      return {
        title,
        subtitle: `Order: ${order || 'Not set'}`,
        media,
      };
    },
  },
});

// Sanity Schema: Testimonial
// Customer testimonials and reviews

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'string',
      description: 'e.g., "Oromocto Minor Hockey"',
    }),
    defineField({
      name: 'role',
      title: 'Role/Title',
      type: 'string',
      description: 'e.g., "President", "Coach", "Event Coordinator"',
    }),
    defineField({
      name: 'image',
      title: 'Author Photo (Optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Show on homepage',
    }),
    defineField({
      name: 'rating',
      title: 'Star Rating',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
      initialValue: 5,
    }),
  ],
  preview: {
    select: {
      title: 'author',
      subtitle: 'organization',
      media: 'image',
      featured: 'featured',
    },
    prepare({ title, subtitle, media, featured }) {
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle,
        media,
      };
    },
  },
});

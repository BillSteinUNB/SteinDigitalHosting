// Sanity Schema: Gallery Item
// Represents individual portfolio/gallery items

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'galleryItem',
  title: 'Gallery Items',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Item Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Sports Awards', value: 'sports' },
          { title: 'Corporate Awards', value: 'corporate' },
          { title: 'Apparel', value: 'apparel' },
          { title: 'Signs & Banners', value: 'signs' },
          { title: 'Engraving', value: 'engraving' },
          { title: 'Promotional Products', value: 'promo' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
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
      name: 'beforeImage',
      title: 'Before Image (Optional)',
      type: 'image',
      description: 'For before/after comparisons (e.g., blank vs engraved)',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'client',
      title: 'Client/Event (Optional)',
      type: 'string',
      description: 'e.g., "Oromocto Minor Hockey" or "CFB Gagetown"',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'dateCreated',
      title: 'Date Created',
      type: 'date',
    }),
  ],
  orderings: [
    {
      title: 'Date Created (Newest)',
      name: 'dateDesc',
      by: [{ field: 'dateCreated', direction: 'desc' }],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [{ field: 'featured', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'image',
      featured: 'featured',
    },
    prepare({ title, category, media, featured }) {
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: category,
        media,
      };
    },
  },
});

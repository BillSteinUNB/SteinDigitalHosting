// Sanity Schema: About (Singleton)
// This schema represents the About page content managed by the client

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'story',
      title: 'Our Story',
      type: 'text',
      rows: 6,
      description: 'The main story/history of The Trophy Man',
    }),
    defineField({
      name: 'mission',
      title: 'Mission Statement',
      type: 'string',
      description: 'A short mission statement for the business',
    }),
    defineField({
      name: 'yearsInBusiness',
      title: 'Years in Business',
      type: 'number',
      description: 'How many years The Trophy Man has been operating',
    }),
    defineField({
      name: 'foundedYear',
      title: 'Year Founded',
      type: 'number',
      description: 'The year the business was established',
    }),
    defineField({
      name: 'teamImage',
      title: 'Team/Shop Photo',
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
      name: 'exteriorImage',
      title: 'Building Exterior',
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
      name: 'workshopImage',
      title: 'Workshop Photo',
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
      name: 'ownerName',
      title: 'Owner Name',
      type: 'string',
    }),
    defineField({
      name: 'ownerBio',
      title: 'Owner Bio',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Page',
      };
    },
  },
});

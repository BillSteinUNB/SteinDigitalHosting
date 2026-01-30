# The Trophy Man

A premium website for The Trophy Man - Oromocto's award specialists. Built with Next.js 15, TypeScript, Tailwind CSS, and Sanity CMS.

## Features

- **Hero Carousel**: Full-screen carousel with Swiper.js
- **Services Showcase**: Grid layout with service details
- **Portfolio Gallery**: Filterable masonry gallery with lightbox
- **Quote Form**: Contact form with file upload and email notifications
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags, Open Graph, Schema.org structured data
- **CMS Integration**: Sanity.io for content management

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Sanity.io
- **Email**: Resend
- **File Upload**: Uploadthing
- **Animations**: Framer Motion
- **Carousel**: Swiper.js

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token

# Resend Email
RESEND_API_KEY=your_api_key
QUOTE_EMAIL=recipient@email.com

# UploadThing
UPLOADTHING_SECRET=your_secret
UPLOADTHING_APP_ID=your_app_id
```

## Deployment

This project is optimized for deployment on Vercel:

```bash
vercel --prod
```

## Project Structure

```
trophy-man/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and API clients
│   ├── styles/          # Global styles
│   └── types/           # TypeScript types
├── sanity/              # Sanity CMS schemas
└── public/              # Static assets
```

## License

© 2024 The Trophy Man. All rights reserved.

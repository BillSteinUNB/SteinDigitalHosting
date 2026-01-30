// Sanity GROQ Queries
// All queries for fetching data from Sanity CMS

// Hero Slides
export const heroSlidesQuery = `
  *[_type == "heroSlide" && active == true] | order(order asc) {
    _id,
    title,
    subtitle,
    image,
    ctaText,
    ctaLink,
    order
  }
`;

// Services
export const servicesQuery = `
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    shortDescription,
    startingPrice,
    icon,
    featuredImage
  }
`;

export const serviceBySlugQuery = (slug: string) => `
  *[_type == "service" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    shortDescription,
    description,
    startingPrice,
    pricingTiers,
    icon,
    featuredImage,
    gallery
  }
`;

export const allServiceSlugsQuery = `
  *[_type == "service"] {
    "slug": slug.current
  }
`;

// Gallery
export const featuredGalleryQuery = `
  *[_type == "galleryItem" && featured == true] | order(dateCreated desc)[0...12] {
    _id,
    title,
    category,
    image,
    description,
    client
  }
`;

export const galleryByCategoryQuery = (category: string) => `
  *[_type == "galleryItem" && category == "${category}"] | order(dateCreated desc) {
    _id,
    title,
    category,
    image,
    beforeImage,
    description,
    client,
    dateCreated
  }
`;

export const allGalleryQuery = `
  *[_type == "galleryItem"] | order(dateCreated desc) {
    _id,
    title,
    category,
    image,
    beforeImage,
    description,
    client,
    dateCreated
  }
`;

export const galleryCategoriesQuery = `
  *[_type == "galleryItem"] {
    category
  }
`;

// Testimonials
export const featuredTestimonialsQuery = `
  *[_type == "testimonial" && featured == true][0...5] {
    _id,
    quote,
    author,
    organization,
    role,
    image,
    rating
  }
`;

export const allTestimonialsQuery = `
  *[_type == "testimonial"] | order(rating desc) {
    _id,
    quote,
    author,
    organization,
    role,
    image,
    rating
  }
`;

// About
export const aboutQuery = `
  *[_type == "about"][0] {
    story,
    mission,
    yearsInBusiness,
    foundedYear,
    teamImage,
    exteriorImage,
    workshopImage,
    ownerName,
    ownerBio
  }
`;

// Site Settings
export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    phone,
    email,
    address,
    hours,
    socialLinks,
    googleMapsEmbed
  }
`;

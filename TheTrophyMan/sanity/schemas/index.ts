// Sanity Schema Index
// Export all schemas for Sanity configuration

import about from './about';
import service from './service';
import galleryItem from './galleryItem';
import testimonial from './testimonial';
import heroSlide from './heroSlide';
import siteSettings from './siteSettings';

export const schemaTypes = [
  // Singletons
  about,
  siteSettings,
  // Documents
  service,
  galleryItem,
  testimonial,
  heroSlide,
];

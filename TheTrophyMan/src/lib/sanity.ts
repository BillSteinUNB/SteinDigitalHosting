// Sanity Client Configuration
// Handles connection to Sanity CMS and image URL building

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});

// Image URL Builder
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper to get image URL with specific dimensions
export function getImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number
): string {
  let img = builder.image(source);
  if (width) img = img.width(width);
  if (height) img = img.height(height);
  return img.url();
}

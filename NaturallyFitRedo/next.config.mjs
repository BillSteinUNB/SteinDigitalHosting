/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Disable image optimization to load images directly
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nftest.dreamhosters.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'slategray-squirrel-389391.hostingersite.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'naturallyfit.ca',
        pathname: '/wp-content/uploads/**',
      },
      // Brand websites for fallback images
      {
        protocol: 'https',
        hostname: 'www.questnutrition.com',
        pathname: '/cdn/shop/**',
      },
      {
        protocol: 'https',
        hostname: 'row.grenade.com',
        pathname: '/cdn/shop/**',
      },
      {
        protocol: 'https',
        hostname: 'prosupps.com',
        pathname: '/cdn/shop/**',
      },
      {
        protocol: 'https',
        hostname: 'www.snickers.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cellucor.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.mammothsupplements.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      // Placeholder images for development
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

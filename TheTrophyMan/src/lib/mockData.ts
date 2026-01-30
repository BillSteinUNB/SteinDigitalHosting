// Mock Data for Demo
// Temporary mock data to bypass Sanity CMS for MVP demo

import type {
  HeroSlide,
  Service,
  GalleryItem,
  Testimonial,
  About,
  SiteSettings,
} from '@/types';

export const mockHeroSlides: HeroSlide[] = [
  {
    _id: 'slide-1',
    _type: 'heroSlide',
    title: 'Custom Trophies & Awards',
    subtitle: 'Celebrating Excellence in Oromocto Since 1998',
    image: {
      asset: { _ref: 'hero-1', _type: 'reference' },
      alt: 'Custom trophies display',
    },
    ctaText: 'View Our Work',
    ctaLink: '/gallery',
    order: 1,
    active: true,
  },
  {
    _id: 'slide-2',
    _type: 'heroSlide',
    title: 'Precision Engraving',
    subtitle: 'Personalized Awards for Every Occasion',
    image: {
      asset: { _ref: 'hero-2', _type: 'reference' },
      alt: 'Engraving work',
    },
    ctaText: 'Get a Quote',
    ctaLink: '/get-quote',
    order: 2,
    active: true,
  },
  {
    _id: 'slide-3',
    _type: 'heroSlide',
    title: 'Serving the Maritimes',
    subtitle: 'From Sports Teams to Corporate Recognition',
    image: {
      asset: { _ref: 'hero-3', _type: 'reference' },
      alt: 'Award ceremony',
    },
    ctaText: 'Our Services',
    ctaLink: '/services',
    order: 3,
    active: true,
  },
];

export const mockServices: Service[] = [
  {
    _id: 'service-1',
    _type: 'service',
    title: 'Custom Trophies',
    slug: { current: 'custom-trophies' },
    shortDescription: 'Personalized trophies for sports, corporate, and special events',
    description: 'From traditional cup trophies to modern acrylic designs, we create custom awards that perfectly represent your achievement.',
    startingPrice: '$25',
    icon: 'Trophy',
    order: 1,
  },
  {
    _id: 'service-2',
    _type: 'service',
    title: 'Engraving Services',
    slug: { current: 'engraving' },
    shortDescription: 'Precision engraving on metal, glass, wood, and more',
    description: 'Our state-of-the-art engraving equipment ensures crisp, permanent markings on virtually any material.',
    startingPrice: '$15',
    icon: 'PenTool',
    order: 2,
  },
  {
    _id: 'service-3',
    _type: 'service',
    title: 'Corporate Awards',
    slug: { current: 'corporate-awards' },
    shortDescription: 'Professional recognition awards for businesses',
    description: 'Elevate your employee recognition program with premium corporate awards and plaques.',
    startingPrice: '$45',
    icon: 'Building2',
    order: 3,
  },
  {
    _id: 'service-4',
    _type: 'service',
    title: 'Apparel & Promo',
    slug: { current: 'apparel-promo' },
    shortDescription: 'Custom branded merchandise and promotional products',
    description: 'From team jerseys to corporate gifts, we help you create lasting impressions with custom apparel and promotional items.',
    startingPrice: '$20',
    icon: 'Shirt',
    order: 4,
  },
  {
    _id: 'service-5',
    _type: 'service',
    title: 'Signs & Banners',
    slug: { current: 'signs-banners' },
    shortDescription: 'Professional signage for businesses and events',
    description: 'High-quality signs, banners, and displays for indoor and outdoor use.',
    startingPrice: '$35',
    icon: 'Signpost',
    order: 5,
  },
  {
    _id: 'service-6',
    _type: 'service',
    title: 'Plaques & Medals',
    slug: { current: 'plaques-medals' },
    shortDescription: 'Traditional recognition awards',
    description: 'Classic plaques and medals perfect for academic, military, and professional recognition.',
    startingPrice: '$18',
    icon: 'Medal',
    order: 6,
  },
];

export const mockGalleryItems: GalleryItem[] = [
  {
    _id: 'gallery-1',
    _type: 'galleryItem',
    title: 'Championship Hockey Trophy',
    category: 'sports',
    image: {
      asset: { _ref: 'gallery-1', _type: 'reference' },
      alt: 'Hockey championship trophy',
    },
    client: 'Oromocto Hockey Association',
    featured: true,
  },
  {
    _id: 'gallery-2',
    _type: 'galleryItem',
    title: 'Employee of the Month Award',
    category: 'corporate',
    image: {
      asset: { _ref: 'gallery-2', _type: 'reference' },
      alt: 'Corporate recognition plaque',
    },
    client: 'Local Business',
    featured: true,
  },
  {
    _id: 'gallery-3',
    _type: 'galleryItem',
    title: 'Team Championship Rings',
    category: 'sports',
    image: {
      asset: { _ref: 'gallery-3', _type: 'reference' },
      alt: 'Championship rings',
    },
    client: 'Baseball League',
    featured: false,
  },
  {
    _id: 'gallery-4',
    _type: 'galleryItem',
    title: 'Custom Engraved Sign',
    category: 'signs',
    image: {
      asset: { _ref: 'gallery-4', _type: 'reference' },
      alt: 'Business sign',
    },
    client: 'Local Restaurant',
    featured: true,
  },
  {
    _id: 'gallery-5',
    _type: 'galleryItem',
    title: 'Retirement Plaque',
    category: 'corporate',
    image: {
      asset: { _ref: 'gallery-5', _type: 'reference' },
      alt: 'Retirement recognition plaque',
    },
    client: 'Government Department',
    featured: false,
  },
  {
    _id: 'gallery-6',
    _type: 'galleryItem',
    title: 'Soccer Tournament Medals',
    category: 'sports',
    image: {
      asset: { _ref: 'gallery-6', _type: 'reference' },
      alt: 'Soccer medals',
    },
    client: 'Youth Soccer League',
    featured: false,
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    _id: 'testimonial-1',
    _type: 'testimonial',
    quote: 'The Trophy Man created beautiful awards for our annual golf tournament. The quality exceeded our expectations and the turnaround time was impressive!',
    author: 'Sarah Mitchell',
    organization: 'Oromocto Golf Club',
    role: 'Event Coordinator',
    rating: 5,
    featured: true,
  },
  {
    _id: 'testimonial-2',
    _type: 'testimonial',
    quote: 'We\'ve been using The Trophy Man for all our corporate recognition needs for years. Their attention to detail and customer service is outstanding.',
    author: 'Michael Chen',
    organization: 'Tech Solutions Inc.',
    role: 'HR Director',
    rating: 5,
    featured: true,
  },
  {
    _id: 'testimonial-3',
    _type: 'testimonial',
    quote: 'Fast, professional, and the engraving work is perfect. Highly recommend for any sports team or organization looking for quality awards.',
    author: 'Coach David Wilson',
    organization: 'Fredericton Minor Hockey',
    role: 'Head Coach',
    rating: 5,
    featured: true,
  },
];

export const mockAbout: About = {
  story: 'Founded in 1998, The Trophy Man has been serving Oromocto and the surrounding Maritime communities with quality trophies, awards, and engraving services. What started as a small shop has grown into a trusted name for recognition products across New Brunswick.',
  mission: 'To provide exceptional quality awards and engraving services that help organizations celebrate achievements and create lasting memories.',
  yearsInBusiness: 26,
  foundedYear: 1998,
  ownerName: 'Nick',
  ownerBio: 'With over two decades of experience in the awards industry, Nick takes pride in helping customers find the perfect way to recognize achievement.',
};

export const mockSiteSettings: SiteSettings = {
  siteName: 'The Trophy Man',
  tagline: 'Custom Trophies & Awards in Oromocto, NB',
  phone: '+1-506-357-1234',
  email: 'info@trophyman.ca',
  address: {
    street: '4 Brizley St',
    city: 'Oromocto',
    province: 'NB',
    postalCode: 'E2V 1E3',
  },
  hours: [
    { days: 'Monday - Friday', hours: '9:00 AM - 5:00 PM' },
    { days: 'Saturday', hours: '10:00 AM - 2:00 PM' },
    { days: 'Sunday', hours: 'Closed' },
  ],
  socialLinks: {
    facebook: 'https://facebook.com/trophyman',
    instagram: 'https://instagram.com/trophyman',
  },
};

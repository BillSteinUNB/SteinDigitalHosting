import type { Product, Service, GalleryItem, TeamMember, BusinessHours } from '@/types';

export const products: Product[] = [
  {
    id: 'pomade-1',
    name: 'Matte Clay Pomade',
    description: 'Strong hold, zero shine. Perfect for textured, natural looks.',
    price: 28,
    image: '/images/products/pomade.png',
    category: 'Pomades',
  },
  {
    id: 'beard-oil-1',
    name: 'Cedarwood Beard Oil',
    description: 'Nourishing blend with natural cedarwood scent.',
    price: 24,
    image: '/images/products/beard-oil.png',
    category: 'Beard',
  },
  {
    id: 'shampoo-1',
    name: 'Daily Wash Shampoo',
    description: 'Gentle cleanse for everyday use. Keeps hair fresh.',
    price: 22,
    image: '/images/products/shampoo.png',
    category: 'Hair Care',
  },
  {
    id: 'sea-salt-1',
    name: 'Sea Salt Spray',
    description: 'Beach texture and volume. Effortless style.',
    price: 18,
    image: '/images/products/sea-salt.png',
    category: 'Hair Care',
  },
];

export const services: Service[] = [
  {
    id: 'haircut',
    name: 'HAIRCUT',
    description: 'Classic cut with consultation, wash, and style',
    price: 35,
  },
  {
    id: 'skin-fade',
    name: 'SKIN FADE',
    description: 'Precision fade from skin, blended to perfection',
    price: 40,
  },
  {
    id: 'beard-trim',
    name: 'BEARD TRIM',
    description: 'Shape, line-up, and conditioning',
    price: 20,
  },
  {
    id: 'haircut-beard',
    name: 'HAIRCUT + BEARD',
    description: 'The full treatment',
    price: 50,
  },
  {
    id: 'hot-towel-shave',
    name: 'HOT TOWEL SHAVE',
    description: 'Traditional straight razor with hot towel service',
    price: 35,
  },
  {
    id: 'kids-cut',
    name: 'KIDS CUT (12 & under)',
    description: 'Patient, friendly service for the little ones',
    price: 25,
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'haircut-1',
    title: 'TEXTURED CURLS',
    image: '/images/gallery/haircut-1.png',
    category: 'Textured',
  },
  {
    id: 'haircut-2',
    title: 'MODERN QUIFF',
    image: '/images/gallery/haircut-2.png',
    category: 'Classic',
  },
  {
    id: 'haircut-3',
    title: 'SKIN FADE',
    image: '/images/gallery/haircut-3.png',
    category: 'Fades',
  },
  {
    id: 'haircut-4',
    title: 'CURLY TOP',
    image: '/images/gallery/haircut-4.png',
    category: 'Textured',
  },
  {
    id: 'haircut-5',
    title: 'BUZZ CUT',
    image: '/images/gallery/haircut-5.png',
    category: 'Classic',
  },
  {
    id: 'haircut-6',
    title: 'BOLD COLOR',
    image: '/images/gallery/haircut-6.png',
    category: 'Creative',
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: 'braeden',
    name: 'BRAEDEN',
    role: 'Founder',
    specialty: 'Master barber',
    image: '/images/team/mike.jpg',
  },
];

export const businessHours: BusinessHours[] = [
  { day: 'Monday', hours: 'CLOSED', isOpen: false },
  { day: 'Tuesday', hours: '9:00 AM – 7:00 PM', isOpen: true },
  { day: 'Wednesday', hours: '9:00 AM – 7:00 PM', isOpen: true },
  { day: 'Thursday', hours: '9:00 AM – 7:00 PM', isOpen: true },
  { day: 'Friday', hours: '9:00 AM – 7:00 PM', isOpen: true },
  { day: 'Saturday', hours: '9:00 AM – 5:00 PM', isOpen: true },
  { day: 'Sunday', hours: 'CLOSED', isOpen: false },
];

export const businessInfo = {
  name: "Cherry's Barbershop",
  address: '123 Main Street',
  city: 'Moncton, NB E1C 1A1',
  country: 'Canada',
  phone: '(506) 555-FADE',
  email: 'hello@cherrysmoncton.com',
  bookingUrl: '#booking',
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
}

export interface BusinessHours {
  day: string;
  hours: string;
  isOpen: boolean;
}

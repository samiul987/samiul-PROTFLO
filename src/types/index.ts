export interface Project {
  id: string;
  name: string;
  category: 'Client' | 'Personal';
  images: {
    col1_1: string;
    col1_2: string;
    col2: string;
  };
  liveLink?: string;
  order: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface PricingCard {
  id: string;
  title: string;
  price: string;
  features: string[];
  ctaText: string;
  ctaLink?: string;
  order: number;
  isPopular?: boolean;
}

export interface SiteSettings {
  email: string;
  phone1: string;
  phone2: string;
  twitter: string;
  instagram: string;
  whatsapp: string;
  aboutText: string;
  heroText: string;
}

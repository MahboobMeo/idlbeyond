export type PageView = 'home' | 'bootcamp';

export interface ShowcaseApp {
  id: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  mockupScreens: {
    title: string;
    description: string;
    elements: {
      type: 'header' | 'button' | 'card' | 'stat' | 'list' | 'input' | 'badge';
      text: string;
      subtext?: string;
      badge?: string;
    }[];
  }[];
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  priceFormatted: string;
  gstNote: string;
  popular?: boolean;
  timeline: string;
  features: string[];
  idealFor: string;
  ctaText: string;
}

export interface BootcampModule {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  tools: string[];
  outcomes: string[];
  deliverable: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

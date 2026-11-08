/**
 * Pricing, currency formatting and validation logic for IDLTech
 * Strictly uses 'Rs.' currency prefix (replaces ₹) and updated pricing models.
 */

export interface PriceBreakdown {
  base: number;
  gstRate: number; // e.g. 0.18 for 18%
  gstAmount: number;
  total: number;
}

export function formatPrice(amount: number): string {
  // Format with Rs. prefix and Indian comma separation
  const formatted = amount.toLocaleString('en-IN');
  return `Rs. ${formatted}`;
}

export function calculatePriceWithGST(basePrice: number, gstRatePercent: number = 18): PriceBreakdown {
  const gstRate = gstRatePercent / 100;
  const gstAmount = Math.round(basePrice * gstRate);
  const total = basePrice + gstAmount;

  return {
    base: basePrice,
    gstRate,
    gstAmount,
    total,
  };
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  budgetRange: string;
  projectDetails: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateContactForm(data: Partial<ContactSubmission>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please provide your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid business or personal email address.';
  }

  if (!data.phone || data.phone.trim().replace(/\D/g, '').length < 8) {
    errors.phone = 'Please provide a valid contact number (at least 8 digits).';
  }

  if (!data.projectDetails || data.projectDetails.trim().length < 10) {
    errors.projectDetails = 'Please share a brief summary of your project or requirements (at least 10 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface BlueprintRecommendation {
  category: string;
  recommendedStack: string[];
  timeline: string;
  basePrice: number;
  features: string[];
}

export function generateQuickBlueprint(ideaText: string): BlueprintRecommendation {
  const lower = (ideaText || '').toLowerCase();

  if (lower.includes('shop') || lower.includes('store') || lower.includes('d2c') || lower.includes('cart') || lower.includes('product')) {
    return {
      category: 'D2C Commerce & Ordering App',
      recommendedStack: ['React Native / Flutter', 'Stripe / Razorpay UPI', 'Cloud Supabase/Firebase', 'Push Notifications'],
      timeline: '5 - 7 Business Days',
      basePrice: 19999,
      features: ['Product Showcase & Inventory', 'Instant UPI / Card Checkout', 'Order Status Tracking', 'Admin Product Manager'],
    };
  }

  if (lower.includes('booking') || lower.includes('salon') || lower.includes('clinic') || lower.includes('doctor') || lower.includes('appointment')) {
    return {
      category: 'Appointment & Booking Engine',
      recommendedStack: ['Flutter / Native iOS & Android', 'Automated WhatsApp Triggers', 'Calendar Scheduling Engine'],
      timeline: '4 - 6 Business Days',
      basePrice: 19999,
      features: ['Real-Time Time-slot Selection', 'Automated WhatsApp/SMS Reminders', 'Deposit Collection', 'Staff Allocation View'],
    };
  }

  if (lower.includes('auto') || lower.includes('n8n') || lower.includes('zapier') || lower.includes('pipeline') || lower.includes('workflow')) {
    return {
      category: 'Enterprise No-Code Automation Pipeline',
      recommendedStack: ['n8n Self-Hosted / Cloud', 'Make.com Enterprise', 'OpenAI/Gemini Semantic AI Routers', 'PostgreSQL / Airtable'],
      timeline: '3 - 5 Business Days',
      basePrice: 19999,
      features: ['Multi-app Webhook Ingestion', 'AI Data Extraction & Transformation', 'Instant CRM & Slack/Email Sync', 'Fail-safe Error Logging'],
    };
  }

  // Default custom mobile app & digital system
  return {
    category: 'High-Performance Custom Mobile Application',
    recommendedStack: ['Cross-Platform Mobile App (Android + iOS)', 'Secure Cloud Backend', 'Admin Control Dashboard'],
    timeline: '5 - 7 Business Days',
    basePrice: 19999,
    features: ['High-Fidelity Interactive Screens', 'User Authentication & Profiles', 'API & Database Integration', 'App Store & Play Store Ready'],
  };
}

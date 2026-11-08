import { ShowcaseApp, PricingPlan, BootcampModule, FAQItem } from '../types';

export const HIGH_END_IMAGES = {
  heroWorkspace: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  executiveTech: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  developerSetup: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
  aiEngineeringStudio: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
  dataCenterClean: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
  bootcampInstructor: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  teamCollaboration: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
  mobileAppMock: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
  automationNodes: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
};

export const SHOWCASE_APPS: ShowcaseApp[] = [
  {
    id: 'salon-booking',
    category: 'Appointment & Booking',
    title: 'AuraSpa & LuxeCare',
    tagline: 'Customers book premium slots without another phone call.',
    description: 'Eliminates endless WhatsApp back-and-forth. Clients pick specialists, view real-time availability, pay slot deposits via instant UPI, and receive automated reminders.',
    metrics: [
      { label: 'No-Show Reduction', value: '82%' },
      { label: 'Booking Time', value: '< 45s' },
      { label: 'Staff Hours Saved', value: '18 hrs/wk' },
    ],
    features: [
      'Interactive time-slot calendar with buffer times',
      'Specialist staff profile & service add-ons',
      'Automated WhatsApp appointment confirmations',
      'Deposit collection with instant UPI & card checkout',
    ],
    mockupScreens: [
      {
        title: 'Select Service & Specialist',
        description: 'Clean service menu with duration and price breakdown.',
        elements: [
          { type: 'header', text: 'Luxe Hair Styling & Scalp Therapy', subtext: '90 mins • Level 2 Specialist' },
          { type: 'stat', text: 'Rs. 2,499', subtext: 'Deposit: Rs. 500 required' },
          { type: 'list', text: 'Stylist: Marcus Vance (4.9 ★)' },
          { type: 'list', text: 'Date: Today, 4:30 PM (Confirmed)' },
          { type: 'button', text: 'Proceed to Secure Slot (Rs. 500)' },
        ],
      },
      {
        title: 'Booking Confirmed & Reminders',
        description: 'Instant sync with client calendar and WhatsApp bot dispatch.',
        elements: [
          { type: 'header', text: 'Booking #LX-9421 Confirmed', subtext: 'Added to your Apple/Google Calendar' },
          { type: 'stat', text: 'VIP Salon Suite 4', subtext: 'Directions sent via WhatsApp' },
          { type: 'button', text: 'Reschedule or Add Guest' },
        ],
      },
    ],
  },
  {
    id: 'd2c-commerce',
    category: 'D2C Commerce & Ordering',
    title: 'Kaviar Organics',
    tagline: 'Direct mobile ordering with lightning UPI payment & zero commissions.',
    description: 'Transform an Instagram follower into a recurring direct buyer. Native product grids, 1-tap reordering, real-time dispatch tracking, and push notifications.',
    metrics: [
      { label: 'Checkout Conversion', value: '41%' },
      { label: 'Marketplace Fees Saved', value: '100%' },
      { label: 'Repeat Orders', value: '3.4x' },
    ],
    features: [
      'Fast 1-tap cart with instant UPI QR & native sheet',
      'Automated batch order printing for shipping',
      'Real-time delivery partner tracking webhook',
      'Targeted push notifications for back-in-stock alerts',
    ],
    mockupScreens: [
      {
        title: 'Curated Product Catalog',
        description: 'Rich visuals with high-speed caching and stock counters.',
        elements: [
          { type: 'header', text: 'Cold-Pressed Botanical Serum', subtext: '50ml Batch #08 — 4 Left' },
          { type: 'stat', text: 'Rs. 1,499', subtext: 'Free Express Shipping' },
          { type: 'badge', text: 'Bestseller in Skincare' },
          { type: 'button', text: '1-Click UPI Buy Now' },
        ],
      },
      {
        title: 'Order Dispatch Tracking',
        description: 'Live courier milestone progress bar.',
        elements: [
          { type: 'header', text: 'Order #ORD-7712 Shipped', subtext: 'Estimated Arrival: Tomorrow 11 AM' },
          { type: 'stat', text: 'Out for Delivery', subtext: 'Bluedart Express Courier' },
          { type: 'button', text: 'Track on Live Map' },
        ],
      },
    ],
  },
  {
    id: 'creator-academy',
    category: 'Creator & Academy',
    title: 'SkillMatrix Academy',
    tagline: 'Monetize exclusive knowledge with a dedicated learning app.',
    description: 'Bypass algorithms and rented audiences. Secure video playback with screenshot protection, module quiz progress, cohort discussion boards, and premium subscriptions.',
    metrics: [
      { label: 'Course Completion', value: '74%' },
      { label: 'Subscriber Retention', value: '88%' },
      { label: 'App Store Rating', value: '4.9 ★' },
    ],
    features: [
      'Encrypted DRM video streaming with offline caching',
      'Downloadable study notes & project files',
      'Integrated community chatroom & Q&A feed',
      'Certificate generation upon project evaluation',
    ],
    mockupScreens: [
      {
        title: 'Masterclass Module 4',
        description: 'Interactive lesson viewer with timestamped bookmarks.',
        elements: [
          { type: 'header', text: 'High-Volume Automation Workflows', subtext: 'Video 4.2 • 28 mins streaming' },
          { type: 'stat', text: '68% Completed', subtext: 'Next: Live n8n Webhook Architecture' },
          { type: 'button', text: 'Resume Playback (HD 1080p)' },
        ],
      },
    ],
  },
  {
    id: 'field-services',
    category: 'Field & Local Services',
    title: 'Apex HVAC & Tech Support',
    tagline: 'Service calls dispatched cleanly with photo audit trails.',
    description: 'Homeowners and enterprises request repairs or maintenance in seconds. Technicians receive GPS job alerts, capture before-and-after photos, and issue instant digital invoices.',
    metrics: [
      { label: 'Response Time', value: '14 min' },
      { label: 'Invoice Collection', value: 'Instant' },
      { label: 'First-Call Resolution', value: '91%' },
    ],
    features: [
      'Photo and audio note upload for precise diagnosis',
      'Live technician GPS en-route tracking',
      'Digital sign-off and on-spot invoice generation',
      'Quarterly maintenance contract renewals',
    ],
    mockupScreens: [
      {
        title: 'Dispatch & Technician Status',
        description: 'Real-time assignment and route status.',
        elements: [
          { type: 'header', text: 'Technician En Route: Sarah Jenkins', subtext: 'Apex Senior Field Specialist' },
          { type: 'stat', text: 'ETA: 12 Minutes', subtext: 'Van #04 carrying full diagnostics' },
          { type: 'button', text: 'Call Technician via Secure Mask' },
        ],
      },
    ],
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'launch',
    name: 'Launch Tier',
    tagline: 'The essential production app shipped fast to prove your market.',
    price: 19999,
    priceFormatted: 'Rs. 19,999',
    gstNote: '+ 18% GST (Rs. 3,600) = Rs. 23,599 all-inclusive',
    timeline: '5 - 7 Business Days',
    idealFor: 'Startups, boutique stores, creators, and single-purpose service businesses.',
    ctaText: 'Build Launch App — Rs. 19,999',
    features: [
      'Native Android & iOS mobile applications',
      'Up to 6 custom high-fidelity screens',
      'Payment gateway (UPI, Cards, NetBanking)',
      'Direct customer WhatsApp click-to-chat integration',
      'Admin web panel for content & product updates',
      'Google Play Store & Apple App Store readiness checklist',
      'Free 30-day post-launch technical warranty',
    ],
  },
  {
    id: 'growth',
    name: 'Growth & Automation',
    tagline: 'Full-featured app integrated with autonomous backend workflows.',
    price: 39999,
    priceFormatted: 'Rs. 39,999',
    gstNote: '+ 18% GST (Rs. 7,200) = Rs. 47,199 all-inclusive',
    popular: true,
    timeline: '10 - 14 Business Days',
    idealFor: 'Growing D2C brands, booking chains, academies, and multi-staff teams.',
    ctaText: 'Start Growth Tier — Rs. 39,999',
    features: [
      'Everything in Launch, plus unlimited user accounts',
      'Automated No-Code Pipelines (n8n/Make for CRM & billing)',
      'Automated push notifications & SMS alerts',
      'Real-time customer database (Supabase/Postgres)',
      'Multi-role staff access (Admin, Operator, Customer)',
      'Analytics dashboard (Revenue, active users, funnel)',
      'Assisted Store Review & Publishing management',
      'Priority 60-day engineering care plan',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Custom',
    tagline: 'Custom architectures, heavy AI agents, and scaled infrastructure.',
    price: 79999,
    priceFormatted: 'Rs. 79,999',
    gstNote: '+ 18% GST = Rs. 94,399 all-inclusive',
    timeline: '3 - 4 Weeks',
    idealFor: 'High-volume marketplaces, corporate field fleets, and AI-first platforms.',
    ctaText: 'Consult on Enterprise — Rs. 79,999',
    features: [
      'Bespoke multi-platform ecosystem (Mobile + Web portal)',
      'Custom Gemini & OpenAI Agentic workflows',
      'Complex role-based access control (RBAC)',
      'Dedicated high-throughput cloud database cluster',
      'Custom third-party ERP/SAP/Zoho integrations',
      'SLA guarantee with 24/7 incident response hotline',
      'Full source code repository handover & IP transfer',
    ],
  },
];

export const BOOTCAMP_CURRICULUM: BootcampModule[] = [
  {
    id: 1,
    title: 'The Modern No-Code Automation Architecture',
    subtitle: 'From fragmented manual labor to autonomous enterprise engines',
    duration: 'Week 1 · 3 Hours Live + Studio Labs',
    tools: ['n8n Self-Hosted', 'Make.com', 'Zapier Enterprise', 'Postman'],
    outcomes: [
      'Master the blueprint of enterprise automation stacks',
      'Understand synchronous vs asynchronous webhook execution',
      'Configure self-hosted n8n instances on modern cloud VPS',
      'Implement payload validation and secure API keys',
    ],
    deliverable: 'A live operational n8n / Make server environment ready to ingest enterprise traffic.',
  },
  {
    id: 2,
    title: 'APIs, Webhooks & Complex Data Transformations',
    subtitle: 'Connecting disparate tools without writing traditional code',
    duration: 'Week 2 · 3 Hours Live + Studio Labs',
    tools: ['REST APIs', 'JSON Payloads', 'Webhook Triggers', 'Airtable', 'Supabase'],
    outcomes: [
      'Parse complex nested JSON arrays effortlessly using visual mappings',
      'Handle pagination, rate limits, and token refreshes without code',
      'Synchronize databases bi-directionally between Airtable, Postgres, and Sheets',
      'Implement data deduplication and idempotency safeguards',
    ],
    deliverable: 'A multi-tool bi-directional syncing pipeline that synchronizes customer records across CRM and database in real-time.',
  },
  {
    id: 3,
    title: 'AI Agentic Workflows with Gemini & OpenAI APIs',
    subtitle: 'Injecting machine intelligence into autonomous pipelines',
    duration: 'Week 3 · 3 Hours Live + Studio Labs',
    tools: ['Gemini 2.5 Flash', 'OpenAI Structured Outputs', 'Vector Embeddings', 'Slack / WhatsApp Bots'],
    outcomes: [
      'Build zero-shot AI classification nodes that route incoming customer requests',
      'Extract unstructured invoices, receipts, and PDF contracts into clean database rows',
      'Create an autonomous AI customer support triage engine with fallback to human agents',
      'Implement guardrails, token budget controls, and prompt caching',
    ],
    deliverable: 'An AI-powered document processing & triage pipeline that saves 20+ human hours per week.',
  },
  {
    id: 4,
    title: 'High-Reliability Enterprise Guardrails & Error Handling',
    subtitle: 'Building mission-critical pipelines that never fail silently',
    duration: 'Week 4 · 3 Hours Live + Studio Labs',
    tools: ['Dead Letter Queues', 'Fallback Triggers', 'Discord/Telegram Alerts', 'Sentry Webhooks'],
    outcomes: [
      'Architect robust error routers that capture and retry transient network hiccups',
      'Send immediate visual alerts to engineering channels when external APIs fail',
      'Set up staging vs production workflow environments for zero-downtime updates',
      'Audit log creation for enterprise compliance and security review',
    ],
    deliverable: 'A fault-tolerant queue engine with automated retry mechanisms and real-time failure alerting.',
  },
  {
    id: 5,
    title: 'Capstone: End-to-End Autonomous Business Engine',
    subtitle: 'Build and deploy a full client operations system live',
    duration: 'Week 5 · 4 Hours Live Buildathon',
    tools: ['Full Automation Suite', 'Stripe / Razorpay UPI', 'Cal.com', 'Resend', 'Slack'],
    outcomes: [
      'Automate the complete customer lifecycle from ad click to contract signature',
      'Generate dynamic PDF invoices and contracts on the fly with custom signatures',
      'Trigger multi-channel onboarding sequences across WhatsApp, Email, and SMS',
      'Live stress test with concurrent simulated webhook events',
    ],
    deliverable: 'A production-grade Autonomous Business Engine running live in front of the cohort.',
  },
  {
    id: 6,
    title: 'Monetization, High-Ticket Retainers & Agency Scaling',
    subtitle: 'Selling automation solutions for Rs. 50,000+ per client',
    duration: 'Week 6 · 2 Hours Strategy & Pitch Decks',
    tools: ['Client Discovery Frameworks', 'ROI Calculators', 'Proposal Blueprints', 'Retainer Contracts'],
    outcomes: [
      'Package no-code automation audits that clients gladly pay Rs. 15,000 to receive',
      'Price monthly retainer agreements for continuous pipeline maintenance (Rs. 30,000 - Rs. 80,000/mo)',
      'Use the IDLTech partner pipeline to source verified business client leads',
      'Pitch non-technical executives using business ROI instead of software jargon',
    ],
    deliverable: 'A ready-to-send proposal deck and signed-contract template for your first high-ticket automation retainer.',
  },
];

export const GENERAL_FAQS: FAQItem[] = [
  {
    question: 'How fast will my mobile app or automation pipeline be ready?',
    answer: 'Our Launch Tier apps are delivered in 5 to 7 business days. Complex Growth apps take 10 to 14 days, and enterprise automation pipelines are typically configured in 3 to 5 business days. Because we use a modern AI-accelerated studio framework, we skip the bloated multi-month agency delays without sacrificing native performance.',
  },
  {
    question: 'What is included in the Rs. 19,999 Launch Tier price?',
    answer: 'The Rs. 19,999 price includes your initial consultation blueprint, up to 6 custom high-fidelity mobile screens, Android and iOS production builds, payment gateway integration (UPI and Cards), WhatsApp support action, admin panel setup, and full store readiness checks. There are no hidden setup fees.',
  },
  {
    question: 'Do I own 100% of my application and data?',
    answer: 'Yes, completely. Unlike SaaS website builders that trap you inside recurring proprietary systems, IDLTech delivers your application and workflows with 100% intellectual property ownership belonging to your business.',
  },
  {
    question: 'What are the applicable taxes and billing terms?',
    answer: 'All pricing is quoted in Indian Rupees (Rs.) net of standard 18% GST. A valid tax invoice with your company GSTIN is provided for business input tax credit. Payment is split into transparent milestones.',
  },
  {
    question: 'Do I need any technical coding knowledge to work with IDLTech?',
    answer: 'None whatsoever. IDLTech operates as a full done-for-you studio. You explain your business goals, customer flows, or workflow pain points in plain English, and our engineering team handles architecture, design, security, and launch.',
  },
  {
    question: 'How does the No-Code Automation Bootcamp differ from the App Studio?',
    answer: 'The App Studio is our done-for-you service where we build and deploy apps for your business. The No-Code Bootcamp is our high-intensity, hands-on training program where business owners, consultants, and developers learn how to build enterprise automation pipelines using tools like n8n, Make, Zapier, and Gemini AI.',
  },
];

export const BOOTCAMP_FAQS: FAQItem[] = [
  {
    question: 'Do I need coding experience or computer science background?',
    answer: 'No coding experience is required. The masterclass is structured from ground up for consultants, operations managers, entrepreneurs, and tech enthusiasts. You only need a modern laptop, internet connection, and logical problem-solving interest.',
  },
  {
    question: 'Why focus strictly on no-code automation tools rather than basic website builders?',
    answer: 'Basic landing pages have become commoditized. The real high-value problem modern businesses face is fragmented operations—connecting CRM, payments, customer messaging, and AI processing into autonomous pipelines. Learning tools like n8n, Make, and Zapier lets you solve high-ticket problems and charge Rs. 50,000+ retainers.',
  },
  {
    question: 'What is the 100% Live Build Guarantee?',
    answer: 'If you attend the sessions, follow the hands-on labs, and are unable to build and deploy a functioning automated pipeline, we will refund your entire Rs. 19,999 tuition fee with zero questions asked.',
  },
  {
    question: 'Are sessions recorded if I miss a live cohort call?',
    answer: 'Yes. Every live masterclass is recorded in full 1080p HD, cataloged with chapter timestamps, and made accessible in your student portal with lifetime access to materials, templates, and webhook blueprints.',
  },
];

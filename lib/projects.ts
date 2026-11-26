/**
 * ─────────────────────────────────────────────────────────────
 *  SHOWCASE DATA — add, edit or replace projects here.
 *  All current entries are CONCEPT projects (placeholders).
 *
 *  To use a real screenshot/GIF, drop files in /public/projects/
 *  and set `media.desktop`, `media.mobile` or `media.gif`
 *  (e.g. "/projects/aurelle-desktop.webp"). When media is
 *  missing, a generated mockup using `theme` is rendered instead.
 * ─────────────────────────────────────────────────────────────
 */

export const categories = ["All", "Business", "SaaS", "E-commerce", "Portfolio", "Landing Pages", "Creative"] as const;
export type Category = (typeof categories)[number];

export type MockLayout = "fashion" | "saas" | "coffee" | "estate" | "portfolio" | "startup";

export type Project = {
  slug: string;
  title: string;
  category: Exclude<Category, "All">;
  industry: string;
  type: string;
  year: string;
  concept: boolean;
  summary: string;
  description: string;
  designNotes: string[];
  features: string[];
  technologies: string[];
  liveUrl?: string;
  media?: { desktop?: string; mobile?: string; gif?: string; gallery?: string[] };
  theme: {
    layout: MockLayout;
    bg: string;
    ink: string;
    accent: string;
    soft: string;
    headline: string;
    brand: string;
  };
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "bsm-security-agency",
    title: "BSM Security Agency",
    category: "Business",
    industry: "Security Services",
    type: "Business website",
    year: "2026",
    concept: false,
    summary: "A bold, trust-first website for a Goa-based private security agency.",
    description:
      "A business website for BSM Security Agency in Goa — a private security provider serving resorts, gated communities, corporate offices, industrial estates and events. The site leads with credibility: experienced leadership, trained personnel and written deployment plans, with fast paths to request security or call the team.",
    designNotes: [
      "Dark, premium interface with warm gold accents that signal authority",
      "Editorial headline with a hand-written accent on “Trust.”",
      "Credibility stats and operating principles surfaced above the fold",
    ],
    features: [
      "Request-security and click-to-call CTAs throughout",
      "WhatsApp quick contact",
      "Service categories matched to site types",
      "Branch, clients and gallery sections",
      "Mobile-first navigation",
    ],
    technologies: ["Custom build", "Responsive design", "Performance-focused"],
    liveUrl: "https://bsmsecurityagency.com",
    media: {
      desktop: "/projects/bsm-desktop.webp",
      mobile: "/projects/bsm-mobile.webp",
      gallery: ["/projects/bsm-section-2.webp", "/projects/bsm-section-3.webp"],
    },
    theme: { layout: "startup", bg: "#0B0B0C", ink: "#F2EEE6", accent: "#D4A65A", soft: "#2A241A", headline: "Building Trust.", brand: "BSM" },
    featured: true,
  },
  {
    slug: "maison-aurelle",
    title: "Maison Aurelle",
    category: "E-commerce",
    industry: "Luxury Fashion",
    type: "E-commerce storefront",
    year: "2026",
    concept: true,
    summary: "An editorial storefront concept for a quiet-luxury fashion label.",
    description:
      "A concept storefront where products are presented like a printed lookbook. Generous whitespace, slow reveals and an unhurried checkout journey reflect the label's quiet-luxury positioning.",
    designNotes: [
      "Editorial serif headlines paired with a restrained grotesk",
      "Product imagery framed like magazine spreads",
      "A muted ivory and ink palette with one warm accent",
    ],
    features: ["Lookbook-style collections", "Quick-view product drawer", "Size guide modal", "Mobile-first checkout flow"],
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Shopify (concept)"],
    theme: { layout: "fashion", bg: "#F3EEE7", ink: "#1E1B18", accent: "#B4835B", soft: "#E2D7CA", headline: "Quiet Luxury", brand: "AURELLE" },
    featured: true,
  },
  {
    slug: "flowboard",
    title: "Flowboard",
    category: "SaaS",
    industry: "Productivity Software",
    type: "SaaS landing page",
    year: "2026",
    concept: true,
    summary: "A conversion-focused landing page for a team productivity dashboard.",
    description:
      "A concept SaaS landing page that explains a complex product in seconds. Live-feeling dashboard previews, crisp feature storytelling and a clear trial CTA keep visitors moving toward signup.",
    designNotes: [
      "Product UI used as the hero illustration",
      "Feature sections built around real workflows",
      "Indigo and electric-blue palette for a focused feel",
    ],
    features: ["Interactive dashboard preview", "Pricing comparison table", "Integration grid", "Trial signup flow"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
    theme: { layout: "saas", bg: "#0F1638", ink: "#EEF1FF", accent: "#7091E6", soft: "#1C2659", headline: "Work, in flow.", brand: "flowboard" },
    featured: true,
  },
  {
    slug: "ember-roast",
    title: "Ember & Roast",
    category: "Business",
    industry: "Specialty Coffee",
    type: "Brand website",
    year: "2026",
    concept: true,
    summary: "A warm, tactile brand site for a specialty coffee roaster.",
    description:
      "A concept website for an independent roastery, balancing storytelling about origin and process with a simple path to subscriptions and café locations.",
    designNotes: [
      "Warm roasted tones with a cream base",
      "Large type and hand-drawn feeling dividers",
      "Origin stories presented as scrolling chapters",
    ],
    features: ["Origin storytelling", "Subscription plans", "Café locator", "Brewing guides"],
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
    theme: { layout: "coffee", bg: "#2B1A12", ink: "#F5E9DC", accent: "#E08A4B", soft: "#4A2E21", headline: "Slow roasted.", brand: "EMBER & ROAST" },
    featured: true,
  },
  {
    slug: "arden-residences",
    title: "Arden Residences",
    category: "Landing Pages",
    industry: "Real Estate",
    type: "Property launch landing page",
    year: "2026",
    concept: true,
    summary: "An architectural launch page for a premium residential project.",
    description:
      "A concept launch page for a residential development. Architecture-led visuals, floor-plan explorers and a site-visit booking form turn interest into qualified leads.",
    designNotes: [
      "Architectural grid echoing building elevations",
      "Stone, sage and charcoal palette",
      "Calm pacing with large imagery and short copy",
    ],
    features: ["Floor-plan explorer", "Amenities gallery", "Location map section", "Site-visit booking form"],
    technologies: ["Next.js", "Tailwind CSS", "GSAP ScrollTrigger"],
    theme: { layout: "estate", bg: "#E7E9E3", ink: "#1F2622", accent: "#5E7563", soft: "#CDD3CA", headline: "Live above.", brand: "ARDEN" },
    featured: true,
  },
  {
    slug: "studio-noor",
    title: "Studio Noor",
    category: "Portfolio",
    industry: "Photography",
    type: "Creative portfolio",
    year: "2026",
    concept: true,
    summary: "A bold, image-first portfolio for an independent photographer.",
    description:
      "A concept portfolio that gets out of the way of the work. Full-bleed galleries, keyboard-friendly navigation and a minimal enquiry flow for commissions.",
    designNotes: [
      "Image-first grid with editorial captions",
      "High-contrast monochrome interface",
      "Oversized index numbers for navigation",
    ],
    features: ["Full-screen gallery", "Project index", "Commission enquiry form", "Fast image loading"],
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
    theme: { layout: "portfolio", bg: "#111111", ink: "#F2F2F2", accent: "#D6FF5C", soft: "#262626", headline: "Light / Form", brand: "NOOR" },
  },
  {
    slug: "kinetic-labs",
    title: "Kinetic Labs",
    category: "Creative",
    industry: "Technology Startup",
    type: "Startup website",
    year: "2026",
    concept: true,
    summary: "An energetic website for a deep-tech startup's public launch.",
    description:
      "A concept website for an early-stage technology startup. Expressive gradients, motion-led storytelling and a clear investor and careers path.",
    designNotes: [
      "Gradient orbs and kinetic typography",
      "Dark interface with a periwinkle glow",
      "Modular sections for product, team and careers",
    ],
    features: ["Animated product story", "Team & careers pages", "Investor contact", "Press kit download"],
    technologies: ["Next.js", "Three.js", "Tailwind CSS", "GSAP"],
    theme: { layout: "startup", bg: "#EDE8F5", ink: "#1A1F45", accent: "#3D52A0", soft: "#ADBDDA", headline: "Built for what's next.", brand: "kinetic" },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

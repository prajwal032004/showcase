/**
 * ─────────────────────────────────────────────────────────────
 *  STUDIO IDENTITY — change the brand here and it updates everywhere.
 * ─────────────────────────────────────────────────────────────
 */
export const site = {
  name: "Forma Studio",
  shortName: "Forma",
  /** Used in the logo wordmark */
  wordmark: "FORMA",
  wordmarkSuffix: "STUDIO",
  tagline: "Independent digital studio",
  description:
    "Forma Studio is an independent web design & development studio crafting custom, high-performance websites that help brands stand out, build trust and turn visitors into customers.",
  /** Set NEXT_PUBLIC_SITE_URL in production */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.formastudio.example").replace(/\/$/, ""),
  /** Set NEXT_PUBLIC_STUDIO_EMAIL — the contact form opens Gmail addressed to this inbox */
  email: process.env.NEXT_PUBLIC_STUDIO_EMAIL || "hello@formastudio.example",
  phone: "", // e.g. "+91 00000 00000" — leave empty to hide
  location: "India · Working worldwide", // placeholder
  locale: "en_IN",
  themeColor: "#3D52A0",
  availability: "Available for select projects",
  founded: "2026",
  legal: {
    effectiveDate: "[EFFECTIVE DATE]",
    jurisdiction: "[JURISDICTION]",
    entityName: "[LEGAL ENTITY NAME]",
  },
} as const;

export const socials = [
  { label: "Instagram", short: "IG", href: "https://instagram.com/" },
  { label: "LinkedIn", short: "IN", href: "https://www.linkedin.com/" },
  { label: "Dribbble", short: "DR", href: "https://dribbble.com/" },
  { label: "GitHub", short: "GH", href: "https://github.com/" },
] as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Showcase", href: "/showcase" },
  { label: "Contact", href: "/contact" },
] as const;

export const legalNav = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
] as const;

export const pricing = {
  currency: "INR",
  symbol: "₹",
  startingPrice: 15000,
  startingPriceLabel: "₹15,000",
  summary: "Thoughtfully designed and professionally built websites starting at ₹15,000.",
  included: [
    "A professionally designed, custom website",
    "Up to approximately 5 core pages, depending on scope",
    "Homepage, About, Services and Contact pages",
    "Responsive layouts for mobile, tablet and desktop",
    "Basic on-page SEO setup",
    "Working contact form",
    "Social media links",
    "Tasteful, performance-friendly animations",
    "Deployment assistance",
  ],
  notIncluded: [
    "Domain registration and renewal",
    "Hosting plans and server costs",
    "Paid themes, plugins, fonts or stock assets",
    "Paid third-party integrations and platform fees",
    "Backend development of any kind (servers, databases, logins, dashboards, APIs)",
    "Additional pages or features beyond the agreed scope",
  ],
  fineprint:
    "Exact deliverables, page count, integrations and scope are confirmed in writing before work begins. Hosting, domain and paid third-party services are paid directly by you. We are a design & frontend studio — we do not provide backend services.",
  noBackend:
    "We focus on design and frontend development. We do not build or maintain backends — no custom servers, databases, user logins, admin dashboards or APIs. Where a site needs this kind of functionality, we can recommend trusted third-party tools (for example Shopify for stores or a booking service for appointments) and integrate them on the frontend.",
  /** Dummy breakdown — edit amounts freely; they should add up to startingPrice. */
  breakdown: [
    {
      id: "consult",
      label: "Discovery & consultation",
      amount: 1000,
      color: "#ADBDDA",
      details: ["Kick-off call to understand your business and goals", "Sitemap and page plan", "Written scope and timeline"],
    },
    {
      id: "domain",
      label: "Domain consultation & GoDaddy guidance",
      amount: 1500,
      color: "#8697C4",
      provider: "GoDaddy",
      details: [
        "Help choosing a short, brandable name and the right extension (.com / .in)",
        "Step-by-step walkthrough to buy it on GoDaddy in your own name",
        "Which add-ons you can safely skip",
        "Secure access setup so we can connect it without your password",
      ],
    },
    {
      id: "email",
      label: "Business email setup & handover",
      amount: 2000,
      color: "#7091E6",
      details: ["Professional address on your domain (e.g. hello@yourbrand.com)", "DNS records configured (MX, SPF, DKIM) for reliable delivery", "Mailbox handed over with login guidance for phone and desktop"],
    },
    {
      id: "design",
      label: "UI/UX design (up to ~5 pages)",
      amount: 4000,
      color: "#5A72C8",
      details: ["Layout and content hierarchy for each page", "Visual design matched to your brand", "Mobile, tablet and desktop layouts"],
    },
    {
      id: "build",
      label: "Frontend development & responsive build",
      amount: 4500,
      color: "#3D52A0",
      details: ["Fast, modern frontend build", "Contact form and social links", "Tasteful animations", "Cross-browser and device testing"],
    },
    {
      id: "seo",
      label: "Basic SEO setup",
      amount: 1000,
      color: "#2E3F80",
      details: ["Page titles, descriptions and social previews", "Sitemap and robots", "Google Search Console submission"],
    },
    {
      id: "launch",
      label: "Deployment & launch",
      amount: 1000,
      color: "#161B3F",
      details: ["Deployment to your hosting", "Domain connection and SSL check", "Final review and handover"],
    },
  ],
  thirdParty: [
    { label: "Domain name", note: "Paid directly to GoDaddy (yearly). Price depends on the name and extension." },
    { label: "Email mailbox plan", note: "Paid directly to your email provider if a paid plan is chosen." },
    { label: "Hosting", note: "Many small sites can run on free or low-cost hosting tiers; we advise on the best fit." },
  ],
  domainGuide: [
    { title: "Search your name", text: "Go to godaddy.com and search for the name you want. Try a couple of variations." },
    { title: "Pick the extension", text: "Choose .com for global reach or .in for an Indian audience. Avoid hyphens and numbers." },
    { title: "Skip the extras", text: "You usually don't need extra add-ons offered at checkout. We'll tell you exactly which ones to skip." },
    { title: "Buy in your name", text: "Create the account with your own email and pay. The domain is always registered to you." },
    { title: "Share access safely", text: "Use GoDaddy's delegate access to invite us. Never share your password." },
  ],
} as const;

export const hero = {
  status: "Independent digital studio · Available for select projects",
  headline: ["We build digital", "experiences that make", "brands impossible", "to ignore."],
  sub: "We design and build thoughtful, high-performance websites that help businesses stand out, build trust and turn visitors into customers.",
} as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path === "/" ? "" : path}`;
}

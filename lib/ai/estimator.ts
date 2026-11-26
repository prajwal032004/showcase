/**
 * ─────────────────────────────────────────────────────────────
 *  FORMA PROJECT ANALYZER — runs 100% in the browser.
 *  Reads a free-text project description, detects project type,
 *  industry, features and page count, then produces a scoped
 *  recommendation with an indicative price range and timeline.
 *  Tune prices / rules here; they are estimates, not quotes.
 * ─────────────────────────────────────────────────────────────
 */
import { pricing } from "@/lib/site";
import { budgets, timelines } from "@/lib/inquiry";

type Feature = { id: string; label: string; re: RegExp; cost: number; days: number; weight: number; note?: string };

const FEATURES: Feature[] = [
  { id: "shop", label: "Online store & product catalogue", re: /\b(e-?commerce|shop|store|sell(ing)?|products?|cart|checkout|shopify|woocommerce|inventory|catalog(ue)?)\b/, cost: 25000, days: 10, weight: 30 },
  { id: "payments", label: "Online payments", re: /\b(payments?|razorpay|stripe|upi|paypal|pay online|gateway)\b/, cost: 8000, days: 3, weight: 12, note: "Gateway fees are charged by the provider." },
  { id: "booking", label: "Bookings / appointments", re: /\b(book(ing)?s?|appointments?|reservations?|schedul(e|ing)|calendar|slots?)\b/, cost: 8000, days: 4, weight: 14 },
  { id: "blog", label: "Blog / editable content (CMS)", re: /\b(blog|articles?|news|cms|posts?|update (the )?(content|site) (myself|ourselves)|edit (it )?myself)\b/, cost: 6000, days: 3, weight: 10 },
  { id: "i18n", label: "Multiple languages", re: /\b(multi-?lingual|languages?|hindi|kannada|marathi|tamil|telugu|arabic|french|translations?)\b/, cost: 7000, days: 3, weight: 12 },
  { id: "gallery", label: "Gallery / portfolio showcase", re: /\b(gallery|photos?|images?|portfolio|lookbook|videos?)\b/, cost: 3000, days: 1, weight: 5 },
  { id: "accounts", label: "User accounts / dashboard", re: /\b(log ?in|sign ?up|accounts?|members?(hip)?|dashboard|portal|user profiles?|admin panel)\b/, cost: 30000, days: 12, weight: 35, note: "Logins and dashboards need a backend, which we do not provide — we can suggest third-party tools or a frontend-only alternative." },
  { id: "motion", label: "Premium animations / 3D", re: /\b(animations?|animated|3d|three\.?js|interactive|parallax|motion)\b/, cost: 6000, days: 3, weight: 10 },
  { id: "maps", label: "Maps & locations", re: /\b(maps?|locations?|branches|directions|store locator)\b/, cost: 1500, days: 1, weight: 3 },
  { id: "integrations", label: "Third-party integrations", re: /\b(crm|api|whatsapp|newsletter|mailchimp|hubspot|zoho|integrat(e|ion)s?|google sheets?)\b/, cost: 5000, days: 2, weight: 10 },
  { id: "seo", label: "Advanced SEO setup", re: /\b(advanced seo|rank(ing)? (higher|on google)|seo strategy|local seo)\b/, cost: 4000, days: 2, weight: 6 },
  { id: "forms", label: "Enquiry / lead forms", re: /\b(forms?|enquir(y|ies)|inquir(y|ies)|leads?|quote requests?|contact)\b/, cost: 0, days: 0, weight: 2 },
];

const INDUSTRIES: { id: string; label: string; re: RegExp; pages: string[] }[] = [
  { id: "food", label: "Restaurant / café", re: /\b(restaurant|caf[eé]|bakery|coffee|food|kitchen|bar|dining|cloud kitchen)\b/, pages: ["Menu", "Reservations", "Gallery"] },
  { id: "health", label: "Healthcare", re: /\b(clinic|doctor|dental|hospital|health|physio|therapy|wellness)\b/, pages: ["Treatments", "Doctors", "Appointments"] },
  { id: "realestate", label: "Real estate", re: /\b(real estate|property|properties|apartments?|villas?|builder|realtor)\b/, pages: ["Listings", "Amenities", "Site visit"] },
  { id: "beauty", label: "Salon / beauty", re: /\b(salon|spa|beauty|makeup|barber|nails?)\b/, pages: ["Services & prices", "Gallery", "Book now"] },
  { id: "fitness", label: "Fitness", re: /\b(gym|fitness|yoga|trainer|crossfit|studio classes)\b/, pages: ["Classes", "Trainers", "Membership"] },
  { id: "education", label: "Education", re: /\b(school|college|coaching|academy|courses?|tutors?|institute|classes)\b/, pages: ["Courses", "Faculty", "Admissions"] },
  { id: "saas", label: "SaaS / tech startup", re: /\b(saas|startup|app|software|platform|ai product|tech)\b/, pages: ["Features", "Pricing", "Integrations"] },
  { id: "fashion", label: "Fashion / retail", re: /\b(fashion|clothing|apparel|boutique|jewell?ery|shoes|brand)\b/, pages: ["Collections", "Lookbook", "Stockists"] },
  { id: "creative", label: "Creative / personal brand", re: /\b(photographer|artist|designer|musician|creator|freelancer|personal brand|resume|cv)\b/, pages: ["Work", "About me", "Commissions"] },
  { id: "hospitality", label: "Hospitality / travel", re: /\b(hotel|resort|homestay|travel|tours?|villa stay)\b/, pages: ["Rooms", "Experiences", "Book a stay"] },
  { id: "services", label: "Professional services", re: /\b(law(yer)?|legal|consult(ing|ant)|accounting|ca firm|agency|architect|interior)\b/, pages: ["Services", "Case studies", "Team"] },
  { id: "ngo", label: "Non-profit", re: /\b(ngo|non-?profit|charity|foundation|trust)\b/, pages: ["Our cause", "Impact", "Donate"] },
];

export type Estimate = {
  type: string;
  industry?: string;
  features: { id: string; label: string; note?: string }[];
  pages: string[];
  pageCount: number;
  low: number;
  high: number;
  weeks: [number, number];
  complexity: number;
  complexityLabel: "Simple" | "Moderate" | "Advanced" | "Complex";
  budgetOption: string;
  timelineOption: string;
  confidence: number;
  summary: string;
  notes: string[];
};

const roundK = (n: number) => Math.round(n / 1000) * 1000;
export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function hasProjectSignal(text: string) {
  const t = text.toLowerCase();
  const f = FEATURES.filter((x) => x.re.test(t)).length;
  const i = INDUSTRIES.some((x) => x.re.test(t));
  const intent = /\b(need|want|looking for|build|create|make|planning|require)\b.*\b(website|site|store|page|app|portfolio|shop)\b/.test(t);
  return intent || f >= 2 || (i && /\b(website|site|for (my|our))\b/.test(t));
}

export function analyzeProject(raw: string): Estimate {
  const t = ` ${raw.toLowerCase().replace(/\s+/g, " ")} `;

  // Project type
  let type = "Business website";
  if (/\b(landing page|single page|one page|one-page|campaign|launch page|waitlist)\b/.test(t)) type = "Landing page";
  if (/\b(portfolio|photographer|artist|personal (brand|website)|resume|cv)\b/.test(t)) type = "Portfolio";
  if (/\b(e-?commerce|online store|shop|sell (my |our )?products|shopify|woocommerce)\b/.test(t)) type = "E-commerce";
  if (/\b(redesign|revamp|outdated|old website|existing (website|site)|refresh|rebuild)\b/.test(t)) type = "Website redesign";
  if (/\b(web ?app|saas platform|dashboard|portal|log ?in|sign ?up|user accounts?)\b/.test(t)) type = "Web application";

  const industry = INDUSTRIES.find((i) => i.re.test(t));
  const features = FEATURES.filter((f) => f.re.test(t) && !(f.id === "shop" && type !== "E-commerce" && !/\b(sell|cart|checkout|products)\b/.test(t)));

  // Pages
  const pageMatch = t.match(/(\d{1,2})\s*(-|to)?\s*(\d{1,2})?\s*pages?/);
  const core = type === "Landing page" ? ["Single landing page"] : ["Home", "About", "Services", "Contact"];
  const extra = industry && type !== "Landing page" ? industry.pages : [];
  const featurePages: string[] = [];
  if (features.some((f) => f.id === "blog")) featurePages.push("Blog");
  if (features.some((f) => f.id === "shop")) featurePages.push("Shop", "Product pages", "Cart & checkout");
  const pages = Array.from(new Set([...core, ...extra, ...featurePages]));
  let pageCount = pageMatch ? Math.max(1, parseInt(pageMatch[3] || pageMatch[1], 10)) : pages.length;
  if (type === "Landing page" && !pageMatch) pageCount = 1;

  // Price model (indicative)
  const base = type === "Web application" ? 60000 : pricing.startingPrice;
  const includedPages = type === "Landing page" ? 1 : 5;
  const extraPages = Math.max(0, pageCount - includedPages);
  const featureCost = features.reduce((s, f) => s + f.cost, 0);
  const total = base + extraPages * 2000 + featureCost;
  const low = roundK(total);
  const high = roundK(total * 1.35 + 3000);

  // Timeline
  const baseDays = type === "Landing page" ? 7 : type === "Web application" ? 30 : 12;
  const days = baseDays + features.reduce((s, f) => s + f.days, 0) + extraPages;
  const wLow = Math.max(1, Math.round(days / 6));
  const wHigh = Math.max(wLow + 1, Math.round((days * 1.4) / 6));

  // Complexity
  const complexity = Math.min(100, 12 + features.reduce((s, f) => s + f.weight, 0) + extraPages * 3 + (type === "Web application" ? 30 : 0));
  const complexityLabel = complexity < 30 ? "Simple" : complexity < 55 ? "Moderate" : complexity < 80 ? "Advanced" : "Complex";

  const budgetOption =
    high <= 25000 ? budgets[0] : high <= 50000 ? budgets[1] : high <= 100000 ? budgets[2] : budgets[3];
  const timelineOption = wHigh <= 2 ? timelines[1] : wHigh <= 4 ? timelines[2] : wHigh <= 12 ? timelines[3] : timelines[4];

  const signals = features.length + (industry ? 1 : 0) + (pageMatch ? 1 : 0) + (type !== "Business website" ? 1 : 0);
  const confidence = Math.min(0.95, 0.35 + signals * 0.12 + Math.min(0.2, raw.length / 600));

  const notes: string[] = [];
  features.forEach((f) => f.note && notes.push(f.note));
  if (type === "E-commerce") notes.push("Platform subscriptions (e.g. Shopify) and transaction fees are paid separately.");
  notes.push("Hosting and domain are not included in the estimate.");

  const featureText = features.filter((f) => f.id !== "forms").map((f) => f.label.toLowerCase());
  const summary = `${industry ? `${industry.label} · ` : ""}${type}${featureText.length ? ` with ${featureText.slice(0, 3).join(", ")}${featureText.length > 3 ? " and more" : ""}` : ""}.`;

  return {
    type,
    industry: industry?.label,
    features: features.map(({ id, label, note }) => ({ id, label, note })),
    pages,
    pageCount,
    low,
    high,
    weeks: [wLow, wHigh],
    complexity,
    complexityLabel,
    budgetOption,
    timelineOption,
    confidence,
    summary,
    notes,
  };
}

export function estimateToText(e: Estimate) {
  return [
    `Here's my read on your project: **${e.summary}**`,
    `• Suggested pages (${e.pageCount}): ${e.pages.slice(0, 8).join(", ")}`,
    e.features.length ? `• Key features: ${e.features.map((f) => f.label).join(", ")}` : "",
    `• Complexity: ${e.complexityLabel} (${e.complexity}/100)`,
    `• Indicative investment: **${inr(e.low)} – ${inr(e.high)}**`,
    `• Typical timeline: **${e.weeks[0]}–${e.weeks[1]} weeks**`,
    `This is a rough, automated estimate — the final quote is confirmed after a short conversation about scope.`,
  ]
    .filter(Boolean)
    .join("\n");
}

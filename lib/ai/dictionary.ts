/**
 * ═════════════════════════════════════════════════════════════
 *  FORMA ASSISTANT DICTIONARY — edit freely.
 *
 *  1. SYNONYMS  → maps many words/typos onto one canonical token.
 *                 Canonical tokens are what `keys` below match on.
 *  2. KNOWLEDGE → question/answer entries. Each entry needs:
 *       id        unique name
 *       keys      canonical tokens → weight (higher = stronger)
 *       examples  a few ways people ask it (used for similarity)
 *       answer    the reply (supports **bold**, *italic*, "• " bullets)
 *       chips     optional follow-up suggestions
 *       link      optional button { label, href }
 *  Add an entry, save, and the assistant learns it immediately.
 * ═════════════════════════════════════════════════════════════
 */

export const SYNONYMS: Record<string, string> = {
  // ── money
  cost: "price", costs: "price", costing: "price", pricing: "price", prices: "price", charge: "price", charges: "price", fee: "price", fees: "price",
  rate: "price", rates: "price", expensive: "price", cheap: "price", cheaper: "price", affordable: "price", budget: "price", budgets: "price", quote: "price",
  quotation: "price", much: "price", rupees: "price", rupee: "price", rs: "price", inr: "price", "₹": "price", money: "price", tariff: "price", package: "included",
  packages: "included", plans: "included", discount: "discount", discounts: "discount", offer: "service", offers: "service", coupon: "discount",
  negotiate: "discount", negotiable: "discount", student: "discount", startup: "startup", startups: "startup",
  pay: "payment", paying: "payment", payment: "payment", payments: "payment", advance: "payment", installment: "payment", installments: "payment", emi: "payment",
  invoice: "payment", invoices: "payment", gst: "tax", tax: "tax", taxes: "tax", refund: "refund", refunds: "refund", cancel: "refund", cancellation: "refund",
  // ── time
  long: "time", duration: "time", weeks: "time", week: "time", days: "time", day: "time", month: "time", months: "time", deadline: "time", fast: "time",
  quick: "time", quickly: "time", soon: "time", timeline: "time", delivery: "time", deliver: "time", turnaround: "time", urgent: "urgent", asap: "urgent",
  rush: "urgent", emergency: "urgent", tomorrow: "urgent",
  // ── services & types
  ecommerce: "ecommerce", "e-commerce": "ecommerce", ecom: "ecommerce", shop: "ecommerce", store: "ecommerce", shopify: "shopify", woocommerce: "ecommerce",
  cart: "ecommerce", sell: "ecommerce", selling: "ecommerce", products: "ecommerce", product: "ecommerce", checkout: "ecommerce", catalog: "ecommerce",
  redesign: "revamp", redo: "revamp", refresh: "revamp", outdated: "revamp", rebuild: "revamp", revamping: "revamp", makeover: "revamp", update: "maintenance",
  landing: "landing", campaign: "landing", squeeze: "landing", waitlist: "landing", "one-page": "landing", onepage: "landing",
  portfolio: "work", showcase: "work", projects: "work", samples: "work", sample: "work", previous: "work", clients: "work", examples: "work", example: "work",
  case: "work", studies: "work", demo: "work", demos: "work",
  app: "app", apps: "app", android: "app", ios: "app", mobileapp: "app", application: "webapp", webapp: "webapp", saas: "webapp", dashboard: "webapp", portal: "webapp",
  logo: "branding", branding: "branding", brand: "branding", identity: "branding", "brand-identity": "branding",
  content: "content", copy: "content", copywriting: "content", writing: "content", text: "content", blog: "cms", cms: "cms", wordpress: "wordpress", wp: "wordpress",
  webflow: "nocode", wix: "nocode", squarespace: "nocode", framer: "nocode",
  photo: "media", photos: "media", photography: "media", images: "media", image: "media", video: "media", videos: "media", stock: "media",
  // ── people
  founders: "team", founder: "team", people: "team", owner: "team", owners: "team", who: "team", team: "team", prajwal: "team", pratik: "team", members: "team",
  // ── devices & quality
  mobile: "responsive", phone: "responsive", phones: "responsive", tablet: "responsive", responsive: "responsive", ipad: "responsive", devices: "responsive",
  speed: "performance", fast_loading: "performance", performance: "performance", slow: "performance", lighthouse: "performance", vitals: "performance",
  accessible: "accessibility", accessibility: "accessibility", a11y: "accessibility", wcag: "accessibility", disabled: "accessibility",
  secure: "security", security: "security", ssl: "security", https: "security", hack: "security", hacked: "security", backup: "security", backups: "security",
  backend: "backend", "back-end": "backend", database: "database", databases: "database", db: "database", api: "api", apis: "api", login: "login", logins: "login", signin: "login",
  breakdown: "breakdown", "break-down": "breakdown", split: "split", itemized: "breakdown", itemised: "breakdown", buy: "buy", purchase: "buy", register: "buy",
  // ── infra
  host: "hosting", hosting: "hosting", server: "hosting", servers: "hosting", vercel: "hosting", netlify: "hosting", aws: "hosting", hostinger: "hosting",
  domain: "domain", domains: "domain", godaddy: "domain", namecheap: "domain", dns: "domain", ".com": "domain", ".in": "domain",
  email: "contact", mail: "contact", gmail: "contact", inbox: "contact", businessemail: "workspace", workspace: "workspace", zoho: "workspace",
  maintain: "maintenance", maintenance: "maintenance", support: "maintenance", updates: "maintenance", amc: "maintenance", bug: "maintenance", bugs: "maintenance",
  seo: "seo", google: "seo", ranking: "seo", rank: "seo", search: "seo", keywords: "seo", traffic: "seo", visibility: "seo",
  analytics: "analytics", tracking: "analytics", visitors: "analytics", metrics: "analytics", "google-analytics": "analytics", ga4: "analytics",
  marketing: "marketing", ads: "marketing", advertising: "marketing", instagram: "marketing", facebook: "marketing", social: "marketing", smm: "marketing",
  whatsapp: "whatsapp", chat: "chatbot", chatbot: "chatbot", bot: "chatbot", ai: "ai", gpt: "ai", chatgpt: "ai", openai: "ai", automation: "ai",
  map: "maps", maps: "maps", location: "location", located: "location", where: "location", city: "location", office: "location", based: "location",
  booking: "booking", bookings: "booking", appointment: "booking", appointments: "booking", reservation: "booking", reservations: "booking", calendar: "booking",
  language: "multilingual", languages: "multilingual", multilingual: "multilingual", hindi: "multilingual", kannada: "multilingual", translate: "multilingual",
  // ── process / legal
  revision: "revisions", revisions: "revisions", changes: "revisions", edits: "revisions", feedback: "revisions", iterations: "revisions",
  process: "process", steps: "process", workflow: "process", collaborate: "process", collaboration: "process", approach: "process", method: "process",
  contract: "legal", agreement: "legal", nda: "legal", terms: "legal", privacy: "privacy", gdpr: "privacy", data: "privacy",
  own: "ownership", ownership: "ownership", source: "ownership", sourcecode: "ownership", rights: "ownership", copyright: "ownership",
  meet: "meeting", meeting: "meeting", zoom: "meeting", "google-meet": "meeting", call: "meeting", calls: "meeting", video_call: "meeting",
  hours: "hours", available: "hours", availability: "hours", weekend: "hours", weekends: "hours", timezone: "hours", online: "hours",
  train: "training", training: "training", teach: "training", tutorial: "training", handover: "training",
  migrate: "migration", migration: "migration", move: "migration", transfer: "migration", switch: "migration",
  // ── tech
  tech: "stack", technology: "stack", technologies: "stack", stack: "stack", react: "stack", nextjs: "stack", next: "stack", framework: "stack",
  tailwind: "stack", typescript: "stack", javascript: "stack", html: "stack", css: "stack", gsap: "stack", threejs: "stack", "3d": "motion3d",
  animation: "motion3d", animations: "motion3d", animated: "motion3d", interactive: "motion3d", parallax: "motion3d",
  // ── geography
  abroad: "international", outside: "international", international: "international", usa: "international", us: "international", uk: "international",
  dubai: "international", uae: "international", canada: "international", australia: "international", europe: "international", country: "international",
  countries: "international", overseas: "international", foreign: "international", dollars: "international", usd: "international",
  // ── conversation
  hi: "hello", hey: "hello", hello: "hello", hola: "hello", namaste: "hello", yo: "hello", hii: "hello", hiii: "hello", heyy: "hello", sup: "hello",
  thanks: "thanks", thank: "thanks", thx: "thanks", ty: "thanks", great: "thanks", awesome: "thanks", cool: "thanks", nice: "thanks", perfect: "thanks", helpful: "thanks",
  bye: "bye", goodbye: "bye", later: "bye", cya: "bye", ok: "ok", okay: "ok", fine: "ok", sure: "ok", yes: "yes", yeah: "yes", yep: "yes", no: "no", nope: "no",
  contact: "contact", talk: "contact", human: "contact", reach: "contact", hire: "contact", agent: "contact", someone: "contact", person: "contact",
  include: "included", includes: "included", included: "included", deliverables: "included", get: "included", receive: "included",
  estimate: "estimate", estimation: "estimate", calculate: "estimate", calculator: "estimate", analyse: "estimate", analyze: "estimate", evaluate: "estimate",
  joke: "joke", funny: "joke", laugh: "joke",
};

export type KnowledgeEntry = {
  id: string;
  keys: Record<string, number>;
  examples: string[];
  answer: string;
  chips?: string[];
  link?: { label: string; href: string };
};

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "backend",
    keys: { backend: 5, database: 4, server: 2, api: 3, login: 3 },
    examples: ["do you provide backend", "can you build a database", "do you do backend development", "can you make login system"],
    answer:
      "We **don't provide backend services** — no custom servers, databases, logins, admin dashboards or APIs. We specialise in design and frontend development, and can recommend third-party tools when a project needs that functionality.",
    link: { label: "See what's included", href: "/services#breakdown" },
  },
  {
    id: "breakdown",
    keys: { breakdown: 9, split: 4, price: 1, domain: 1, email: 1 },
    examples: ["break down the cost", "what does 15000 include", "how is the price split", "cost breakdown"],
    answer:
      `Here's the ₹15,000 starting package, line by line:
• Discovery & consultation — ₹1,000
• Domain consultation & GoDaddy guidance — ₹1,500
• Business email setup & handover — ₹2,000
• UI/UX design (up to ~5 pages) — ₹4,000
• Frontend development — ₹4,500
• Basic SEO setup — ₹1,000
• Deployment & launch — ₹1,000
The domain itself and any paid mailbox plan are paid directly to the provider.`,
    link: { label: "Open the breakdown", href: "/services#breakdown" },
  },
  {
    id: "godaddy",
    keys: { godaddy: 5, domain: 3, buy: 2 },
    examples: ["how do i buy a domain", "how to buy domain on godaddy", "help me get a domain"],
    answer:
      `Domain guidance is part of the package (₹1,500). In short:
• Search your name on godaddy.com
• Pick .com or .in (no hyphens/numbers)
• Skip unnecessary checkout add-ons
• Buy it in your own name
• Invite us with delegate access — never share your password`,
    link: { label: "Full step-by-step guide", href: "/services#breakdown" },
  },
  {
    id: "smalltalk-howareyou",
    keys: { how: 1, doing: 3, going: 2 },
    examples: ["how are you", "how is it going", "how are you doing"],
    answer: "Doing great, thanks for asking! Ready to help you plan a brilliant website. What are you working on?",
    chips: ["Estimate my project", "What do you offer?"],
  },
  {
    id: "smalltalk-joke",
    keys: { joke: 5 },
    examples: ["tell me a joke", "make me laugh"],
    answer: "Why did the designer break up with the template? It had no *character*. 😄\nNow — want a website with plenty of it?",
    chips: ["Show me your work", "Estimate my project"],
  },
  {
    id: "smalltalk-ok",
    keys: { ok: 3, yes: 2 },
    examples: ["ok", "okay", "sure", "yes"],
    answer: "Great! What would you like to do next?",
    chips: ["Estimate my project", "Pricing", "Contact the team"],
  },
  {
    id: "discount",
    keys: { discount: 5, startup: 2, price: 1 },
    examples: ["do you give discounts", "any student discount", "is the price negotiable", "startup pricing"],
    answer:
      "Our pricing is already lean and transparent, starting at **₹15,000**. For early-stage startups, non-profits or phased projects we're happy to discuss scope options — for example launching with essentials first and adding features later.",
    chips: ["Estimate my project", "Contact the team"],
  },
  {
    id: "tax",
    keys: { tax: 5 },
    examples: ["is gst included", "do prices include tax"],
    answer: "Any applicable taxes are stated clearly on your proposal and invoice so there are no surprises.",
  },
  {
    id: "refund",
    keys: { refund: 5 },
    examples: ["what is your refund policy", "can i cancel the project"],
    answer: "Either side can cancel in writing; work completed up to that point is billed. Refund terms for advances are set out in your project agreement.",
    link: { label: "Read the terms", href: "/terms-and-conditions" },
  },
  {
    id: "urgent",
    keys: { urgent: 5, time: 1 },
    examples: ["i need it urgently", "can you deliver asap", "i need a website by tomorrow"],
    answer:
      "We'll always try to help with tight deadlines. A focused landing page can sometimes be turned around in about a week; larger sites need more time. Tell us your date and we'll be honest about what's realistic.",
    chips: ["Contact the team", "Estimate my project"],
  },
  {
    id: "app",
    keys: { app: 5 },
    examples: ["do you make mobile apps", "can you build an android app", "ios app development"],
    answer:
      "We focus on websites and web experiences rather than native Android/iOS apps. A fast, mobile-first website (or a web app that works great on phones) is often the best first step — happy to advise.",
    chips: ["Web application", "Estimate my project"],
  },
  {
    id: "webapp",
    keys: { webapp: 5 },
    examples: ["can you build a web app", "do you build dashboards", "saas development"],
    answer:
      "We're a design & frontend studio — we **do not provide backend services** (servers, databases, logins, admin dashboards or APIs). If you need that functionality, we can recommend trusted third-party tools and build a great frontend around them.",
    chips: ["Estimate my project"],
  },
  {
    id: "branding",
    keys: { branding: 5 },
    examples: ["do you design logos", "can you do branding", "brand identity"],
    answer:
      "Our core focus is website design and development. If you already have a logo and colours, we carry them faithfully across the site. If you need light visual direction for the web, we can discuss it as part of scope.",
  },
  {
    id: "content",
    keys: { content: 5 },
    examples: ["do you write the content", "who writes the text", "copywriting"],
    answer:
      "Usually you provide the core content (you know your business best), and we help structure it so it reads well on the web. If you need more help with copy, we can discuss it during planning.",
  },
  {
    id: "media",
    keys: { media: 5 },
    examples: ["do you provide images", "where do photos come from", "stock photos"],
    answer: "We can use your own photos, carefully chosen stock imagery or designed visuals. Any paid stock or licences are listed transparently.",
  },
  {
    id: "wordpress",
    keys: { wordpress: 5 },
    examples: ["do you use wordpress", "can you build on wordpress", "wordpress or custom"],
    answer:
      "We primarily build custom sites with modern tools (Next.js, React, Tailwind) for speed and flexibility. If you specifically need a CMS so you can edit content, we'll recommend a setup that suits you.",
    chips: ["Can I update the website myself?"],
  },
  {
    id: "nocode",
    keys: { nocode: 5 },
    examples: ["do you use wix", "webflow or framer", "squarespace"],
    answer: "We build custom-coded websites, which gives you better performance and full control. If a no-code platform fits your needs better, we'll say so honestly.",
  },
  {
    id: "cms",
    keys: { cms: 5, edit: 2, myself: 2 },
    examples: ["can i update the website myself", "do you add a blog", "can i edit content"],
    answer:
      "Yes — if you'll update content regularly (like a blog or menu), we can set up an easy editing workflow. It's discussed during planning so the setup matches how often you'll make changes.",
    chips: ["Pricing", "Estimate my project"],
  },
  {
    id: "performance",
    keys: { performance: 5 },
    examples: ["will my website be fast", "page speed", "core web vitals"],
    answer: "Speed is part of the design. We optimise images, fonts and scripts and keep animations lightweight so pages load quickly on real phones and networks.",
  },
  {
    id: "accessibility",
    keys: { accessibility: 5 },
    examples: ["is the website accessible", "do you follow wcag"],
    answer: "We build with semantic HTML, keyboard support, visible focus states, labels, contrast and reduced-motion support in mind.",
  },
  {
    id: "security",
    keys: { security: 5 },
    examples: ["is the website secure", "do you provide ssl", "what about backups"],
    answer:
      "Sites are served over HTTPS (SSL is typically free with modern hosting). Simple, static-first builds also reduce attack surface. Ongoing backups and monitoring can be part of a maintenance arrangement.",
  },
  {
    id: "workspace",
    keys: { workspace: 5 },
    examples: ["can you set up business email", "email with my domain"],
    answer:
      "Yes — **business email setup & handover is ₹2,000** in the starting package. We create a professional address on your domain (like hello@yourbrand.com), configure the DNS records for reliable delivery, and hand it over with login guidance. Any paid mailbox plan (e.g. Google Workspace or Zoho) is paid directly to the provider.",
    link: { label: "See the cost breakdown", href: "/services#breakdown" },
  },
  {
    id: "analytics",
    keys: { analytics: 5 },
    examples: ["can you add google analytics", "will i see visitor stats"],
    answer: "Yes, we can add analytics (including privacy-friendly options) so you can see visitors and conversions. It's set up only if you want it, and your privacy policy is updated to match.",
  },
  {
    id: "marketing",
    keys: { marketing: 5 },
    examples: ["do you do social media marketing", "can you run ads", "instagram marketing"],
    answer:
      "We don't run ads or social media management. We focus on building a website that converts the traffic your marketing brings — and we're happy to make it campaign-ready (landing pages, tracking, fast load times).",
    chips: ["Landing pages", "SEO"],
  },
  {
    id: "whatsapp",
    keys: { whatsapp: 5 },
    examples: ["can you add whatsapp button", "whatsapp integration", "orders on whatsapp"],
    answer: "Absolutely — a WhatsApp click-to-chat button or pre-filled order message is a simple, popular addition. Deeper WhatsApp Business API integrations are scoped separately.",
  },
  {
    id: "chatbot",
    keys: { chatbot: 4, ai: 3 },
    examples: ["can you add a chatbot to my website", "can you build an ai assistant like this", "ai features"],
    answer:
      "Yes! Assistants like me can be added to your site — from a rules-based helper that runs in the browser (fast, private, no running costs) to AI-API-powered assistants (priced separately due to API usage).",
    chips: ["Estimate my project"],
  },
  {
    id: "booking",
    keys: { booking: 5 },
    examples: ["can you add appointment booking", "online reservations", "booking system"],
    answer: "Yes — from a simple booking form to calendar-based scheduling or third-party booking tools. It's priced as an add-on depending on complexity.",
    chips: ["Estimate my project"],
  },
  {
    id: "multilingual",
    keys: { multilingual: 5 },
    examples: ["can the website be in hindi", "multiple languages", "bilingual website"],
    answer: "Yes, we can build multilingual websites (e.g. English + Hindi or Kannada). Translation content is typically provided by you; the language setup is an add-on.",
  },
  {
    id: "maps",
    keys: { maps: 5 },
    examples: ["can you add google maps", "show our location on a map"],
    answer: "Sure — an embedded map with directions is a quick addition, and is included in most business sites' contact page.",
  },
  {
    id: "shopify",
    keys: { shopify: 5 },
    examples: ["do you work with shopify", "shopify store design"],
    answer: "Yes, we can design and set up storefronts on platforms like Shopify. Platform subscriptions, apps and transaction fees are paid separately to the provider.",
    chips: ["E-commerce", "Estimate my project"],
  },
  {
    id: "legal",
    keys: { legal: 5 },
    examples: ["do you sign a contract", "will you sign an nda", "agreement"],
    answer: "Yes — every project has a written proposal/agreement covering scope, timeline and payments. We're happy to sign a reasonable NDA for confidential projects.",
    link: { label: "Read our terms", href: "/terms-and-conditions" },
  },
  {
    id: "privacy",
    keys: { privacy: 5 },
    examples: ["what do you do with my data", "privacy policy", "is my data safe"],
    answer: "This website doesn't track you or store form submissions. This chat runs in your browser and nothing you type is sent to a server.",
    link: { label: "Privacy policy", href: "/privacy-policy" },
  },
  {
    id: "ownership",
    keys: { ownership: 5 },
    examples: ["will i own the website", "do i get the source code", "who owns the design"],
    answer: "Once the project is paid in full, the final website and its design are yours. Third-party components keep their own licences. Details are in the agreement.",
  },
  {
    id: "meeting",
    keys: { meeting: 5 },
    examples: ["can we have a call", "schedule a meeting", "google meet"],
    answer: "Of course. Send us a quick message with your project details and preferred times — we'll set up a short video or phone call.",
    link: { label: "Contact us", href: "/contact" },
  },
  {
    id: "hours",
    keys: { hours: 5 },
    examples: ["what are your working hours", "are you available on weekends", "when do you reply"],
    answer: "We usually reply within a couple of working days. For time-sensitive projects, mention your deadline in the message.",
  },
  {
    id: "location",
    keys: { location: 5 },
    examples: ["where are you located", "where is your office", "which city are you in"],
    answer: "We're an independent studio based in India and work remotely with clients everywhere.",
    chips: ["Do you work with international clients?"],
  },
  {
    id: "training",
    keys: { training: 5 },
    examples: ["will you teach me to use the website", "handover training"],
    answer: "Yes — at handover we walk you through anything you'll manage yourself and share the relevant project details as agreed.",
  },
  {
    id: "migration",
    keys: { migration: 5 },
    examples: ["can you move my website from wix", "migrate my old site"],
    answer: "Yes. We can rebuild and migrate content from your current platform, keeping important URLs in mind so you don't lose search visibility.",
    chips: ["Website revamp"],
  },
  {
    id: "motion3d",
    keys: { motion3d: 5 },
    examples: ["can you add 3d animations", "interactive website", "animations like this site"],
    answer: "Yes — tasteful motion, scroll animations and even 3D (like this homepage) are our speciality. We keep them performance-friendly and respect reduced-motion settings.",
    chips: ["Estimate my project", "Show me your work"],
  },
];

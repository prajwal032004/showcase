/**
 * ─────────────────────────────────────────────────────────────
 *  FORMA ASSISTANT — a lightweight, on-device conversational engine.
 *  • Normalises text (synonyms, light stemming, typo tolerance)
 *  • Scores intents with weighted keywords + phrase similarity
 *  • Keeps short-term context (follow-ups, pending questions)
 *  • Hands project descriptions to the analyzer for estimates
 *  No network calls, no API keys — everything runs in the browser.
 * ─────────────────────────────────────────────────────────────
 */
import { site, pricing, nav } from "@/lib/site";
import { services, faqs, process } from "@/lib/services";
import { projects } from "@/lib/projects";
import { founders } from "@/lib/founders";
import { analyzeProject, estimateToText, hasProjectSignal, type Estimate } from "./estimator";
import { SYNONYMS as DICT_SYNONYMS, KNOWLEDGE } from "./dictionary";

export type ChatAction =
  | { kind: "navigate"; label: string; href: string }
  | { kind: "preview"; label: string; slug: string }
  | { kind: "prefill"; label: string; estimate: Estimate; description: string }
  | { kind: "copy"; label: string; text: string }
  | { kind: "gmail"; label: string };

export type BotReply = { text: string; actions?: ChatAction[]; chips?: string[]; estimate?: Estimate };

export type Context = {
  lastIntent?: string;
  awaiting?: "description";
  lastEstimate?: Estimate;
  lastDescription?: string;
  name?: string;
  turns: number;
};

/* ───────── text normalisation ───────── */

const BASE_SYNONYMS: Record<string, string> = {
  cost: "price", costs: "price", pricing: "price", prices: "price", charge: "price", charges: "price", fee: "price", fees: "price",
  rate: "price", rates: "price", expensive: "price", cheap: "price", affordable: "price", budget: "price", quote: "price", quotation: "price", much: "price",
  rupees: "price", inr: "price", "₹": "price", money: "price", pay: "payment", paying: "payment", advance: "payment", installment: "payment", invoice: "payment",
  long: "time", duration: "time", weeks: "time", week: "time", days: "time", deadline: "time", fast: "time", quick: "time", quickly: "time", soon: "time", timeline: "time", delivery: "time",
  ecommerce: "ecommerce", "e-commerce": "ecommerce", shop: "ecommerce", store: "ecommerce", shopify: "ecommerce", woocommerce: "ecommerce", cart: "ecommerce", sell: "ecommerce", products: "ecommerce",
  redesign: "revamp", redo: "revamp", refresh: "revamp", outdated: "revamp", rebuild: "revamp", revamping: "revamp",
  landing: "landing", campaign: "landing", squeeze: "landing",
  examples: "work", portfolio: "work", showcase: "work", projects: "work", samples: "work", previous: "work", clients: "work",
  founders: "team", founder: "team", people: "team", owner: "team", owners: "team", who: "team", team: "team",
  mobile: "responsive", phone: "responsive", phones: "responsive", tablet: "responsive", responsive: "responsive", ipad: "responsive",
  host: "hosting", hosting: "hosting", server: "hosting", domain: "domain", domains: "domain", godaddy: "domain",
  maintain: "maintenance", maintenance: "maintenance", support: "maintenance", updates: "maintenance", update: "maintenance",
  seo: "seo", google: "seo", ranking: "seo", rank: "seo", search: "seo",
  revision: "revisions", revisions: "revisions", changes: "revisions", edits: "revisions",
  hi: "hello", hey: "hello", hello: "hello", hola: "hello", namaste: "hello", yo: "hello",
  thanks: "thanks", thank: "thanks", thx: "thanks", ty: "thanks", great: "thanks", awesome: "thanks", cool: "thanks",
  bye: "bye", goodbye: "bye", later: "bye",
  contact: "contact", email: "contact", mail: "contact", call: "contact", talk: "contact", human: "contact", reach: "contact", whatsapp: "contact", hire: "contact",
  process: "process", steps: "process", workflow: "process", collaborate: "process", collaboration: "process", approach: "process",
  include: "included", includes: "included", included: "included", deliverables: "included", package: "included", get: "included",
  tech: "stack", technology: "stack", technologies: "stack", stack: "stack", react: "stack", nextjs: "stack", next: "stack", wordpress: "stack", framework: "stack", tailwind: "stack",
  abroad: "international", outside: "international", international: "international", usa: "international", uk: "international", country: "international", countries: "international", overseas: "international",
  estimate: "estimate", estimation: "estimate", calculate: "estimate", calculator: "estimate", analyse: "estimate", analyze: "estimate", plan: "estimate",
};

const SYNONYMS: Record<string, string> = { ...BASE_SYNONYMS, ...DICT_SYNONYMS };

const STOP = new Set("a an the is are am be to of for in on at it i me my we our you your can could would should do does did with and or about please tell what how which this that there have has will just".split(" "));

function stem(w: string) {
  if (w.length <= 4) return w;
  return w.replace(/(ings|ing|edly|ed|ies|es|s|ly)$/, (m) => (m === "ies" ? "y" : ""));
}

function canon(w: string) {
  return SYNONYMS[w] ?? SYNONYMS[stem(w)] ?? stem(w);
}

let VOCAB: string[] | null = null;
const knownWord = new Set<string>();
function vocab() {
  if (VOCAB) return VOCAB;
  const words = new Set<string>(Object.keys(SYNONYMS));
  INTENTS.forEach((i) => {
    Object.keys(i.keys).forEach((k) => words.add(k));
    i.examples.forEach((e) => e.toLowerCase().split(/[^a-z0-9]+/).forEach((w) => w && words.add(w)));
  });
  words.forEach((w) => knownWord.add(w));
  VOCAB = [...words].filter((w) => w.length >= 3);
  return VOCAB;
}

/** Typo correction against everything the assistant knows ("pirce" → "price"). */
function correct(w: string) {
  if (w.length < 4 || /\d/.test(w)) return w;
  const v = vocab();
  if (knownWord.has(w) || knownWord.has(stem(w))) return w;
  const max = w.length >= 7 ? 2 : 1;
  let best = w,
    bestD = max + 1;
  for (const cand of v) {
    if (Math.abs(cand.length - w.length) > max) continue;
    const d = lev(w, cand);
    if (d < bestD) {
      bestD = d;
      best = cand;
      if (d === 1 && max === 1) break;
    }
  }
  return bestD <= max ? best : w;
}

export function tokens(text: string) {
  return text
    .toLowerCase()
    .replace(/\bbreak(ing)?[\s-]*(down|up)\b|\bbreakup\b/g, " breakdown ")
    .replace(/\b(business|professional|company|domain|custom)\s+e-?mails?\b|\be-?mail\s+(setup|set up|account|id|manag\w*|hosting)\b|\bset\s*up\s+(an?\s+)?e-?mail\b/g, " workspace ")
    .replace(/₹/g, " ₹ ")
    .replace(/[^a-z0-9₹\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => canon(correct(w)));
}

function lev(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      // swapped letters ("pirce" → "price") count as one edit
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
    }
  return dp[a.length][b.length];
}

/* ───────── intents ───────── */

type Intent = {
  id: string;
  keys: Record<string, number>;
  examples: string[];
  reply: (ctx: Context, input: string) => BotReply;
};

const svc = (slug: string) => services.find((s) => s.slug === slug)!;
const svcReply = (slug: string): BotReply => {
  const s = svc(slug);
  return {
    text: `**${s.title}** — ${s.intro}\n\nWhat's covered:\n${s.points.slice(0, 5).map((p) => `• ${p.title}: ${p.text}`).join("\n")}${s.note ? `\n\nNote: ${s.note}` : ""}`,
    actions: [{ kind: "navigate", label: `Read more about ${s.title}`, href: `/services#${s.slug}` }],
    chips: ["How much does it cost?", "How long does it take?", "Estimate my project"],
  };
};

const INTENTS: Intent[] = [
  {
    id: "greeting",
    keys: { hello: 3, morning: 2, evening: 2 },
    examples: ["hi", "hello there", "hey", "good morning"],
    reply: (ctx) => ({
      text: ctx.turns > 1 ? "Hey again! What else can I help you with?" : `Hi! I'm the ${site.shortName} assistant. I can explain our services and pricing, show you our work, or analyse your project idea and give you a rough estimate in seconds.`,
      chips: ["Estimate my project", "What do you offer?", "Pricing", "Show me your work"],
    }),
  },
  {
    id: "capabilities",
    keys: { assistant: 3, bot: 3, ai: 3, you: 1, capable: 2, help: 2 },
    examples: ["what can you do", "who are you", "are you a bot", "are you ai", "how can you help"],
    reply: () => ({
      text: `I'm an on-device assistant built into this website. I can:\n• Answer questions about services, pricing, process and timelines\n• Analyse a project description and estimate scope, cost and timeline\n• Pre-fill the contact form for you\n• Take you to any page or project\nI run entirely in your browser — nothing you type is sent anywhere.`,
      chips: ["Estimate my project", "Pricing", "Contact the team"],
    }),
  },
  {
    id: "pricing",
    keys: { price: 4, starting: 2, "15000": 3, "15k": 3, minimum: 2, "₹": 2 },
    examples: ["how much does a website cost", "what is your price", "what are your rates", "what is the starting price", "is it expensive"],
    reply: (ctx) =>
      ctx.lastEstimate
        ? {
            text: `Based on what you described, the indicative range is **₹${ctx.lastEstimate.low.toLocaleString("en-IN")} – ₹${ctx.lastEstimate.high.toLocaleString("en-IN")}**. Our websites start at **${pricing.startingPriceLabel}**, and the final quote is confirmed once scope is agreed.`,
            actions: [{ kind: "prefill", label: "Send this to the team", estimate: ctx.lastEstimate, description: ctx.lastDescription ?? "" }],
            chips: ["What's included?", "How long will it take?"],
          }
        : {
            text: `Our websites start at **${pricing.startingPriceLabel} ${pricing.currency}**. That covers a professionally designed site of up to ~5 core pages, responsive layouts, basic SEO, a contact form and deployment help.\n\nFinal pricing depends on scope — e-commerce, bookings or multiple languages are quoted separately, and we don't provide backend services. Want me to estimate yours?\n\nHere's how ${pricing.startingPriceLabel} breaks down:\n${pricing.breakdown.map((b) => `• ${b.label}: ₹${b.amount.toLocaleString("en-IN")}`).join("\n")}`,
            actions: [{ kind: "navigate", label: "See pricing details", href: "/services#pricing" }],
            chips: ["Estimate my project", "What's included?", "What's not included?"],
          },
  },
  {
    id: "included",
    keys: { included: 4, starter: 2, basic: 1, price: 1 },
    examples: ["what is included", "what do i get", "what's in the package", "deliverables"],
    reply: () => ({
      text: `The ${pricing.startingPriceLabel} starting package typically includes:\n${pricing.included.map((i) => `• ${i}`).join("\n")}\n\nExact deliverables are confirmed in writing before we begin.`,
      chips: ["What's not included?", "Estimate my project", "How long does it take?"],
    }),
  },
  {
    id: "excluded",
    keys: { not: 2, excluded: 4, extra: 3, separately: 3, hidden: 3, additional: 2 },
    examples: ["what is not included", "any extra charges", "hidden costs", "what costs extra"],
    reply: () => ({
      text: `Not included in the starting price (quoted or paid separately):\n${pricing.notIncluded.map((i) => `• ${i}`).join("\n")}\n\nNo surprises — everything is listed in your proposal.`,
      chips: ["Do you provide hosting?", "Estimate my project"],
    }),
  },
  {
    id: "timeline",
    keys: { time: 4, take: 2, ready: 2, launch: 2 },
    examples: ["how long does a website take", "how fast can you deliver", "when will it be ready", "what is the timeline"],
    reply: (ctx) => ({
      text: ctx.lastEstimate
        ? `For the project you described, a typical timeline is **${ctx.lastEstimate.weeks[0]}–${ctx.lastEstimate.weeks[1]} weeks**, depending on how quickly content and feedback come in.`
        : `A focused starter website usually takes **2–4 weeks**. Landing pages can be quicker (around 1–2 weeks); e-commerce or custom features take longer. The biggest factor is usually how quickly content and feedback arrive.`,
      chips: ctx.lastEstimate ? ["Send this to the team", "Pricing"] : ["Estimate my project", "What's your process?"],
    }),
  },
  {
    id: "services",
    keys: { service: 4, offer: 3, do: 1, provide: 2, build: 1 },
    examples: ["what services do you offer", "what do you do", "what can you build", "your services"],
    reply: () => ({
      text: `We offer:\n${services.map((s) => `• **${s.title}** — ${s.short}`).join("\n")}`,
      actions: [{ kind: "navigate", label: "Explore services", href: "/services" }],
      chips: ["E-commerce", "Landing pages", "Website revamp", "Pricing"],
    }),
  },
  { id: "svc-design", keys: { design: 3, ui: 2, ux: 2, figma: 2, layout: 1 }, examples: ["website design", "do you do ui ux design"], reply: () => svcReply("website-design") },
  { id: "svc-dev", keys: { development: 3, develop: 3, code: 2, coding: 2, developer: 2 }, examples: ["website development", "do you code websites"], reply: () => svcReply("website-development") },
  { id: "svc-landing", keys: { landing: 5 }, examples: ["landing page", "do you make landing pages"], reply: () => svcReply("landing-pages") },
  { id: "svc-ecom", keys: { ecommerce: 5, online: 1 }, examples: ["ecommerce website", "online store", "can you build a shop"], reply: () => svcReply("e-commerce") },
  { id: "svc-revamp", keys: { revamp: 5, existing: 2, old: 2 }, examples: ["redesign my website", "revamp old site"], reply: () => svcReply("website-revamp") },
  { id: "svc-business", keys: { business: 3, company: 2, corporate: 2, small: 1 }, examples: ["business website", "company website"], reply: () => svcReply("business-websites") },
  {
    id: "process",
    keys: { process: 5, work: 1, start: 1, how: 1 },
    examples: ["what is your process", "how do you work", "how does it work", "what are the steps"],
    reply: () => ({
      text: `Our process is simple:\n${process.map((p) => `**${p.step} ${p.title}** — ${p.text}`).join("\n")}`,
      actions: [{ kind: "navigate", label: "See the full collaboration journey", href: "/services#collaboration" }],
      chips: ["What happens after I contact you?", "How long does it take?"],
    }),
  },
  {
    id: "work",
    keys: { work: 4, see: 1, show: 2, case: 2, study: 1 },
    examples: ["show me your work", "do you have examples", "portfolio", "previous projects"],
    reply: () => ({
      text: `Here are a few concept projects that show our approach (real client work will be added as it launches):\n${projects
        .slice(0, 4)
        .map((p) => `• **${p.title}** — ${p.summary}`)
        .join("\n")}`,
      actions: [
        { kind: "preview", label: `Preview ${projects[0].title}`, slug: projects[0].slug },
        { kind: "navigate", label: "Open the showcase", href: "/showcase" },
      ],
      chips: ["Estimate my project", "Who's behind the studio?"],
    }),
  },
  {
    id: "team",
    keys: { team: 4, about: 2, studio: 2, behind: 2 },
    examples: ["who are the founders", "who is behind this studio", "about you", "who runs this"],
    reply: () => ({
      text: `${site.name} is an independent studio founded by **${founders.map((f) => f.name).join("** and **")}**. You work directly with the people designing and building your site — no middlemen.`,
      actions: [{ kind: "navigate", label: "Meet the founders", href: "/about" }],
      chips: ["What makes you different?", "Contact the team"],
    }),
  },
  {
    id: "different",
    keys: { different: 4, why: 3, choose: 3, better: 2, unique: 2 },
    examples: ["why should i choose you", "what makes you different", "why you"],
    reply: () => ({
      text: `What sets us apart:\n• Direct collaboration with the founders\n• Custom designs — never reskinned templates\n• Transparent pricing with a written scope\n• Fast, accessible, modern development\n• Attention to detail in every state and screen`,
      chips: ["Show me your work", "Pricing"],
    }),
  },
  {
    id: "hosting",
    keys: { hosting: 5, domain: 4 },
    examples: ["do you provide hosting", "do i need a domain", "can you help with domain"],
    reply: () => ({ text: faqs.find((f) => f.q.includes("hosting"))!.a + " We can help connect your domain during launch.", chips: ["What's not included?", "Maintenance"] }),
  },
  { id: "maintenance", keys: { maintenance: 5, later: 1 }, examples: ["do you provide maintenance", "can i update later", "support after launch"], reply: () => ({ text: `${faqs.find((f) => f.q.includes("maintenance"))!.a} ${faqs.find((f) => f.q.includes("update the website"))!.a}`, chips: ["Pricing", "Contact the team"] }) },
  { id: "responsive", keys: { responsive: 5, work: 1 }, examples: ["will it work on mobile", "is it responsive"], reply: () => ({ text: "Yes — every site we build is designed and tested for phones, tablets, laptops and large screens. Mobile layouts are designed intentionally, not just shrunk down.", chips: ["SEO", "Pricing"] }) },
  { id: "seo", keys: { seo: 5 }, examples: ["do you do seo", "will i rank on google"], reply: () => ({ text: "Every website includes a basic SEO setup: semantic markup, page titles and descriptions, sitemap, robots, social previews and fast performance. Ongoing SEO campaigns or advanced strategy can be scoped separately. No one can honestly guarantee rankings, but we give you a strong technical foundation.", chips: ["What's included?", "Estimate my project"] }) },
  { id: "revisions", keys: { revisions: 5 }, examples: ["how many revisions", "can i request changes"], reply: () => ({ text: "Revisions are included within the agreed scope — the number of rounds is stated in your proposal. We collect consolidated, structured feedback at each milestone so changes are efficient. We don't promise unlimited revisions, but we do promise to listen.", chips: ["What's your process?"] }) },
  { id: "payment", keys: { payment: 5 }, examples: ["how do payments work", "do you take advance", "payment terms"], reply: () => ({ text: "Typically an advance confirms the project slot, with the balance due at agreed milestones or before launch. Exact terms are written into your proposal before work starts.", actions: [{ kind: "navigate", label: "Read terms", href: "/terms-and-conditions" }], chips: ["Pricing"] }) },
  { id: "international", keys: { international: 5, india: 1 }, examples: ["do you work with clients outside india", "can you work with international clients"], reply: () => ({ text: faqs.find((f) => f.q.includes("outside India"))!.a, chips: ["Contact the team", "Pricing"] }) },
  { id: "stack", keys: { stack: 5 }, examples: ["what technology do you use", "do you use wordpress", "react or wordpress"], reply: () => ({ text: "We usually build with modern, well-supported tools — Next.js, React, TypeScript and Tailwind CSS — with motion via GSAP/Framer Motion and 3D via Three.js where it adds value. For stores we can work with platforms like Shopify. We recommend whatever best fits your goals and budget.", chips: ["Estimate my project", "Show me your work"] }) },
  {
    id: "contact",
    keys: { contact: 5, start: 2, project: 1, hire: 3 },
    examples: ["how can i contact you", "i want to talk to someone", "start a project", "what's your email"],
    reply: () => ({
      text: `You can reach us at **${site.email}**, or use the contact form — it prepares a ready-to-send email in Gmail for you. After you get in touch, we'll reply to arrange a short call and then share a written scope and quote.`,
      actions: [
        { kind: "navigate", label: "Open the contact form", href: "/contact" },
        { kind: "copy", label: "Copy email address", text: site.email },
      ],
      chips: ["Estimate my project first"],
    }),
  },
  {
    id: "after-contact",
    keys: { after: 3, happens: 3, next: 2 },
    examples: ["what happens after i contact you", "what are the next steps"],
    reply: () => ({ text: faqs.find((f) => f.q.startsWith("What happens"))!.a, actions: [{ kind: "navigate", label: "Contact us", href: "/contact" }] }),
  },
  {
    id: "estimate",
    keys: { estimate: 5, need: 1, want: 1, idea: 2 },
    examples: ["estimate my project", "can you estimate my website", "i have a project idea", "calculate cost of my website"],
    reply: () => ({
      text: "Happy to! Describe your project in a sentence or two — what the business does, what the site should do and any features you need (e.g. *“A website for my bakery with an online menu, WhatsApp orders and a gallery”*).",
      chips: ["Online store for my clothing brand", "Landing page for a SaaS launch", "Redesign my clinic website with bookings"],
    }),
  },
  { id: "thanks", keys: { thanks: 5 }, examples: ["thank you", "thanks a lot", "great"], reply: () => ({ text: "You're welcome! Anything else I can help with?", chips: ["Estimate my project", "Contact the team"] }) },
  { id: "bye", keys: { bye: 5 }, examples: ["bye", "see you"], reply: () => ({ text: "Thanks for stopping by — whenever you're ready, we'd love to hear about your project. 👋", actions: [{ kind: "navigate", label: "Start a project", href: "/contact" }] }) },
];

KNOWLEDGE.forEach((k) =>
  INTENTS.push({
    id: k.id,
    keys: k.keys,
    examples: k.examples,
    reply: () => ({
      text: k.answer,
      chips: k.chips ?? ["Estimate my project", "Contact the team"],
      actions: k.link ? [{ kind: "navigate", label: k.link.label, href: k.link.href }] : undefined,
    }),
  })
);

/* ───────── navigation intent ───────── */
function navigationReply(input: string): BotReply | null {
  const t = input.toLowerCase();
  if (!/\b(go|take|open|navigate|show|visit|bring)\b/.test(t)) return null;
  const target = [...nav, { label: "Privacy", href: "/privacy-policy" }, { label: "Terms", href: "/terms-and-conditions" }].find((n) =>
    t.includes(n.label.toLowerCase())
  );
  if (target) return { text: `Sure — taking you to **${target.label}**.`, actions: [{ kind: "navigate", label: `Go to ${target.label}`, href: target.href }] };
  const proj = projects.find((p) => t.includes(p.title.toLowerCase().split(" ")[0]));
  if (proj) return { text: `Here's **${proj.title}** — ${proj.summary}`, actions: [{ kind: "preview", label: "Quick preview", slug: proj.slug }, { kind: "navigate", label: "Open case study", href: `/showcase/${proj.slug}` }] };
  return null;
}

/* ───────── scoring ───────── */
const exampleTokens = INTENTS.map((i) => i.examples.map((e) => new Set(tokens(e).filter((w) => !STOP.has(w)))));

function score(input: string) {
  const tk = tokens(input).filter((w) => !STOP.has(w));
  const set = new Set(tk);
  return INTENTS.map((intent, idx) => {
    let s = 0;
    for (const [k, w] of Object.entries(intent.keys)) {
      if (set.has(k)) s += w;
      else if (k.length >= 5 && tk.some((t) => t.length >= 4 && lev(t, k) <= 1)) s += w * 0.7; // typo tolerance
    }
    let best = 0;
    for (const ex of exampleTokens[idx]) {
      if (!ex.size) continue;
      let inter = 0;
      ex.forEach((w) => set.has(w) && inter++);
      best = Math.max(best, inter / (ex.size + set.size - inter || 1));
    }
    return { intent, s: s + best * 6 };
  }).sort((a, b) => b.s - a.s);
}

/* ───────── public API ───────── */
export function respond(input: string, ctx: Context): { reply: BotReply; ctx: Context } {
  const text = input.trim();
  const next: Context = { ...ctx, turns: ctx.turns + 1 };
  if (!text) return { reply: { text: "Ask me anything about websites, pricing or your project." }, ctx: next };

  const nameMatch = text.match(/\b(?:i'?m|i am|my name is|this is)\s+([A-Z][a-z]+)/);
  if (nameMatch) next.name = nameMatch[1];

  // 1) Project description → analyzer (explicit wait state or strong signal)
  if (next.awaiting === "description" || hasProjectSignal(text)) {
    if (text.split(/\s+/).length >= 4 || next.awaiting === "description") {
      const est = analyzeProject(text);
      const thin = !est.features.length && !est.industry && est.type === "Business website";
      if (thin && next.awaiting !== "description") {
        next.awaiting = "description";
        return {
          reply: {
            text: "Sounds exciting! To give you a useful estimate, tell me a bit more — what does the business do, and which features matter most (e.g. online store, bookings, blog, multiple languages, WhatsApp)?",
            chips: ["A café website with menu and reservations", "Portfolio for a photographer", "Online store with payments"],
          },
          ctx: next,
        };
      }
      next.awaiting = undefined;
      next.lastEstimate = est;
      next.lastDescription = text;
      next.lastIntent = "analysis";
      return {
        reply: {
          text: `${next.name ? `Thanks, ${next.name}! ` : ""}${estimateToText(est)}`,
          estimate: est,
          actions: [
            { kind: "prefill", label: "Send this to the team", estimate: est, description: text },
            { kind: "navigate", label: "See what's included", href: "/services#pricing" },
          ],
          chips: ["What's not included?", "How do you work?", "Refine the estimate"],
        },
        ctx: next,
      };
    }
  }

  // 2) Navigation commands
  const navR = navigationReply(text);
  if (navR) return { reply: navR, ctx: { ...next, lastIntent: "navigate" } };

  // 3) Intent classification
  if (/^refine/i.test(text)) {
    next.awaiting = "description";
    return { reply: { text: "Sure — tell me more: number of pages, must-have features, languages, integrations or anything else, and I'll recalculate." }, ctx: next };
  }
  const ranked = score(text);
  const top = ranked[0];
  if (top.s >= 2.2) {
    if (top.intent.id === "estimate") next.awaiting = "description";
    next.lastIntent = top.intent.id;
    return { reply: top.intent.reply(next, text), ctx: next };
  }

  // 4) Short follow-ups that rely on context
  if (/^(and|what about|how about|also)\b/i.test(text) && ctx.lastIntent) {
    const again = INTENTS.find((i) => i.id === ctx.lastIntent);
    if (again) return { reply: again.reply(next, text), ctx: next };
  }

  // 5) Fallback with helpful suggestions (closest intents)
  const suggestions = ranked
    .slice(0, 3)
    .filter((r) => r.s > 0.5)
    .map((r) => r.intent.examples[0])
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  return {
    reply: {
      text: `I'm not completely sure I understood that. I can help with pricing, services, timelines, our process — or analyse your project idea. ${
        suggestions.length ? "Did you mean one of these?" : "Try one of these:"
      }`,
      chips: suggestions.length ? suggestions : ["Estimate my project", "Pricing", "What do you offer?"],
      actions: [{ kind: "navigate", label: "Talk to a human", href: "/contact" }],
    },
    ctx: next,
  };
}

export const welcome: BotReply = {
  text: `Hi! I'm the ${site.shortName} assistant ✦\nAsk me about services, pricing or timelines — or describe your project and I'll estimate scope, cost and timeline instantly.`,
  chips: ["Estimate my project", "How much does a website cost?", "Show me your work", "What's your process?"],
};

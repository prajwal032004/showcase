export type ServiceVisual = "design" | "develop" | "commerce" | "landing" | "business" | "revamp";

export type Service = {
  slug: string;
  index: string;
  title: string;
  short: string;
  intro: string;
  visual: ServiceVisual;
  points: { title: string; text: string }[];
  note?: string;
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: "website-design",
    index: "01",
    title: "Website Design",
    short: "Considered interfaces that look distinctive, feel effortless and guide visitors toward action.",
    intro:
      "Great design is structure before it is decoration. We plan how people move through your site, what they need to see and when — then shape a visual language that is unmistakably yours.",
    visual: "design",
    featured: true,
    points: [
      { title: "UI/UX design", text: "Interfaces designed around how real people read, scan, tap and decide." },
      { title: "Layout planning", text: "Wireframes and content hierarchy that give every section a clear job." },
      { title: "Visual design", text: "Typography, colour, spacing and imagery composed into a cohesive system." },
      { title: "Brand consistency", text: "Your existing identity carried faithfully across every page and state." },
      { title: "Responsive planning", text: "Mobile, tablet and desktop layouts considered from the very first sketch." },
      { title: "Conversion-focused", text: "Clear calls to action, trust signals and friction removed where it matters." },
      { title: "User journey", text: "Mapped paths from first visit to enquiry so nobody gets lost." },
    ],
  },
  {
    slug: "website-development",
    index: "02",
    title: "Website Development",
    short: "Fast, robust front-ends built with modern tooling and clean, maintainable code.",
    intro:
      "We turn designs into production websites with modern frameworks, careful engineering and a strong focus on speed, stability and accessibility.",
    visual: "develop",
    featured: true,
    points: [
      { title: "Modern frontend", text: "Built with current, well-supported tools such as Next.js, React and Tailwind CSS." },
      { title: "Responsive implementation", text: "Pixel-careful layouts that adapt gracefully to every screen size." },
      { title: "Component architecture", text: "Reusable, organised building blocks that make future changes simpler." },
      { title: "Performance optimisation", text: "Optimised images, lean scripts and efficient fonts for quick loading." },
      { title: "Cross-browser care", text: "Tested on current versions of major browsers and devices." },
      { title: "Basic SEO", text: "Semantic markup, metadata, sitemap and social previews set up properly." },
      { title: "Accessibility", text: "Keyboard support, labels, contrast and reduced-motion considered throughout." },
    ],
  },
  {
    slug: "landing-pages",
    index: "03",
    title: "Landing Pages",
    short: "Focused, single-goal pages engineered for campaigns, launches and lead generation.",
    intro:
      "A landing page has one job. We design narrative-driven pages that make your offer clear and give visitors an obvious next step.",
    visual: "landing",
    featured: true,
    points: [
      { title: "Campaign-focused", text: "Designed around a single offer, audience and outcome." },
      { title: "Conversion layouts", text: "Structured to answer objections in the order visitors raise them." },
      { title: "Clear CTAs", text: "Primary actions that are visible, repeated sensibly and easy to complete." },
      { title: "Storytelling", text: "Product or service benefits presented as a story, not a feature dump." },
      { title: "Lead generation", text: "Enquiry, signup or booking sections that keep friction low." },
    ],
  },
  {
    slug: "business-websites",
    index: "04",
    title: "Business Websites",
    short: "Credible, well-organised websites for companies, service providers and personal brands.",
    intro:
      "Your website is often the first place people check before trusting you. We build sites that present your business clearly and professionally.",
    visual: "business",
    points: [
      { title: "Company websites", text: "Clear positioning, team, services and contact for established businesses." },
      { title: "Service websites", text: "Service pages that explain what you do, who it is for and how to start." },
      { title: "Portfolio websites", text: "Showcases that let your work speak, beautifully and quickly." },
      { title: "Personal brands", text: "Websites for consultants, creators and professionals who are the brand." },
      { title: "Small businesses", text: "Practical, affordable websites that help local businesses get found and contacted." },
    ],
  },
  {
    slug: "e-commerce",
    index: "05",
    title: "E-commerce Websites",
    short: "Storefronts that make products desirable and buying feel simple on every device.",
    intro:
      "We design shopping experiences that showcase products well and make checkout feel straightforward — on a platform suited to your needs.",
    visual: "commerce",
    featured: true,
    points: [
      { title: "Storefront design", text: "Home, collection and category pages that invite browsing." },
      { title: "Product pages", text: "Imagery, details, variants and trust cues arranged to help people decide." },
      { title: "Shopping experience", text: "Cart and checkout flows planned to minimise drop-off." },
      { title: "Responsive commerce", text: "Mobile-first shopping, because that is where most people buy." },
      { title: "Integration options", text: "Payment gateways, inventory, shipping or platforms like Shopify can be discussed." },
    ],
    note: "Payment gateways, e-commerce platform subscriptions, transaction fees, advanced integrations and advanced integrations are paid or scoped separately. We do not build custom backends — stores run on established platforms such as Shopify.",
  },
  {
    slug: "website-revamp",
    index: "06",
    title: "Website Revamp",
    short: "Give an outdated website a sharper look, clearer structure and better performance.",
    intro:
      "If your current site feels dated, slow or hard to use, we redesign it around what your business needs today — keeping what works and fixing what does not.",
    visual: "revamp",
    points: [
      { title: "Redesign outdated sites", text: "A fresh visual direction that reflects where your business is now." },
      { title: "Improved navigation", text: "Simplified structure so visitors find what they need quickly." },
      { title: "Visual redesign", text: "Modern typography, spacing and imagery for a more premium feel." },
      { title: "Mobile optimisation", text: "Layouts rebuilt for phones rather than squeezed onto them." },
      { title: "Performance", text: "Lighter pages and better loading for a smoother experience." },
      { title: "Better presentation", text: "Your services explained more clearly and persuasively." },
    ],
  },
];

export const featuredServices = services.filter((s) => s.featured);

export const process = [
  { step: "01", title: "Discover", text: "We learn about your business, audience and goals, and define what success looks like." },
  { step: "02", title: "Design", text: "We shape the structure and visual direction, then design key pages for your review." },
  { step: "03", title: "Develop", text: "We build a fast, responsive website with clean code and careful attention to detail." },
  { step: "04", title: "Deliver", text: "We test, refine and help you launch — then hand over everything agreed." },
];

export const collaboration = [
  {
    step: "01",
    title: "Initial Conversation",
    text: "You tell us about the project. No jargon required — just your goals in your own words.",
    items: ["Your business", "Your website goals", "Your audience", "Desired functionality", "Visual preferences"],
  },
  {
    step: "02",
    title: "Project Planning",
    text: "Together we turn ideas into a clear, written plan so expectations are aligned from day one.",
    items: ["Scope", "Pages", "Features", "Timeline", "Budget", "Content requirements"],
  },
  {
    step: "03",
    title: "Design Direction",
    text: "We establish how the website will look, feel and read before investing in full build-out.",
    items: ["Layout", "Visual direction", "Typography", "Colours", "Content structure"],
  },
  {
    step: "04",
    title: "Design & Development",
    text: "We design and build the website, keeping you informed and sharing progress at agreed milestones.",
    items: ["Page design", "Responsive build", "Milestone previews", "Ongoing communication"],
  },
  {
    step: "05",
    title: "Review",
    text: "You review the website. We collect structured feedback and work through revisions within the agreed scope.",
    items: ["Staging preview", "Consolidated feedback", "Scoped revisions"],
  },
  {
    step: "06",
    title: "Launch",
    text: "We help prepare the website for deployment and make sure it is ready for real visitors.",
    items: ["Deployment", "Domain connection assistance", "Basic SEO checks", "Responsive testing", "Final review"],
  },
  {
    step: "07",
    title: "Handover",
    text: "We deliver the completed website and relevant project details according to the agreed arrangement.",
    items: ["Site access", "Project files as agreed", "Usage guidance"],
  },
];

export const reasons = [
  { title: "Direct communication", text: "You talk to the people designing and building your site. No account managers, no relay." },
  { title: "Custom designs", text: "Every layout is designed for your brand. We don't resell templates as bespoke work." },
  { title: "No unnecessary complexity", text: "We recommend what your goals actually need — nothing bloated, nothing upsold." },
  { title: "Responsive by default", text: "Designed and tested for phones, tablets, laptops and large screens." },
  { title: "Performance-conscious", text: "Lean code, optimised assets and careful animation keep things fast." },
  { title: "Transparent pricing", text: "Clear starting price, written scope and no surprise line items." },
  { title: "Thoughtful collaboration", text: "Structured check-ins and honest advice from first call to launch." },
];

export const faqs = [
  {
    q: "How much does a website cost?",
    a: "It depends on scope — number of pages, features, content and integrations. Our websites start at ₹15,000 for a professionally designed site of up to approximately five core pages. After our first conversation we share a clear, written quote.",
  },
  {
    q: "What is the starting price?",
    a: "₹15,000 INR. This covers a defined starting package (see 'What's included' above). Larger sites, e-commerce, custom functionality and third-party costs are quoted separately.",
  },
  {
    q: "How long does a website take?",
    a: "Timelines depend on scope and how quickly content and feedback are available. A focused starter website typically takes a few weeks. We confirm an estimated timeline during planning.",
  },
  {
    q: "Do you work with businesses outside India?",
    a: "Yes. We work remotely and are happy to collaborate with clients in other countries. Pricing and payment arrangements are discussed during planning.",
  },
  {
    q: "Can I request a custom website?",
    a: "Absolutely — custom design is what we do. Every project is designed around your brand, audience and goals.",
  },
  {
    q: "Can you redesign an existing website?",
    a: "Yes. Website revamps are one of our core services. We review what works, what doesn't and rebuild with a clearer structure and modern design.",
  },
  {
    q: "Will my website work on mobile?",
    a: "Yes. Every website we build is responsive and tested across phones, tablets and desktops.",
  },
  {
    q: "Do you provide backend services?",
    a: "No. We're a design and frontend development studio — we don't build or maintain backends such as custom servers, databases, user logins, admin dashboards or APIs. If your project needs that, we can recommend trusted third-party tools and build the frontend around them.",
  },
  {
    q: "How is the ₹15,000 broken down?",
    a: "Discovery & consultation ₹1,000 · Domain consultation & GoDaddy guidance ₹1,500 · Business email setup ₹2,000 · UI/UX design ₹4,000 · Frontend build ₹4,500 · Basic SEO ₹1,000 · Deployment & launch ₹1,000. Third-party costs (like the domain itself) are paid directly by you.",
  },
  {
    q: "Do you provide hosting?",
    a: "Hosting is not included in the starting price. We can recommend suitable providers and assist with deployment. Hosting and domain costs are paid directly to the provider.",
  },
  {
    q: "Do you provide maintenance?",
    a: "Ongoing maintenance or updates can be arranged separately. Let us know what you need and we'll suggest a sensible arrangement.",
  },
  {
    q: "Can I update the website later?",
    a: "Yes. Depending on how the site is built, you can make content updates yourself or ask us to help. We discuss this during planning so the setup suits you.",
  },
  {
    q: "What happens after I contact you?",
    a: "We read your enquiry, reply to arrange a short conversation, then share a proposed scope, timeline and quote. Nothing begins until you're happy with the plan.",
  },
];

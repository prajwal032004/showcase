import { services } from "@/lib/services";
import { projects, categories } from "@/lib/projects";

/** Mega-menu content for every top-level nav item (edit freely). */
export type NavLink = { label: string; href: string; desc?: string };
export type NavMenu = {
  href: string;
  label: string;
  intro: string;
  columns: { title: string; links: NavLink[] }[];
  feature?: "pricing" | "project" | "contact" | "founders" | "home";
};

export const navMenus: NavMenu[] = [
  {
    href: "/",
    label: "Home",
    intro: "A quick tour of the studio — what we do, how we work and what it costs.",
    feature: "home",
    columns: [
      {
        title: "On this page",
        links: [
          { label: "The studio", href: "/#statement", desc: "Why your website matters" },
          { label: "What we do", href: "/#what-we-do", desc: "Four core services" },
          { label: "Selected work", href: "/#work", desc: "Live & concept projects" },
        ],
      },
      {
        title: "Keep exploring",
        links: [
          { label: "Our process", href: "/#process", desc: "Discover → Deliver" },
          { label: "Why work with us", href: "/#why-us", desc: "Direct, transparent, custom" },
          { label: "Pricing", href: "/#pricing", desc: "From ₹15,000" },
        ],
      },
    ],
  },
  {
    href: "/about",
    label: "About",
    intro: "Small team. Big ideas. Meet the people and principles behind the studio.",
    feature: "founders",
    columns: [
      {
        title: "The studio",
        links: [
          { label: "Our story", href: "/about#story", desc: "Why we started" },
          { label: "The founders", href: "/about#founders", desc: "Prajwal & Pratik" },
        ],
      },
      {
        title: "How we think",
        links: [
          { label: "Our philosophy", href: "/about#philosophy", desc: "What we believe" },
          { label: "What makes us different", href: "/about#different", desc: "No middlemen" },
        ],
      },
    ],
  },
  {
    href: "/services",
    label: "Services",
    intro: "Everything you need to launch a website worth remembering.",
    feature: "pricing",
    columns: [
      {
        title: "Services",
        links: services.map((s) => ({ label: s.title, href: `/services#${s.slug}`, desc: s.short.split(/[.,—]/)[0] })),
      },
      {
        title: "Pricing & process",
        links: [
          { label: "What's included", href: "/services#pricing", desc: "The starting package" },
          { label: "Cost breakdown", href: "/services#breakdown", desc: "Where ₹15,000 goes" },
          { label: "How we collaborate", href: "/services#collaboration", desc: "7 clear steps" },
          { label: "FAQ", href: "/services#faq", desc: "Questions, answered" },
        ],
      },
    ],
  },
  {
    href: "/showcase",
    label: "Showcase",
    intro: "Live client work and design concepts that define our approach.",
    feature: "project",
    columns: [
      {
        title: "Browse by category",
        links: categories.map((c) => ({
          label: c,
          href: c === "All" ? "/showcase" : `/showcase?category=${encodeURIComponent(c)}`,
          desc: `${c === "All" ? projects.length : projects.filter((p) => p.category === c).length} project(s)`,
        })),
      },
    ],
  },
  {
    href: "/contact",
    label: "Contact",
    intro: "Tell us what you're building — we'll take it from there.",
    feature: "contact",
    columns: [
      {
        title: "Get in touch",
        links: [
          { label: "Start a project", href: "/contact", desc: "Guided inquiry form" },
          { label: "AI project planner", href: "/contact#planner-title", desc: "Instant scope & estimate" },
          { label: "Privacy policy", href: "/privacy-policy", desc: "How we handle data" },
          { label: "Terms & conditions", href: "/terms-and-conditions", desc: "How we work together" },
        ],
      },
    ],
  },
];

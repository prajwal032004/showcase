# Forma Studio — website

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Three.js · GSAP + ScrollTrigger · Lenis · Framer Motion.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Customise in one place

| What | File |
| --- | --- |
| Studio name, email, URL, availability, pricing, hero copy, socials, nav, legal placeholders | `lib/site.ts` |
| Services, process, collaboration steps, FAQ | `lib/services.ts` |
| Showcase projects (add real screenshots via `media`) | `lib/projects.ts` |
| Founders (role, bio, skills, photo, links) | `lib/founders.ts` |
| Assistant answers / intents | `lib/ai/engine.ts` |
| Estimator prices, feature rules, industries | `lib/ai/estimator.ts` |
| Colours, type scale, utilities | `app/globals.css` |

Set these in `.env.local` for production (see `.env.example`):

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_STUDIO_EMAIL=you@your-domain.com
```

## Notes

- **Contact form** never sends anything itself. It validates, formats an email, and opens Gmail compose (or the default mail app / clipboard as fallbacks). The visitor presses Send.
- **Assistant & AI planner** run fully in the browser (intent scoring, typo tolerance, context, and a rules-based project estimator). No API keys or network calls. Estimates are labelled as indicative.
- **Loader** shows once per browser session and is skipped for reduced-motion users.
- **Legal pages** are drafts with `[PLACEHOLDERS]` that need legal review before launch.
- Brand icons aren't bundled; social links are text placeholders in `lib/site.ts`.

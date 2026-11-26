import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { founders } from "@/lib/founders";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel, Marquee } from "@/components/ui/Section";
import { Reveal, SplitReveal, ScrubText } from "@/components/motion/Reveal";
import { FinalCTA } from "@/components/home/FinalCTA";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `Meet ${site.name} — an independent website design and development team helping businesses build a better digital presence through custom, thoughtful websites.`,
  path: "/about",
});

const philosophy = [
  ["Design should solve problems", "Beautiful is the baseline. Every decision should make something clearer, easier or more persuasive."],
  ["Useful and beautiful", "A website earns attention with craft and keeps it with clarity. We refuse to trade one for the other."],
  ["Performance matters", "Speed is part of the experience. Lean pages respect your visitors' time, data and patience."],
  ["Every business deserves a strong presence", "Great websites shouldn't be reserved for big budgets. We build thoughtfully at every scale."],
  ["Transparent communication", "Clear scope, honest timelines and plain language — no jargon, no surprises."],
  ["Websites that serve real goals", "Enquiries, sales, bookings, trust. We design around the outcome you actually need."],
];

const different = [
  ["Direct collaboration", "You speak with the founders who design and build your site."],
  ["Personalised design", "No recycled templates — a visual identity made for your brand."],
  ["Transparent pricing", "A clear starting price and a written scope before work begins."],
  ["Modern development", "Current, well-supported tools that keep your site fast and maintainable."],
  ["Attention to detail", "Spacing, motion, states, accessibility — the small things done properly."],
  ["No unnecessary middlemen", "No agency layers between your ideas and the people executing them."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About the studio"
        title={["Small team.", "Big ideas.", "Thoughtful digital", "experiences."]}
        accent={1}
        intro={`${site.name} is an independent website design and development team. We help businesses establish a better digital presence with custom websites that look distinctive, load fast and make it easy for the right people to say yes.`}
      />

      <section id="story" aria-labelledby="story-title" className="bg-lav pb-24 sm:pb-32">
        <div className="container-x grid gap-10 border-t hairline pt-16 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index="01">Our story</SectionLabel>
            <h2 id="story-title" className="sr-only">
              Our story
            </h2>
          </div>
          <div className="lg:col-span-9">
            <ScrubText
              className="font-display text-[clamp(1.7rem,3.6vw,3.4rem)] font-light leading-[1.12] tracking-[-0.03em]"
              text="We started this studio because too many businesses settle for websites that look generic, load slowly and say very little. We believe a small, focused team can do better — with care, craft and honest collaboration."
              highlight={["care", "craft", "honest", "collaboration"]}
            />
          </div>
        </div>
      </section>

      {/* Founders */}
      <section id="founders" aria-labelledby="founders-title" className="bg-paper py-24 sm:py-32 lg:flex lg:min-h-[100svh] lg:items-center lg:py-16">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-4">
            <SectionLabel index="02">The founders</SectionLabel>
            <SplitReveal id="founders-title" as="h2" text="The people behind the pixels." className="display-lg mt-6" />
            <p className="mt-6 max-w-sm leading-relaxed text-ink/65">
              Two founders, one standard. You work directly with the people who design and build your website — from the first call to launch day.
            </p>
            <ButtonLink href="/contact" icon className="mt-8">
              Work with us
            </ButtonLink>
          </div>
          <Reveal className="grid gap-6 md:grid-cols-2 lg:col-span-8" stagger={0.15}>
            {founders.map((f, i) => (
              <article key={f.name} className="group relative overflow-hidden rounded-3xl bg-lav ring-1 ring-ink/[0.06]">
                <div className="relative aspect-[5/4] overflow-hidden bg-[linear-gradient(150deg,#ADBDDA,#7091E6_60%,#3D52A0)] lg:aspect-auto lg:h-[min(36svh,24rem)]" data-ctx-image>
                  <div className="grid-lines absolute inset-0 opacity-40 invert" aria-hidden />
                  {/* Photo placeholder — set `photo` in lib/founders.ts */}
                  <div className="absolute inset-0 flex items-end justify-center" aria-hidden>
                    <div className="relative h-[78%] w-[58%] transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:-translate-y-3">
                      <div className="absolute left-1/2 top-0 aspect-square w-[44%] -translate-x-1/2 rounded-full bg-lav/30 backdrop-blur-sm" />
                      <div className="absolute bottom-0 left-0 right-0 h-[58%] rounded-t-full bg-lav/25 backdrop-blur-sm" />
                    </div>
                  </div>
                  <span className="absolute left-6 top-5 font-display text-8xl font-extralight lg:text-7xl tracking-[-0.06em] text-lav/90">{f.initials}</span>
                  <span className="absolute bottom-5 right-5 rounded-full bg-night/50 px-3 py-1 text-xs text-lav/80 backdrop-blur">Profile photo placeholder</span>
                  <span className="absolute right-6 top-6 font-mono text-xs text-lav/70">0{i + 1}</span>
                </div>
                <div className="p-7 sm:p-9 lg:p-7">
                  <h3 className="font-display text-3xl font-normal tracking-[-0.035em] sm:text-4xl lg:text-3xl">{f.name}</h3>
                  <p className="mt-2 text-sm font-medium text-deep">{f.role}</p>
                  <p className="mt-4 leading-relaxed text-ink/65 lg:mt-3 lg:text-[0.95rem]">{f.bio}</p>
                  <ul className="mt-5 flex flex-wrap gap-2 lg:mt-4" aria-label="Skills and expertise">
                    {f.skills.map((s, j) => (
                      <li key={j} className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink/60">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-5 border-t hairline pt-5 lg:mt-5 lg:pt-4">
                    {f.socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/s inline-flex items-center gap-1 text-sm text-ink/70 hover:text-deep"
                        aria-label={`${f.name} on ${s.label} (placeholder link)`}
                      >
                        {s.label}
                        <ArrowUpRight className="size-3.5 transition-transform group-hover/s:-translate-y-0.5 group-hover/s:translate-x-0.5" aria-hidden />
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section id="philosophy" aria-labelledby="philosophy-title" className="bg-lav py-24 sm:py-32">
        <div className="container-x">
          <SectionLabel index="03">Our philosophy</SectionLabel>
          <SplitReveal id="philosophy-title" as="h2" text="What we believe about the web." className="display-lg mt-6 max-w-4xl" />
          <Reveal as="ol" className="mt-16 grid gap-px overflow-hidden bg-ink/10 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {philosophy.map(([t, d], i) => (
              <li key={t} className="group bg-lav p-7 transition-colors duration-500 hover:bg-paper sm:p-9">
                <span className="font-display text-5xl font-extralight tracking-[-0.05em] text-deep/80 transition-colors group-hover:text-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-8 font-display text-2xl font-normal tracking-[-0.03em]">{t}</h3>
                <p className="mt-3 leading-relaxed text-ink/60">{d}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <Marquee
        className="panel bg-deep py-7 font-display text-[clamp(1.6rem,3.4vw,3rem)] font-light tracking-[-0.03em] text-lav"
        items={["Direct collaboration", "Personalised design", "Transparent pricing", "Modern development", "Attention to detail"]}
        duration={45}
      />

      {/* Different */}
      <section id="different" aria-labelledby="different-title" className="panel my-3 bg-night py-24 text-lav sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="04" light>
              What makes us different
            </SectionLabel>
            <SplitReveal id="different-title" as="h2" text="Studio quality, without the agency layers." className="display-md mt-6" />
          </div>
          <Reveal as="ul" className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7" stagger={0.07}>
            {different.map(([t, d]) => (
              <li key={t} className="border-t border-lav/15 pt-6">
                <h3 className="font-display text-xl font-normal tracking-[-0.02em]">{t}</h3>
                <p className="mt-2 leading-relaxed text-lav/60">{d}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <FinalCTA title="Have an idea? Let's turn it into a digital experience." cta="Start the conversation" />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { services, faqs } from "@/lib/services";
import { pricing, site, absoluteUrl } from "@/lib/site";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/Section";
import { Reveal, SplitReveal, CountUp } from "@/components/motion/Reveal";
import { ServiceVisual } from "@/components/ui/ServiceVisual";
import { ButtonLink } from "@/components/ui/Button";
import { Collaboration } from "@/components/services/Collaboration";
import { PriceBreakdown } from "@/components/services/PriceBreakdown";
import { FAQ } from "@/components/services/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Web Design Services & Pricing — From ₹15,000",
  description:
    "Custom website design, development, landing pages, e-commerce and website revamps. See the itemised ₹15,000 starter package, our 7-step process and FAQs.",
  path: "/services",
});

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...services.map((s) => ({
        "@type": "Service",
        name: s.title,
        description: s.intro,
        serviceType: s.title,
        provider: { "@id": `${site.url}/#organization` },
        url: absoluteUrl(`/services#${s.slug}`),
      })),
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        label="Services"
        title={["Everything you need", "to launch a website", "worth remembering."]}
        accent={2}
        intro="From the first wireframe to launch day — here's exactly what we do, what you get and how we'll work together."
      >
        <nav aria-label="Service sections" className="mt-10 flex flex-wrap gap-2">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`#${s.slug}`}
              className="rounded-full border border-ink/10 bg-paper/60 px-4 py-2 text-sm text-ink/70 transition-colors hover:border-deep hover:bg-deep hover:text-lav"
            >
              {s.title}
            </Link>
          ))}
          <Link href="#pricing" className="rounded-full bg-deep px-4 py-2 text-sm text-lav transition-colors hover:bg-ink">
            Pricing
          </Link>
        </nav>
      </PageHero>

      {/* Service details */}
      <section aria-labelledby="svc-list-title" className="bg-paper py-24 sm:py-32">
        <div className="container-x">
          <SectionLabel index="01">What we do</SectionLabel>
          <SplitReveal id="svc-list-title" as="h2" text="Six ways we help businesses grow online." className="display-lg mt-6 max-w-4xl" />

          <div className="mt-20 space-y-24 sm:space-y-32">
            {services.map((s, i) => (
              <article key={s.slug} id={s.slug} className="group grid scroll-mt-28 gap-10 border-t hairline pt-10 lg:grid-cols-12 lg:gap-16" aria-labelledby={`${s.slug}-t`}>
                <div className="lg:col-span-5">
                  <div className="lg:sticky lg:top-28">
                    <span className="font-display text-7xl font-extralight tracking-[-0.06em] text-deep sm:text-8xl">{s.index}</span>
                    <h3 id={`${s.slug}-t`} className="mt-4 font-display text-4xl font-light tracking-[-0.04em] sm:text-5xl">
                      {s.title}
                    </h3>
                    <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/65">{s.intro}</p>
                    <div className={`mt-8 max-w-md overflow-hidden rounded-3xl ${i % 2 ? "bg-deep" : "bg-lav"} ring-1 ring-ink/[0.06]`}>
                      <ServiceVisual kind={s.visual} dark={i % 2 === 1} />
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <Reveal as="ul" className="grid gap-px overflow-hidden rounded-3xl bg-ink/[0.08] sm:grid-cols-2" stagger={0.05}>
                    {s.points.map((p) => (
                      <li key={p.title} className="bg-paper p-6 transition-colors duration-500 hover:bg-lav sm:p-7">
                        <span className="grid size-8 place-items-center rounded-full bg-deep/10 text-deep">
                          <Check className="size-4" aria-hidden />
                        </span>
                        <h4 className="mt-5 text-lg font-medium tracking-[-0.01em]">{p.title}</h4>
                        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/60">{p.text}</p>
                      </li>
                    ))}
                  </Reveal>
                  {s.note && (
                    <p className="mt-6 rounded-3xl border border-deep/20 bg-deep/[0.05] p-5 text-sm leading-relaxed text-ink/75">
                      <strong className="font-semibold text-deep">Priced separately: </strong>
                      {s.note}
                    </p>
                  )}
                  <div className="mt-8">
                    <ButtonLink href={`/contact?type=${encodeURIComponent(s.title)}`} variant="secondary" icon>
                      Discuss {s.title.toLowerCase()}
                    </ButtonLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" aria-labelledby="pricing-title" className="grain panel relative scroll-mt-20 bg-deep py-24 text-lav sm:py-32">
        <div className="pointer-events-none absolute -left-40 top-0 size-[40rem] rounded-full bg-peri/30 blur-[120px]" aria-hidden />
        <div className="container-x relative">
          <SectionLabel index="02" light>
            Pricing
          </SectionLabel>
          <SplitReveal id="pricing-title" as="h2" text="What's included in our ₹15,000 starting package?" className="display-md mt-6 max-w-4xl" />

          <div className="mt-16 grid gap-6 lg:grid-cols-12">
            <div className="relative overflow-hidden rounded-[2rem] bg-lav p-8 text-ink sm:p-12 lg:col-span-7">
              <div className="grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(200deg,black,transparent_60%)]" aria-hidden />
              <div className="relative">
                <p className="eyebrow text-ink/50">Starter website · from</p>
                <p className="mt-3 font-display text-[clamp(4rem,7vw,10rem)] font-extralight leading-[0.85] tracking-[-0.07em] text-deep">
                  <CountUp to={pricing.startingPrice} prefix={pricing.symbol} />
                </p>
                <p className="mt-2 font-mono text-xs tracking-[0.2em] text-ink/40">{pricing.currency} · STARTING PRICE</p>
                <p className="mt-8 max-w-md leading-relaxed text-ink/70">
                  A professionally designed and built website for businesses that need a credible, modern presence. Proposed scope — confirmed with you before we begin.
                </p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {pricing.included.map((it) => (
                    <li key={it} className="flex gap-3 text-[0.95rem] text-ink/80">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-deep text-lav">
                        <Check className="size-3" aria-hidden />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-wrap gap-3">
                  <ButtonLink href="/contact" size="lg" icon>
                    Discuss your project
                  </ButtonLink>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className="rounded-[2rem] border border-lav/15 bg-night/40 p-8 sm:p-10">
                <h3 className="font-display text-2xl font-normal tracking-[-0.02em]">Not included in the starting price</h3>
                <p className="mt-2 text-sm text-lav/60">These can be arranged or quoted separately when needed.</p>
                <ul className="mt-6 space-y-3">
                  {pricing.notIncluded.map((it) => (
                    <li key={it} className="flex gap-3 text-[0.95rem] text-lav/80">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-lav/25">
                        <Minus className="size-3" aria-hidden />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[2rem] border border-lav/15 p-8 sm:p-10">
                <h3 className="font-display text-xl font-normal tracking-[-0.02em]">Good to know</h3>
                <ul className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-lav/70">
                  <li>{pricing.fineprint}</li>
                  <li>Revisions are included within the agreed scope. Additional rounds or new features are quoted transparently.</li>
                  <li>Larger websites, e-commerce and custom functionality are quoted based on your requirements.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PriceBreakdown />

      <Collaboration />

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-title" className="bg-paper py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel index="04">FAQ</SectionLabel>
            <SplitReveal id="faq-title" as="h2" text="Questions, answered." className="display-md mt-6" />
            <p className="mt-6 max-w-sm leading-relaxed text-ink/65">
              Can&apos;t find what you&apos;re looking for?{" "}
              <Link href="/contact" className="text-deep underline underline-offset-4">
                Ask us directly
              </Link>
              .
            </p>
          </div>
          <div className="lg:col-span-8">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}

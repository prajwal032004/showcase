import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredServices } from "@/lib/services";
import { SectionLabel } from "@/components/ui/Section";
import { SplitReveal, Reveal } from "@/components/motion/Reveal";
import { ServiceVisual } from "@/components/ui/ServiceVisual";
import { ButtonLink } from "@/components/ui/Button";

export function ServicesPreview() {
  return (
    <section aria-labelledby="services-title" className="relative bg-lav py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel index="02">What we do</SectionLabel>
            <SplitReveal id="services-title" as="h2" text="Services shaped around outcomes." className="display-lg mt-6 max-w-4xl" />
          </div>
          <ButtonLink href="/services" variant="secondary" icon>
            All services
          </ButtonLink>
        </div>

        <Reveal className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-ink/10 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {featuredServices.map((s) => (
            <Link
              key={s.slug}
              href={`/services#${s.slug}`}
              className="group relative flex flex-col bg-lav p-6 transition-colors duration-500 hover:bg-paper sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-deep">{s.index}</span>
                <span className="grid size-9 place-items-center rounded-full border border-ink/10 transition-all duration-500 group-hover:rotate-45 group-hover:border-deep group-hover:bg-deep group-hover:text-lav">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </div>
              <ServiceVisual kind={s.visual} className="my-6" />
              <h3 className="font-display text-2xl font-normal tracking-[-0.03em]">{s.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/60">{s.short}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-deep">
                Learn more
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
              </span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-deep transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

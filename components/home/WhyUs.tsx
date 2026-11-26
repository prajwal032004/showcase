import { reasons } from "@/lib/services";
import { SectionLabel } from "@/components/ui/Section";
import { SplitReveal, Reveal } from "@/components/motion/Reveal";

export function WhyUs() {
  return (
    <section id="why-us" aria-labelledby="why-title" className="grain panel relative bg-deep py-24 text-lav sm:py-32">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[40rem] rounded-full bg-peri/30 blur-[120px]" aria-hidden />
      <div className="container-x relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel index="05" light>
            Why work with us
          </SectionLabel>
          <SplitReveal id="why-title" as="h2" text="A studio that feels like part of your team." className="display-md mt-6" />
          <p className="mt-6 max-w-md leading-relaxed text-lav/70">
            Small by design. You work directly with the people crafting your website — with honest advice, clear scope and genuine care for the result.
          </p>
        </div>
        <Reveal as="ul" className="lg:col-span-7" stagger={0.06}>
          {reasons.map((r, i) => (
            <li key={r.title} className="group grid grid-cols-[3rem_1fr] gap-4 border-t border-lav/15 py-6 last:border-b sm:grid-cols-[4rem_1fr_1.3fr] sm:items-baseline">
              <span className="font-mono text-xs text-peri">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-xl font-normal tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-2 sm:text-2xl">{r.title}</h3>
              <p className="col-start-2 text-[0.95rem] leading-relaxed text-lav/65 sm:col-start-3">{r.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

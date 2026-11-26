import { Check } from "lucide-react";
import { pricing } from "@/lib/site";
import { SectionLabel } from "@/components/ui/Section";
import { CountUp, Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { EstimateButton } from "@/components/ai/EstimateButton";

export function PricingPreview() {
  return (
    <section aria-labelledby="pricing-title" className="relative overflow-hidden bg-lav py-24 sm:py-32">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-paper ring-1 ring-ink/[0.06]">
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(90deg,transparent,black)]" aria-hidden />
          <div className="relative grid gap-12 p-7 sm:p-12 lg:grid-cols-12 lg:p-16">
            <div className="lg:col-span-7">
              <SectionLabel index="06">Pricing</SectionLabel>
              <h2 id="pricing-title" className="mt-8 font-display text-lg font-normal text-ink/60">
                Websites starting at
              </h2>
              <p className="mt-2 font-display text-[clamp(4.2rem,9vw,13rem)] font-extralight leading-[0.85] tracking-[-0.07em] text-deep">
                <CountUp to={pricing.startingPrice} prefix={pricing.symbol} />
              </p>
              <p className="mt-2 font-mono text-xs tracking-[0.2em] text-ink/40">{pricing.currency} · STARTING PRICE</p>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink/70">{pricing.summary}</p>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/50">
                Final pricing depends on scope. Larger sites, e-commerce, custom functionality and third-party costs are quoted separately.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/contact" size="lg" icon>
                  Discuss your project
                </ButtonLink>
                <EstimateButton />
              </div>
              <a href="/services#breakdown" className="mt-5 inline-block text-sm font-medium text-deep underline-offset-4 hover:underline">
                See the full {pricing.startingPriceLabel} cost breakdown →
              </a>
            </div>
            <div className="lg:col-span-5 lg:border-l lg:border-ink/10 lg:pl-12">
              <p className="eyebrow text-ink/45">The starting package typically includes</p>
              <Reveal as="ul" className="mt-6 space-y-3.5" stagger={0.05}>
                {pricing.included.slice(0, 7).map((item) => (
                  <li key={item} className="flex gap-3 text-[0.95rem] text-ink/75">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-deep/10 text-deep">
                      <Check className="size-3" aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

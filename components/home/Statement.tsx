import { ScrubText, Reveal } from "@/components/motion/Reveal";
import { SectionLabel, Marquee } from "@/components/ui/Section";

export function Statement() {
  return (
    <section id="statement" aria-labelledby="statement-title" className="relative bg-lav pb-20 pt-28 sm:pb-28 sm:pt-40">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index="01">The studio</SectionLabel>
            <h2 id="statement-title" className="sr-only">
              Why your website matters
            </h2>
          </div>
          <div className="lg:col-span-9">
            <ScrubText
              className="font-display text-[clamp(1.9rem,3.3vw,5rem)] font-light leading-[1.08] tracking-[-0.035em] text-ink"
              text="Your website is more than a digital presence. It's your first impression, your storefront and your opportunity."
              highlight={["first", "impression", "storefront", "opportunity"]}
            />
            <Reveal className="mt-14 grid gap-8 border-t hairline pt-8 sm:grid-cols-3" stagger={0.1}>
              {[
                ["Strategy first", "Every layout starts with what your visitors need and what you need from them."],
                ["Crafted, not templated", "Original design systems built around your brand — never a reskinned theme."],
                ["Built to perform", "Fast, accessible and responsive by default, on every screen."],
              ].map(([t, d]) => (
                <div key={t}>
                  <h3 className="text-lg font-medium tracking-[-0.01em]">{t}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/60">{d}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
      <Marquee
        className="mt-24 border-y hairline py-6 font-display text-[clamp(1.6rem,2.6vw,3.6rem)] font-light tracking-[-0.03em] text-ink/80 sm:mt-32"
        items={["Website Design", "Development", "E-commerce", "Landing Pages", "Website Revamps", "Brand Websites"]}
      />
    </section>
  );
}

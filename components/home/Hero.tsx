"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { hero, site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { useIntro, useSmoothScroll } from "@/components/layout/Providers";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

export function Hero() {
  const { ready } = useIntro();
  const { scrollTo } = useSmoothScroll();
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  // Text entrance once the intro finishes
  useIsoLayoutEffect(() => {
    const el = content.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-hero-line]", { yPercent: 115, rotate: 2 });
        gsap.set("[data-hero-fade]", { y: 24, opacity: 0 });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  useIsoLayoutEffect(() => {
    if (!ready || !content.current) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.to("[data-hero-line]", { yPercent: 0, rotate: 0, duration: 1.4, ease: "expo.out", stagger: 0.09 })
          .to("[data-hero-fade]", { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.08 }, "-=1.0");

        // Scroll: headline drifts up & fades while the 3D world dollies in
        gsap.to("[data-hero-copy]", {
          yPercent: -18,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: "70% top", scrub: true },
        });
      });
    }, content.current);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[radial-gradient(120%_80%_at_70%_100%,#dfe2f6_0%,#ede8f5_55%,#f3f0f9_100%)]"
    >
      {/* 3D world */}
      <div className="absolute inset-x-0 bottom-0 top-[50%] -z-10 sm:top-[42%] lg:inset-0">
        {webglFailed ? <SceneFallback /> : <HeroScene ready={ready} triggerRef={section} onFail={() => setWebglFailed(true)} brand={site.wordmark} />}
      </div>
      {/* Legibility veil */}
      <div className="pointer-events-none absolute inset-0 -z-[5] bg-[linear-gradient(180deg,rgba(237,232,245,1)_0%,rgba(237,232,245,.9)_48%,rgba(237,232,245,0)_62%)] lg:bg-[linear-gradient(100deg,rgba(237,232,245,.96)_0%,rgba(237,232,245,.78)_38%,rgba(237,232,245,0)_64%)]" />

      <div ref={content} className="container-x relative flex min-h-[100svh] flex-col pb-10 pt-28 sm:pt-32 lg:pt-36">
        <div data-hero-copy className="max-w-[min(100%,74rem)]">
          <div data-hero-fade className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-paper/70 py-1.5 pl-2 pr-3.5 text-[0.78rem] text-ink/75 backdrop-blur-sm sm:text-sm">
            <span className="relative grid size-5 place-items-center rounded-full bg-deep/10">
              <span className="animate-pulse-dot size-1.5 rounded-full bg-deep" />
            </span>
            {hero.status}
          </div>

          <h1 id="hero-title" className="display-xl text-[clamp(2.3rem,5.1vw,9rem)]! uppercase text-ink" aria-label={hero.headline.join(" ")}>
            {hero.headline.map((line, i) => (
              <span key={i} className="mask-line" aria-hidden>
                <span data-hero-line className="block origin-bottom-left will-change-transform">
                  {i === 2 ? (
                    <>
                      <span className="font-extralight italic text-deep">{line.split(" ")[0]}</span> {line.split(" ").slice(1).join(" ")}
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-8 flex flex-col gap-8 sm:mt-10 md:max-w-xl">
            <p data-hero-fade className="text-base leading-relaxed text-ink/70 sm:text-lg">
              {hero.sub}
            </p>
            <div data-hero-fade className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/contact" size="lg" icon>
                Start a project
              </ButtonLink>
              <ButtonLink href="/showcase" size="lg" variant="secondary">
                Explore our work
              </ButtonLink>
            </div>
          </div>
        </div>

        <div aria-hidden className="h-[46svh] shrink-0 sm:h-[40svh] lg:hidden" />
        <div data-hero-fade className="mt-auto flex items-end justify-between pt-6 lg:pt-14">
          <button
            type="button"
            onClick={() => scrollTo("#statement")}
            className="group flex items-center gap-3 text-sm text-ink/60 transition-colors hover:text-ink"
            aria-label="Scroll to next section"
          >
            <span className="grid size-10 place-items-center rounded-full border border-ink/15 transition-colors group-hover:border-deep group-hover:bg-deep group-hover:text-lav">
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
            </span>
            Scroll to explore
          </button>
          <p className="eyebrow hidden text-ink/45 md:block">
            {site.location} — Est. {site.founded}
          </p>
        </div>
      </div>
    </section>
  );
}

function SceneFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -right-10 bottom-0 flex items-end gap-3 opacity-90 md:right-10">
        {[180, 260, 340, 420, 300].map((h, i) => (
          <div
            key={i}
            className="w-24 rounded-md bg-gradient-to-b from-paper to-[#dfe3f5] shadow-[0_30px_60px_-30px_rgba(61,82,160,.5)] md:w-32"
            style={{ height: h }}
          />
        ))}
      </div>
      <div className="animate-float absolute bottom-[360px] right-24 h-40 w-64 rounded-xl bg-gradient-to-br from-peri to-deep shadow-2xl md:right-64" />
    </div>
  );
}

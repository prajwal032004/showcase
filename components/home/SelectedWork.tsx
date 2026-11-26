"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { featuredProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/showcase/ProjectCard";
import { SectionLabel } from "@/components/ui/Section";
import { SplitReveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Desktop: the whole section pins and the track (intro panel + cards) glides
 * horizontally with scroll; cards are sized from the viewport height so they
 * always fit. Mobile/tablet: native swipe carousel with snap points.
 */
export function SelectedWork() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const total = featuredProjects.length;

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current!;
      const distance = () => Math.max(0, t.scrollWidth - window.innerWidth);
      const tween = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            setCurrent(Math.min(total - 1, Math.floor(self.progress * total)));
          },
        },
      });
      gsap.utils.toArray<HTMLElement>("[data-work-card]").forEach((card) => {
        gsap.fromTo(
          card,
          { y: 50, scale: 0.96 },
          {
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 45%", scrub: true },
          }
        );
      });
    });
    return () => mm.revert();
  }, [total]);

  const onSwipe = (e: React.UIEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 1024) return;
    const el = e.currentTarget;
    const card = el.querySelector<HTMLElement>("[data-work-card]");
    if (!card) return;
    setCurrent(Math.round(el.scrollLeft / (card.offsetWidth + 16)));
  };
  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>("[data-work-card]");
    if (el && card) el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: "smooth" });
  };

  return (
    <section
      ref={section}
      id="work"
      aria-labelledby="work-title"
      className="panel relative bg-paper py-20 sm:py-28 lg:flex lg:h-[100svh] lg:items-center lg:py-0"
    >
      {/* Mobile / tablet header */}
      <div className="container-x lg:hidden">
        <SectionLabel index="03">Selected work</SectionLabel>
        <SplitReveal id="work-title" as="h2" text="Concepts built to inspire." className="display-lg mt-6" />
        <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-ink/60">
          Concept projects that show how we think about design, structure and detail.
        </p>
      </div>

      <div
        ref={track}
        onScroll={onSwipe}
        className={cn(
          "no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-4",
          "lg:mt-0 lg:w-max lg:snap-none lg:items-center lg:gap-[3.5vw] lg:overflow-visible lg:pb-0 lg:pl-[var(--gutter)] lg:pr-[8vw] lg:will-change-transform"
        )}
      >
        {/* Desktop intro panel */}
        <div className="hidden w-[30vw] max-w-[30rem] shrink-0 flex-col justify-center lg:flex">
          <SectionLabel index="03">Selected work</SectionLabel>
          <h2 className="display-lg mt-6">Concepts built to inspire.</h2>
          <p className="mt-6 max-w-sm leading-relaxed text-ink/60">
            Concept projects that show how we think about design, structure and detail. Real client work will appear here as it launches.
          </p>
          <div className="mt-8 flex items-center gap-5">
            <ButtonLink href="/showcase" icon>
              View showcase
            </ButtonLink>
            <span className="font-mono text-xs text-ink/50 tabular-nums">
              {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-8 h-px w-full bg-ink/10">
            <div ref={bar} className="h-px origin-left scale-x-0 bg-deep" />
          </div>
          <p className="eyebrow mt-4 text-ink/40">Scroll to explore →</p>
        </div>

        {featuredProjects.map((p, i) => (
          <div
            key={p.slug}
            data-work-card
            className="w-[86vw] shrink-0 snap-start sm:w-[62vw] lg:w-[min(38vw,calc((100svh-260px)*1.42))]"
          >
            <ProjectCard project={p} index={i} size="lg" />
          </div>
        ))}

        <div className="flex w-[70vw] shrink-0 snap-start flex-col justify-center rounded-3xl bg-lav p-8 sm:w-[40vw] lg:w-[22vw] lg:bg-transparent lg:p-0">
          <p className="font-display text-3xl font-light tracking-[-0.04em] text-ink lg:text-4xl">More in the showcase.</p>
          <ButtonLink href="/showcase" icon className="mt-6 self-start">
            Explore all work
          </ButtonLink>
        </div>
      </div>

      {/* Mobile controls */}
      <div className="container-x mt-6 flex items-center justify-between lg:hidden">
        <div className="flex gap-1.5" aria-hidden>
          {featuredProjects.map((p, i) => (
            <span key={p.slug} className={cn("h-1.5 rounded-full transition-all duration-500", i === current ? "w-6 bg-deep" : "w-1.5 bg-ink/20")} />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => nudge(-1)} aria-label="Previous project" className="grid size-11 place-items-center rounded-full border border-ink/15 text-ink/70 active:scale-95">
            <ArrowLeft className="size-4" aria-hidden />
          </button>
          <button type="button" onClick={() => nudge(1)} aria-label="Next project" className="grid size-11 place-items-center rounded-full bg-deep text-lav active:scale-95">
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { process } from "@/lib/services";
import { SectionLabel } from "@/components/ui/Section";
import { SplitReveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const visuals = [
  // Discover — magnifier over notes
  <svg key="d" viewBox="0 0 200 140" className="h-full w-full" aria-hidden>
    {[30, 50, 70, 90].map((y, i) => (
      <rect key={y} x="30" y={y} width={[110, 80, 120, 60][i]} height="8" rx="4" fill="#ADBDDA" />
    ))}
    <circle cx="130" cy="70" r="30" fill="none" stroke="#3D52A0" strokeWidth="6" />
    <path d="M152 92l22 22" stroke="#3D52A0" strokeWidth="8" strokeLinecap="round" />
  </svg>,
  // Design — layout grid
  <svg key="de" viewBox="0 0 200 140" className="h-full w-full" aria-hidden>
    <rect x="25" y="20" width="150" height="100" rx="6" fill="#F8F6FC" stroke="#ADBDDA" />
    <rect x="35" y="30" width="60" height="40" rx="3" fill="#7091E6" />
    <rect x="105" y="30" width="60" height="8" rx="4" fill="#3D52A0" />
    <rect x="105" y="44" width="40" height="6" rx="3" fill="#ADBDDA" />
    <rect x="35" y="80" width="40" height="30" rx="3" fill="#ADBDDA" />
    <rect x="80" y="80" width="40" height="30" rx="3" fill="#8697C4" />
    <rect x="125" y="80" width="40" height="30" rx="3" fill="#EDE8F5" stroke="#ADBDDA" />
  </svg>,
  // Develop — brackets
  <svg key="dv" viewBox="0 0 200 140" className="h-full w-full" aria-hidden>
    <path d="M70 40L40 70l30 30M130 40l30 30-30 30" fill="none" stroke="#3D52A0" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M112 34L88 106" stroke="#7091E6" strokeWidth="8" strokeLinecap="round" />
  </svg>,
  // Deliver — rocket/arrow over stepped blocks
  <svg key="dl" viewBox="0 0 200 140" className="h-full w-full" aria-hidden>
    <rect x="30" y="100" width="140" height="18" rx="3" fill="#3D52A0" />
    <rect x="30" y="78" width="96" height="18" rx="3" fill="#7091E6" />
    <rect x="30" y="56" width="52" height="18" rx="3" fill="#8697C4" />
    <circle cx="150" cy="62" r="16" fill="#3D52A0" />
    <path d="M150 20v22M140 30l10-10 10 10" stroke="#3D52A0" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

export function Process() {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-step]");
      items.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
      if (line.current) {
        gsap.fromTo(
          line.current,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: list.current, start: "top 60%", end: "bottom 60%", scrub: true } }
        );
      }
    }, list);
    return () => ctx.revert();
  }, []);

  return (
    <section aria-labelledby="process-title" className="relative bg-lav py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionLabel index="04">Our process</SectionLabel>
            <SplitReveal id="process-title" as="h2" text="Four clear steps. Zero guesswork." className="display-md mt-6" />
            <div className="relative mt-10 hidden aspect-[10/7] overflow-hidden rounded-3xl bg-paper ring-1 ring-ink/[0.06] lg:block">
              <div className="grid-lines absolute inset-0 opacity-60" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="absolute inset-0 p-10"
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  {visuals[active]}
                </motion.div>
              </AnimatePresence>
              <span className="absolute bottom-5 left-6 font-display text-7xl font-extralight tracking-[-0.06em] text-deep/90">{process[active].step}</span>
            </div>
          </div>
        </div>

        <ol ref={list} className="relative lg:col-span-6 lg:col-start-7">
          <div className="absolute bottom-0 left-[1.1rem] top-0 w-px bg-ink/10" aria-hidden>
            <div ref={line} className="h-full w-full origin-top bg-deep" />
          </div>
          {process.map((p, i) => (
            <li key={p.step} data-step className="relative pb-16 pl-14 last:pb-0 lg:pb-28">
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group block w-full text-left"
                aria-pressed={active === i}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1 grid size-9 place-items-center rounded-full border font-mono text-xs transition-all duration-500",
                    active === i ? "border-deep bg-deep text-lav" : "border-ink/15 bg-lav text-ink/50"
                  )}
                >
                  {p.step}
                </span>
                <h3
                  className={cn(
                    "font-display text-[clamp(2rem,3vw,4rem)] font-light leading-none tracking-[-0.04em] transition-colors duration-500",
                    active === i ? "text-ink" : "text-ink/35 group-hover:text-ink/60"
                  )}
                >
                  {p.title}
                </h3>
                <p className={cn("mt-4 max-w-md leading-relaxed transition-colors duration-500", active === i ? "text-ink/70" : "text-ink/40")}>{p.text}</p>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

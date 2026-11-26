"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { collaboration } from "@/lib/services";
import { SectionLabel } from "@/components/ui/Section";
import { SplitReveal } from "@/components/motion/Reveal";
import { useSmoothScroll } from "@/components/layout/Providers";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Desktop: a sticky "journey" panel (sits below the navbar, vertically centred)
 * tracks the active step and doubles as navigation; compact step cards scroll
 * past on the right. Mobile: a simple vertical timeline.
 */
export function Collaboration() {
  const list = useRef<HTMLOListElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollTo } = useSmoothScroll();
  const total = collaboration.length;

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-collab]");
      // Robust: the active step is the last card whose top has crossed the viewport middle.
      ScrollTrigger.create({
        trigger: list.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: () => {
          const mid = window.innerHeight * 0.5;
          let idx = 0;
          items.forEach((el, i) => {
            if (el.getBoundingClientRect().top < mid) idx = i;
          });
          setActive(idx);
        },
      });
      gsap.fromTo(rail.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: list.current, start: "top 55%", end: "bottom 55%", scrub: true } });
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        items.forEach((el) =>
          gsap.from(el.querySelector("[data-collab-card]"), {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          })
        );
      });
    }, list);
    return () => ctx.revert();
  }, []);

  const goTo = (i: number) => {
    const el = list.current?.querySelectorAll<HTMLElement>("[data-collab]")[i];
    if (el) scrollTo(el, { offset: -window.innerHeight * 0.3 });
  };

  const step = collaboration[active];

  return (
    <section id="collaboration" aria-labelledby="collab-title" className="overflow-x-clip bg-lav py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-12">
        {/* Sticky journey panel */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 lg:flex lg:h-[calc(100svh-7.5rem)] lg:flex-col lg:justify-center">
            <SectionLabel index="03">How we collaborate</SectionLabel>
            <SplitReveal id="collab-title" as="h2" text="From first hello to handover." className="display-md mt-5" />
            <p className="mt-5 max-w-md leading-relaxed text-ink/65">
              A clear, structured process so you always know what is happening, what we need from you and what comes next.
            </p>

            <div className="mt-8 hidden overflow-hidden rounded-3xl bg-paper ring-1 ring-ink/[0.06] lg:block">
              <div className="flex items-end justify-between gap-6 border-b hairline px-7 pb-5 pt-6">
                <div className="min-w-0">
                  <p className="eyebrow text-ink/45">Now viewing</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={step.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="mt-2 truncate font-display text-2xl font-normal tracking-[-0.03em] text-ink"
                    >
                      {step.title}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <p className="flex shrink-0 items-baseline gap-1.5 font-display tabular-nums" aria-live="polite">
                  <span className="relative inline-block h-[3.6rem] overflow-hidden text-6xl font-extralight leading-none tracking-[-0.06em] text-deep">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={step.step}
                        className="block"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        {step.step}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="text-sm text-ink/40">/ {String(total).padStart(2, "0")}</span>
                </p>
              </div>
              <div className="h-1 bg-ink/[0.06]">
                <motion.div className="h-full bg-gradient-to-r from-peri to-deep" animate={{ width: `${((active + 1) / total) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
              </div>
              <ol className="grid grid-cols-1 gap-0.5 p-2" aria-label="Jump to step">
                {collaboration.map((c, i) => (
                  <li key={c.step}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active ? "step" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-4 py-2 text-left text-[0.95rem] transition-colors duration-300",
                        i === active ? "bg-deep text-lav" : i < active ? "text-ink/70 hover:bg-lav" : "text-ink/40 hover:bg-lav hover:text-ink/70"
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full font-mono text-[0.6rem]",
                          i === active ? "bg-lav/20" : i < active ? "bg-deep text-lav" : "border border-ink/15"
                        )}
                      >
                        {i < active ? <Check className="size-3" aria-hidden /> : c.step.slice(1)}
                      </span>
                      {c.title}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Step cards */}
        <ol ref={list} className="relative lg:col-span-7 lg:py-[12svh]">
          <div className="absolute bottom-0 left-[1.1rem] top-0 w-px bg-ink/10 sm:left-[1.35rem] lg:bottom-[12svh] lg:top-[12svh]" aria-hidden>
            <div ref={rail} className="h-full w-full origin-top bg-gradient-to-b from-peri to-deep" />
          </div>
          {collaboration.map((c, i) => (
            <li key={c.step} data-collab className="relative pb-6 pl-14 last:pb-0 sm:pl-20">
              <span
                className={cn(
                  "absolute left-0 top-6 grid size-9 place-items-center rounded-full border font-mono text-xs transition-all duration-500 sm:size-11",
                  i <= active ? "border-deep bg-deep text-lav shadow-[0_0_0_6px_rgba(61,82,160,.12)]" : "border-ink/15 bg-lav text-ink/45"
                )}
              >
                {c.step}
              </span>
              <div
                data-collab-card
                className={cn(
                  "grid gap-5 rounded-3xl p-6 ring-1 transition-[background-color,box-shadow,transform] duration-500 sm:p-7 md:grid-cols-[1fr_13rem] md:gap-8",
                  i === active ? "bg-paper ring-ink/[0.08] shadow-[0_30px_60px_-40px_rgba(22,27,63,.5)] lg:-translate-y-1" : "bg-paper/40 ring-ink/[0.06]"
                )}
              >
                <div>
                  <p className="eyebrow text-ink/40">Step {c.step}</p>
                  <h3 className="mt-2 font-display text-2xl font-normal tracking-[-0.03em] sm:text-[1.75rem]">{c.title}</h3>
                  <p className="mt-2.5 leading-relaxed text-ink/65">{c.text}</p>
                </div>
                <ul className="space-y-1.5 border-ink/[0.08] text-[0.88rem] md:border-l md:pl-6">
                  {c.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-ink/70">
                      <span className={cn("size-1.5 shrink-0 rounded-full", i <= active ? "bg-deep" : "bg-ink/25")} />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

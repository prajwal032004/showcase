"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { SectionLabel } from "./Section";
import { cn } from "@/lib/utils";

/** Editorial page header with masked line reveal and floating architectural blocks. */
export function PageHero({
  label,
  title,
  accent,
  intro,
  children,
  className,
}: {
  label: string;
  title: string[];
  /** index of the line rendered in italic indigo */
  accent?: number;
  intro?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ delay: 0.25 });
        tl.from("[data-ph-line]", { yPercent: 115, rotate: 2, duration: 1.3, ease: "expo.out", stagger: 0.08 })
          .from("[data-ph-fade]", { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, "-=0.9")
          .from("[data-ph-block]", { y: 120, opacity: 0, duration: 1.6, ease: "expo.out", stagger: 0.1 }, 0.1);
        gsap.utils.toArray<HTMLElement>("[data-ph-block]").forEach((b, i) =>
          gsap.to(b, { yPercent: -40 - i * 25, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={cn("relative overflow-hidden bg-lav pb-20 pt-36 sm:pb-28 sm:pt-44", className)}>
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_80%_30%,black,transparent_70%)]" aria-hidden />
      <div className="pointer-events-none absolute right-[4%] top-28 hidden h-[60%] w-[34%] lg:block" aria-hidden>
        <div data-ph-block className="absolute right-0 top-[10%] h-20 w-[78%] rounded-md bg-deep shadow-[0_30px_60px_-30px_rgba(61,82,160,.8)]" />
        <div data-ph-block className="absolute right-0 top-[34%] h-20 w-[54%] rounded-md bg-peri shadow-[0_30px_60px_-30px_rgba(112,145,230,.8)]" />
        <div data-ph-block className="absolute right-0 top-[58%] h-20 w-[30%] rounded-md bg-muted" />
        <div data-ph-block className="absolute right-[38%] top-[60%] size-16 rounded-full bg-deep" />
      </div>
      <div className="container-x relative">
        <div data-ph-fade>
          <SectionLabel>{label}</SectionLabel>
        </div>
        <h1 className="display-xl mt-8 max-w-[92rem] text-[clamp(2.6rem,5.4vw,9.5rem)]!">
          {title.map((l, i) => (
            <span key={i} className="mask-line">
              <span data-ph-line className={cn("block origin-bottom-left", i === accent && "font-extralight italic text-deep")}>
                {l}
              </span>
            </span>
          ))}
        </h1>
        {intro && (
          <p data-ph-fade className="mt-10 max-w-2xl text-lg leading-relaxed text-ink/70 sm:text-xl">
            {intro}
          </p>
        )}
        {children && <div data-ph-fade>{children}</div>}
      </div>
    </section>
  );
}

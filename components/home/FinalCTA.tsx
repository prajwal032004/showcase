"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { SplitReveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export function FinalCTA({
  title = "Your next website starts with a conversation.",
  cta = "Let's build something.",
}: {
  title?: string;
  cta?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const btn = useRef<HTMLAnchorElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-block]").forEach((b, i) => {
          gsap.fromTo(
            b,
            { y: 140 + i * 40, rotate: i % 2 ? 6 : -6 },
            { y: -40 - i * 30, rotate: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } }
          );
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !btn.current) return;
    const r = btn.current.getBoundingClientRect();
    gsap.to(btn.current, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25, duration: 0.6, ease: "power3.out" });
  };
  const onLeave = () => btn.current && gsap.to(btn.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });

  return (
    <section ref={root} aria-labelledby="cta-title" className="grain panel relative my-3 bg-night py-28 text-lav sm:py-40">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-1/2 size-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(112,145,230,.35),transparent_60%)]" />
        <div data-block className="absolute -left-10 bottom-10 h-28 w-56 rounded-md bg-deep/80 sm:left-[6%] sm:h-36 sm:w-72" />
        <div data-block className="absolute bottom-40 left-[12%] hidden h-24 w-40 rounded-md bg-peri/70 md:block" />
        <div data-block className="absolute right-[-3rem] top-16 h-32 w-60 rounded-md bg-muted/40 sm:right-[8%]" />
        <div data-block className="absolute right-[18%] top-40 hidden size-20 rounded-full bg-peri/80 md:block" />
      </div>
      <div className="container-x relative flex flex-col items-center text-center">
        <p className="eyebrow text-lav/50">{site.availability}</p>
        <SplitReveal id="cta-title" as="h2" text={title} className="display-lg mt-6 max-w-5xl" />
        <Link
          ref={btn}
          href="/contact"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="group relative mt-14 grid size-44 place-items-center overflow-hidden rounded-full bg-lav text-deep sm:size-56"
        >
          <span className="absolute inset-0 translate-y-full rounded-full bg-peri transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
          <span className="relative flex flex-col items-center gap-2 px-6 font-display text-lg font-medium leading-tight tracking-[-0.02em] transition-colors duration-500 group-hover:text-lav sm:text-xl">
            <ArrowUpRight className="size-7 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
            {cta}
          </span>
        </Link>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Tag = "div" | "section" | "p" | "span" | "li" | "ul" | "ol" | "h1" | "h2" | "h3" | "article" | "header";

/** Fades + lifts its direct children (or itself) in when scrolled into view. */
export function Reveal({
  as = "div",
  children,
  className,
  stagger = 0.08,
  y = 40,
  delay = 0,
  self = false,
  start = "top 85%",
  ...rest
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  delay?: number;
  /** animate the wrapper itself instead of its children */
  self?: boolean;
  start?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = self ? [el] : Array.from(el.children);
      gsap.set(targets, { y, opacity: 0 });
      ScrollTrigger.batch(targets as Element[], {
        start,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger, delay, overwrite: true }),
      });
    });
    return () => mm.revert();
  }, [self, y, stagger, delay, start]);
  const Comp = as as React.ElementType;
  return (
    <Comp ref={ref} className={className} {...rest}>
      {children}
    </Comp>
  );
}

/** Masked word-by-word (or char) headline reveal, triggered when scrolled into view. */
export function SplitReveal({
  text,
  as = "h2",
  className,
  by = "word",
  delay = 0,
  id,
}: {
  id?: string;
  text: string;
  as?: Tag;
  className?: string;
  by?: "word" | "char";
  delay?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Comp = as as React.ElementType;
  const words = text.split(" ");
  let n = 0;
  const part = (content: string, key: number) => {
    const i = n++;
    return (
      <span
        key={key}
        data-part
        className="inline-block translate-y-[110%] transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-data-[in=true]/sr:translate-y-0 motion-reduce:translate-y-0 motion-reduce:transition-none"
        style={{ transitionDelay: `${delay * 1000 + i * (by === "char" ? 20 : 45)}ms` }}
      >
        {content}
      </span>
    );
  };
  return (
    <Comp ref={ref} id={id} data-in={inView} className={cn("group/sr", className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-top">
          {by === "char" ? w.split("").map((c, j) => part(c, j)) : part(w, 0)}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Comp>
  );
}

/** Words light up one by one as you scroll (scrubbed). */
export function ScrubText({ text, className, highlight = [] }: { text: string; className?: string; highlight?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = el.querySelectorAll("[data-w]");
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        }
      );
    });
    return () => mm.revert();
  }, []);
  const clean = (w: string) => w.replace(/[.,'’]/g, "").toLowerCase();
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-w className={cn("inline-block", highlight.includes(clean(w)) && "text-deep italic")}>
          {w}
          {" "}
        </span>
      ))}
    </p>
  );
}

/** Vertical parallax drift while scrolling. */
export function Parallax({ children, speed = 0.15, className }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { yPercent: speed * 100 },
        { yPercent: -speed * 100, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
      );
    });
    return () => mm.revert();
  }, [speed]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Count up a number when it enters view. */
export function CountUp({ to, prefix = "", className, locale = "en-IN" }: { to: number; prefix?: string; className?: string; locale?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (n: number) => `${prefix}${Math.round(n).toLocaleString(locale)}`;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const obj = { v: 0 };
      el.textContent = fmt(0);
      gsap.to(obj, {
        v: to,
        duration: 2,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        onUpdate: () => (el.textContent = fmt(obj.v)),
      });
      return () => (el.textContent = fmt(to));
    });
    return () => mm.revert();
  }, [to, prefix, locale]);
  return (
    <span ref={ref} className={className}>
      {`${prefix}${to.toLocaleString(locale)}`}
    </span>
  );
}

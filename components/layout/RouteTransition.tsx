"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { nav, legalNav, site } from "@/lib/site";
import { projects } from "@/lib/projects";

type Phase = "idle" | "cover" | "reveal";
const COLS = 5;
const CURTAIN = [0.76, 0, 0.24, 1] as const;
const COVER_MS = 560;

function labelFor(path: string) {
  const p = path.split(/[?#]/)[0];
  const n = [...nav, ...legalNav].find((x) => x.href === p);
  if (n) return n.label;
  const proj = projects.find((x) => p === `/showcase/${x.slug}`);
  if (proj) return proj.title;
  return site.shortName;
}

/**
 * Page-to-page transition: internal link clicks are intercepted, five indigo
 * columns rise in a staircase (with the destination name), the route changes,
 * then the columns lift away to reveal the new page.
 */
export function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const pending = useRef<string | null>(null);
  const first = useRef(true);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onClick = (e: MouseEvent) => {
      if (reduce.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page (hash / query) → let it be
      e.preventDefault();
      e.stopPropagation();
      pending.current = url.pathname + url.search + url.hash;
      setLabel(labelFor(url.pathname));
      setPhase("cover");
      window.setTimeout(() => {
        if (pending.current) router.push(pending.current);
      }, COVER_MS);
      // Safety: never leave the curtain down
      window.setTimeout(() => setPhase((p) => (p === "cover" ? "reveal" : p)), 4000);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    pending.current = null;
    if (reduce.current) return;
    setLabel((l) => l || labelFor(pathname));
    // Covered already (link click) → reveal after the new page paints.
    const t = window.setTimeout(() => setPhase("reveal"), 120);
    return () => clearTimeout(t);
  }, [pathname]);

  const y = phase === "cover" ? "0%" : phase === "reveal" ? "-100%" : "100%";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[140] flex" style={{ pointerEvents: phase === "cover" ? "auto" : "none" }}>
      {Array.from({ length: COLS }).map((_, i) => (
        <motion.div
          key={i}
          className="h-full flex-1"
          style={{ marginLeft: i ? -1 : 0, background: i % 2 ? "#3D52A0" : "#3A4E99" }}
          initial={false}
          animate={{ y }}
          transition={phase === "idle" ? { duration: 0 } : { duration: phase === "cover" ? 0.5 : 0.75, ease: CURTAIN, delay: i * 0.05 }}
          onAnimationComplete={() => {
            if (i === COLS - 1 && phase === "reveal") {
              setPhase("idle");
              setLabel("");
            }
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-lav"
        initial={false}
        animate={{ opacity: phase === "cover" ? 1 : 0, y: phase === "cover" ? 0 : phase === "reveal" ? -30 : 20 }}
        transition={{ duration: 0.4, delay: phase === "cover" ? 0.25 : 0 }}
      >
        <svg viewBox="0 0 48 48" className="size-10" aria-hidden>
          <rect x="2" y="4" width="44" height="12" rx="2" fill="#EDE8F5" />
          <rect x="2" y="18" width="30" height="12" rx="2" fill="#ADBDDA" />
          <rect x="2" y="32" width="16" height="12" rx="2" fill="#8697C4" />
          <circle cx="39" cy="38" r="6" fill="#EDE8F5" />
        </svg>
        <p className="mt-5 font-display text-[clamp(2rem,4vw,4rem)] font-light tracking-[-0.04em]">{label}</p>
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIntro } from "./Providers";
import { site } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;
const CURTAIN = [0.76, 0, 0.24, 1] as const;
const MIN_MS = 1300; // short and intentional — never artificially long
const COLS = 5;
const PHASES = ["Discover", "Design", "Develop", "Deliver"];

/**
 * First-visit intro: the stepped mark assembles, the wordmark rises, a counter
 * tracks real page load, then five columns lift away in a staircase to reveal
 * the site. Skipped on repeat visits (per session) and for reduced motion.
 */
export function Loader() {
  const { setReady } = useIntro();
  const [visible, setVisible] = useState(true);
  const [skip, setSkip] = useState(false);
  const [pct, setPct] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const intro = document.documentElement.dataset.intro;
    if (intro === "seen" || intro === "done") {
      setSkip(true);
      return;
    }
    const start = performance.now();
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);
    let value = 0;
    let raf = 0;
    let last = -1;
    const tick = (now: number) => {
      const timeCap = Math.min(1, (now - start) / MIN_MS);
      const target = loaded ? 100 * timeCap : Math.min(90, 100 * timeCap);
      value += (target - value) * 0.14;
      if (loaded && timeCap === 1 && value > 99.5) value = 100;
      const rounded = Math.round(value);
      if (rounded !== last) {
        last = rounded;
        setPct(rounded);
      }
      if (value >= 100) {
        if (!done.current) {
          done.current = true;
          setTimeout(() => {
            setVisible(false);
            setReady();
          }, 220);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const safety = setTimeout(() => (loaded = true), 3000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      window.removeEventListener("load", onLoad);
    };
  }, [setReady]);

  if (skip) return null;

  const phase = PHASES[Math.min(PHASES.length - 1, Math.floor(pct / 25.01))];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div data-loader className="fixed inset-0 z-[150]" role="status" aria-label={`Loading ${site.name}`}>
          {/* Staircase curtain */}
          <div className="absolute inset-0 flex" aria-hidden>
            {Array.from({ length: COLS }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1 bg-lav"
                style={{ marginLeft: i ? -1 : 0 }}
                initial={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.85, ease: CURTAIN, delay: 0.12 + i * 0.06 }}
              />
            ))}
          </div>

          <motion.div
            className="absolute inset-0 flex flex-col"
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* Top bar */}
            <div className="container-x flex items-center justify-between pt-6 sm:pt-8">
              <span className="eyebrow text-ink/50">{site.name}</span>
              <span className="eyebrow hidden text-ink/50 sm:block">Est. {site.founded}</span>
            </div>

            {/* Centre mark */}
            <div className="flex flex-1 flex-col items-center justify-center">
              <svg viewBox="0 0 48 48" className="size-16 sm:size-20" aria-hidden>
                {[
                  { y: 4, w: 44, fill: "#3D52A0" },
                  { y: 18, w: 30, fill: "#7091E6" },
                  { y: 32, w: 16, fill: "#8697C4" },
                ].map((r, i) => (
                  <motion.rect
                    key={i}
                    x={2}
                    y={r.y}
                    height={12}
                    rx={2}
                    fill={r.fill}
                    initial={{ width: 0 }}
                    animate={{ width: r.w }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.05 + i * 0.1 }}
                  />
                ))}
                <motion.circle
                  cx={39}
                  cy={38}
                  r={6}
                  fill="#3D52A0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.4, 0.64, 1], delay: 0.45 }}
                  style={{ transformOrigin: "39px 38px" }}
                />
              </svg>

              <div className="mt-6 overflow-hidden">
                <motion.p
                  className="flex items-baseline gap-2 font-display text-3xl font-medium tracking-[-0.05em] text-ink sm:text-4xl"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
                >
                  {site.wordmark}
                  <span className="font-mono text-[0.6rem] font-normal tracking-[0.3em] text-ink/50">{site.wordmarkSuffix}</span>
                </motion.p>
              </div>

              <div className="relative mt-6 h-px w-40 overflow-hidden rounded-full bg-ink/10 sm:w-52">
                <div className="absolute inset-y-0 left-0 origin-left bg-deep" style={{ width: "100%", transform: `scaleX(${pct / 100})` }} />
              </div>

              <motion.p
                className="mt-4 text-sm text-ink/55"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Building digital experiences.
              </motion.p>
            </div>

            {/* Bottom row */}
            <div className="container-x flex items-end justify-between pb-6 sm:pb-8">
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phase}
                    className="eyebrow block text-deep"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {phase}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="font-display text-[clamp(3rem,9vw,7rem)] font-extralight leading-[0.8] tracking-[-0.06em] text-ink tabular-nums">
                {pct}
                <span className="text-[0.35em] text-ink/40">%</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

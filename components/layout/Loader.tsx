"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useIntro } from "./Providers";
import { site } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;
const CURTAIN = [0.83, 0, 0.17, 1] as const;
const MIN_MS = 1700; // long enough to read the tagline, never artificially long
const HOLD_MS = 280; // beat at 100% before the curtain lifts
const COLS = 5;
const PHASES = ["Discover", "Design", "Develop", "Deliver"];
const TAGLINE = site.tagline.split(" ");

/** Smooth ease-in-out so the counter accelerates then settles instead of ticking linearly. */
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * First-visit intro: the stepped mark assembles, the wordmark and tagline rise,
 * a counter tracks real page load, then a two-layer staircase curtain lifts to
 * reveal the site. Progress runs on motion values (no React re-render per frame).
 * Skipped on repeat visits (per session) and for reduced motion.
 */
export function Loader() {
  const { setReady } = useIntro();
  const [visible, setVisible] = useState(true);
  const [skip, setSkip] = useState(false);
  const [phase, setPhase] = useState(0);
  const progress = useMotionValue(0); // 0..100
  const pct = useTransform(progress, (v) => Math.round(v));
  const bar = useTransform(progress, (v) => v / 100);
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
    let prev = start;
    let raf = 0;
    let lastPhase = 0;
    let hold: ReturnType<typeof setTimeout> | undefined;

    const tick = (now: number) => {
      const dt = Math.min(64, now - prev);
      prev = now;
      const t = Math.min(1, (now - start) / MIN_MS);
      // Eased time curve; stall softly at 88% until the page has actually loaded.
      const target = loaded ? 100 * easeInOut(t) : Math.min(88, 100 * easeInOut(t));
      // Frame-rate independent smoothing (same feel at 60Hz and 144Hz).
      value += (target - value) * (1 - Math.exp(-dt / 70));
      if (loaded && t === 1 && value > 99.6) value = 100;
      progress.set(value);

      const p = Math.min(PHASES.length - 1, Math.floor(value / 25.01));
      if (p !== lastPhase) {
        lastPhase = p;
        setPhase(p);
      }

      if (value >= 100) {
        if (!done.current) {
          done.current = true;
          hold = setTimeout(() => {
            setVisible(false);
            setReady();
          }, HOLD_MS);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const safety = setTimeout(() => (loaded = true), 3500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      if (hold) clearTimeout(hold);
      window.removeEventListener("load", onLoad);
    };
  }, [setReady, progress]);

  if (skip) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div data-loader className="fixed inset-0 z-[150]" role="status" aria-label={`Loading ${site.name}`}>
          {/* Two-layer staircase curtain: lavender lifts first, a deep accent trails it */}
          {(["deep", "lav"] as const).map((layer) => (
            <div key={layer} className="absolute inset-0 flex" aria-hidden>
              {Array.from({ length: COLS }).map((_, i) => (
                <div key={i} className="relative h-full flex-1">
                  <motion.div
                    className={`absolute inset-y-0 -right-px left-0 will-change-transform ${layer === "deep" ? "bg-deep" : "bg-lav"}`}
                    // The deep layer stays invisible until exit so column seams never show while loading.
                    initial={{ y: 0, opacity: layer === "deep" ? 0 : 1 }}
                    exit={{ y: "-100%", opacity: 1 }}
                    transition={
                      layer === "deep"
                        ? { duration: 1, ease: CURTAIN, delay: 0.2 + i * 0.055, opacity: { duration: 0 } }
                        : { duration: 0.9, ease: CURTAIN, delay: 0.08 + i * 0.055 }
                    }
                  />
                </div>
              ))}
            </div>
          ))}

          <motion.div
            className="absolute inset-0 flex flex-col will-change-transform"
            exit={{ opacity: 0, y: -48 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            {/* Top bar */}
            <motion.div
              className="container-x flex items-center justify-between pt-6 sm:pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            >
              <span className="eyebrow text-ink/50">{site.name}</span>
              <span className="eyebrow hidden text-ink/50 sm:block">Est. {site.founded}</span>
            </motion.div>

            {/* Centre mark */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
              <svg viewBox="0 0 48 48" className="size-14 sm:size-16" aria-hidden>
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
                    transition={{ duration: 0.9, ease: EASE, delay: 0.05 + i * 0.1 }}
                  />
                ))}
                <motion.circle
                  cx={39}
                  cy={38}
                  r={6}
                  fill="#3D52A0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.34, 1.4, 0.64, 1], delay: 0.45 }}
                  style={{ transformOrigin: "39px 38px" }}
                />
              </svg>

              <div className="mt-5 overflow-hidden">
                <motion.p
                  className="flex items-baseline gap-2 font-display text-base font-medium tracking-[-0.03em] text-ink/70"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
                >
                  {site.wordmark}
                  <span className="font-mono text-[0.55rem] font-normal tracking-[0.3em] text-ink/45">{site.wordmarkSuffix}</span>
                </motion.p>
              </div>

              {/* Tagline — the hero of the intro */}
              <p className="mt-5 font-display text-[clamp(2.4rem,7vw,5.5rem)] font-light leading-[0.95] tracking-[-0.05em] text-ink">
                {TAGLINE.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <motion.span
                      className={`inline-block ${i >= 2 ? "font-extralight italic text-deep" : ""}`}
                      initial={{ y: "105%", rotate: 4 }}
                      animate={{ y: 0, rotate: 0 }}
                      transition={{ duration: 1, ease: EASE, delay: 0.45 + i * 0.09 }}
                      style={{ transformOrigin: "0% 100%" }}
                    >
                      {word}
                      {i < TAGLINE.length - 1 ? " " : ""}
                    </motion.span>
                  </span>
                ))}
              </p>

              <motion.div
                className="relative mt-8 h-px w-40 overflow-hidden rounded-full bg-ink/10 sm:w-56"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div className="absolute inset-0 origin-left bg-deep" style={{ scaleX: bar }} />
              </motion.div>
            </div>

            {/* Bottom row */}
            <div className="container-x flex items-end justify-between pb-6 sm:pb-8">
              <div className="overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={phase}
                    className="eyebrow block text-deep"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    {PHASES[phase]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="font-display text-[clamp(3rem,9vw,7rem)] font-extralight leading-[0.8] tracking-[-0.06em] text-ink tabular-nums">
                <motion.span>{pct}</motion.span>
                <span className="text-[0.35em] text-ink/40">%</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

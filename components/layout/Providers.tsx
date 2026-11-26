"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { MotionConfig, AnimatePresence, motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Check, CircleAlert } from "lucide-react";

/* ─────────────── Intro (loader → page) ─────────────── */
type IntroCtx = { ready: boolean; setReady: () => void };
const IntroContext = createContext<IntroCtx>({ ready: true, setReady: () => {} });
export const useIntro = () => useContext(IntroContext);

/* ─────────────── Smooth scroll ─────────────── */
type ScrollCtx = {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void;
  stop: () => void;
  start: () => void;
};
const ScrollContext = createContext<ScrollCtx>({ lenis: null, scrollTo: () => {}, stop: () => {}, start: () => {} });
export const useSmoothScroll = () => useContext(ScrollContext);

/* ─────────────── Toasts ─────────────── */
type Toast = { id: number; message: string; tone: "ok" | "error" };
const ToastContext = createContext<(message: string, tone?: Toast["tone"]) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReadyState] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lockCount = useRef(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // If the loader is skipped (repeat visit / reduced motion), we're ready right away.
  useEffect(() => {
    if (document.documentElement.dataset.intro === "seen") {
      document.documentElement.dataset.intro = "done";
      setReadyState(true);
    }
  }, []);

  const setReady = useCallback(() => {
    try {
      sessionStorage.setItem("forma-intro", "1");
    } catch {}
    document.documentElement.dataset.intro = "done";
    setReadyState(true);
  }, []);

  // Lenis + GSAP ScrollTrigger in a single RAF loop.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch keeps native momentum (feels best on phones/tablets), Lenis still drives ScrollTrigger sync.
      syncTouch: false,
      touchMultiplier: 1.2,
      wheelMultiplier: 1,
      anchors: { offset: -96 },
    });
    instance.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Pause scrolling until the intro has finished.
  useEffect(() => {
    if (!lenis) return;
    if (ready) lenis.start();
    else lenis.stop();
  }, [lenis, ready]);

  // Route change → reset scroll + refresh triggers once layout settles.
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        setTimeout(() => lenis?.scrollTo(el as HTMLElement, { offset: -90 }), 120);
      }
    } else {
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const scrollTo = useCallback<ScrollCtx["scrollTo"]>(
    (target, opts) => {
      const offset = opts?.offset ?? -88;
      if (lenis) {
        lenis.scrollTo(target as never, { offset, immediate: opts?.immediate, duration: 1.4, force: true });
        return;
      }
      if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
      else {
        const el = typeof target === "string" ? document.querySelector(target) : target;
        if (el) window.scrollTo({ top: (el as HTMLElement).getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
      }
    },
    [lenis]
  );

  const stop = useCallback(() => {
    lockCount.current += 1;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
  }, [lenis]);
  const start = useCallback(() => {
    lockCount.current = Math.max(0, lockCount.current - 1);
    if (lockCount.current === 0) {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [lenis]);

  const toast = useCallback((message: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={{ ready, setReady }}>
        <ScrollContext.Provider value={{ lenis, scrollTo, stop, start }}>
          <ToastContext.Provider value={toast}>
            {children}
            <div aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-[300] flex -translate-x-1/2 flex-col items-center gap-2">
              <AnimatePresence>
                {toasts.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-2 rounded-full bg-night px-4 py-2.5 text-sm text-lav shadow-[0_12px_40px_-12px_rgba(16,20,47,.6)]"
                  >
                    {t.tone === "ok" ? <Check className="size-4 text-peri" aria-hidden /> : <CircleAlert className="size-4 text-mist" aria-hidden />}
                    {t.message}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ToastContext.Provider>
        </ScrollContext.Provider>
      </IntroContext.Provider>
    </MotionConfig>
  );
}

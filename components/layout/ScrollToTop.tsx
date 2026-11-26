"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "./Providers";

export function ScrollToTop() {
  const { lenis, scrollTo } = useSmoothScroll();
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setShow(y > window.innerHeight * 1.2);
      setProgress(max > 0 ? y / max : 0);
    };
    update();
    if (lenis) {
      lenis.on("scroll", update);
      return () => lenis.off("scroll", update);
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [lenis]);

  const c = 2 * Math.PI * 20;
  return (
    <>
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[91] h-[2px]">
      <div className="h-full origin-left bg-gradient-to-r from-peri to-deep" style={{ transform: `scaleX(${progress})` }} />
    </div>
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          onClick={() => scrollTo(0, { offset: 0 })}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="group fixed bottom-[5.5rem] right-[1.25rem] z-[80] grid size-12 place-items-center rounded-full bg-paper/90 text-deep shadow-[0_10px_30px_-12px_rgba(22,27,63,.5)] backdrop-blur sm:bottom-[6.5rem] sm:right-[1.75rem]"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden>
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="1.5" />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - progress)}
              strokeLinecap="round"
            />
          </svg>
          <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
    </>
  );
}

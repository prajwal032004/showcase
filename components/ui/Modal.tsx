"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useSmoothScroll } from "@/components/layout/Providers";
import { cn } from "@/lib/utils";

/** Accessible modal: focus trap, Escape to close, scroll lock, restores focus. */
export function Modal({
  open,
  onClose,
  label,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-autofocus],button")?.focus(), 60);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      start();
      prev?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, stop, start]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[160] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.div
            className="absolute inset-0 bg-night/60 backdrop-blur-[3px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            data-lenis-prevent
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative max-h-[92svh] w-full overflow-y-auto overscroll-contain rounded-t-2xl bg-lav shadow-[0_40px_120px_-30px_rgba(16,20,47,.7)] sm:max-w-6xl sm:rounded-2xl",
              className
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="sticky right-4 top-4 z-10 float-right mr-4 mt-4 grid size-11 place-items-center rounded-full bg-ink text-lav transition-transform hover:rotate-90"
            >
              <X className="size-5" aria-hidden />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

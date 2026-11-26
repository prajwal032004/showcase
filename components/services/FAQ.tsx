"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollTrigger } from "@/lib/gsap";

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className="border-t hairline">
      {items.map((it, i) => {
        const isOpen = open === i;
        const btnId = `${base}-b-${i}`;
        const panelId = `${base}-p-${i}`;
        return (
          <div key={it.q} className="border-b hairline">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
              >
                <span className={cn("font-display text-lg font-normal tracking-[-0.02em] transition-colors sm:text-2xl", isOpen ? "text-deep" : "text-ink group-hover:text-deep")}>
                  {it.q}
                </span>
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-500",
                    isOpen ? "rotate-45 border-deep bg-deep text-lav" : "border-ink/15 group-hover:border-deep"
                  )}
                >
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false} onExitComplete={() => ScrollTrigger.refresh()}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                  onAnimationComplete={() => ScrollTrigger.refresh()}
                >
                  <p className="max-w-3xl pb-7 pr-14 leading-relaxed text-ink/65">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

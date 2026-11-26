"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useIntro } from "@/components/layout/Providers";

// The chat panel (engine + UI) loads only when first opened — zero cost on page load.
const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

export const CHAT_OPEN_EVENT = "forma:chat-open";

export function ChatLauncher() {
  const { ready } = useIntro();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const on = (e: Event) => {
      setMounted(true);
      setOpen(true);
      const q = (e as CustomEvent<string | undefined>).detail;
      if (q) setTimeout(() => window.dispatchEvent(new CustomEvent("forma:chat-ask", { detail: q })), 400);
    };
    window.addEventListener(CHAT_OPEN_EVENT, on);
    return () => window.removeEventListener(CHAT_OPEN_EVENT, on);
  }, []);

  // A single, gentle nudge after a while — once per session.
  useEffect(() => {
    if (!ready) return;
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("forma-chat-hint");
    } catch {}
    if (seen) return;
    const t = setTimeout(() => {
      setHint(true);
      try {
        sessionStorage.setItem("forma-chat-hint", "1");
      } catch {}
    }, 9000);
    const t2 = setTimeout(() => setHint(false), 17000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [ready]);

  const toggle = () => {
    setMounted(true);
    setHint(false);
    setOpen((o) => !o);
  };

  return (
    <>
      {mounted && <ChatPanel open={open} onClose={() => setOpen(false)} />}
      <div className="fixed bottom-4 right-4 z-[95] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6 [body:has(#mobile-menu)_&]:hidden">
        <AnimatePresence>
          {hint && !open && (
            <motion.button
              type="button"
              onClick={toggle}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[15rem] rounded-2xl rounded-br-md bg-paper px-4 py-3 text-left text-sm text-ink/80 shadow-[0_20px_50px_-20px_rgba(22,27,63,.5)] ring-1 ring-ink/[0.06]"
            >
              <span className="font-medium text-ink">Planning a website?</span> Describe it and get an instant estimate.
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button
          type="button"
          onClick={toggle}
          aria-label={open ? "Close assistant" : "Open Forma assistant"}
          aria-expanded={open}
          initial={{ scale: 0, opacity: 0 }}
          animate={ready ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.4, 0.64, 1], delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className="group relative grid size-14 place-items-center rounded-full bg-deep text-lav shadow-[0_16px_40px_-12px_rgba(61,82,160,.9)]"
        >
          <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#7091E6,#3D52A0,#ADBDDA,#7091E6)] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-70" aria-hidden />
          <span className="absolute inset-0 rounded-full bg-deep" aria-hidden />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "x" : "s"}
              className="relative"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {open ? <X className="size-5" aria-hidden /> : <Sparkles className="size-5" aria-hidden />}
            </motion.span>
          </AnimatePresence>
          {!open && <span className="absolute right-0.5 top-0.5 size-3 rounded-full border-2 border-lav bg-peri" aria-hidden />}
        </motion.button>
      </div>
    </>
  );
}

export function openChat(question?: string) {
  window.dispatchEvent(new CustomEvent(CHAT_OPEN_EVENT, { detail: question }));
}

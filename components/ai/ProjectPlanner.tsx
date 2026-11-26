"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, Wand2 } from "lucide-react";
import { analyzeProject, inr, type Estimate } from "@/lib/ai/estimator";
import { applyEstimateToDraft } from "@/lib/ai/prefill";
import { useSmoothScroll, useToast } from "@/components/layout/Providers";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const EXAMPLES = [
  "A website for my bakery with an online menu, WhatsApp orders and a photo gallery",
  "Online clothing store with payments, 30 products and Hindi + English",
  "Landing page for our SaaS launch with a waitlist form and animations",
  "Redesign our dental clinic website with appointment booking",
];
const STAGES = ["Reading your description", "Detecting features & industry", "Mapping pages & scope", "Estimating effort"];

/** Describe a project in plain words → instant on-device scope, price range and timeline. */
export function ProjectPlanner() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState(-1);
  const [result, setResult] = useState<Estimate | null>(null);
  const [applied, setApplied] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const toast = useToast();
  const { scrollTo } = useSmoothScroll();
  const timers = useRef<number[]>([]);

  // Typewriter placeholder cycling through examples
  useEffect(() => {
    if (text) return;
    let ex = 0,
      i = 0,
      dir = 1,
      t = 0;
    const tick = () => {
      const s = EXAMPLES[ex];
      i += dir;
      setPlaceholder(s.slice(0, i));
      if (dir === 1 && i >= s.length) {
        dir = -1;
        t = window.setTimeout(tick, 2200);
        return;
      }
      if (dir === -1 && i <= 0) {
        dir = 1;
        ex = (ex + 1) % EXAMPLES.length;
      }
      t = window.setTimeout(tick, dir === 1 ? 32 : 12);
    };
    t = window.setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, [text]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    const desc = text.trim();
    if (desc.length < 12) {
      toast("Describe your project in a few more words", "error");
      return;
    }
    timers.current.forEach(clearTimeout);
    setResult(null);
    setApplied(false);
    setStage(0);
    STAGES.forEach((_, i) => timers.current.push(window.setTimeout(() => setStage(i), i * 380)));
    timers.current.push(
      window.setTimeout(() => {
        setResult(analyzeProject(desc));
        setStage(-1);
      }, STAGES.length * 380 + 150)
    );
  };

  const apply = () => {
    if (!result) return;
    applyEstimateToDraft(result, text);
    setApplied(true);
    toast("Form pre-filled — review and adjust anything");
    setTimeout(() => {
      const el = document.getElementById("f-name");
      if (el) scrollTo(el, { offset: -180 });
    }, 150);
  };

  return (
    <section aria-labelledby="planner-title" className="relative mb-14 overflow-hidden rounded-[2rem] bg-deep p-6 text-lav sm:p-9">
      <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-peri/40 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 left-10 size-56 rounded-full bg-mist/20 blur-3xl" aria-hidden />
      <div className="relative">
        <p className="eyebrow flex items-center gap-2 text-lav/60">
          <Sparkles className="size-3.5" aria-hidden /> AI project planner
        </p>
        <h2 id="planner-title" className="mt-3 font-display text-2xl font-light tracking-[-0.03em] sm:text-3xl">
          Describe your idea. Get an instant scope &amp; estimate.
        </h2>
        <p className="mt-2 max-w-lg text-sm text-lav/65">Runs privately in your browser. Apply the result to pre-fill the form below.</p>

        <div className="mt-6 rounded-2xl bg-lav/10 p-1.5 ring-1 ring-lav/15 focus-within:ring-2 focus-within:ring-peri">
          <label htmlFor="planner-input" className="sr-only">
            Describe your project
          </label>
          <textarea
            id="planner-input"
            rows={3}
            value={text}
            data-lenis-prevent
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) run();
            }}
            placeholder={placeholder || "Describe your project…"}
            className="block w-full resize-none bg-transparent px-3 py-2.5 text-[0.95rem] text-lav outline-none placeholder:text-lav/40"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1">
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.slice(0, 2).map((ex) => (
                <button key={ex} type="button" onClick={() => setText(ex)} className="rounded-full bg-lav/10 px-3 py-1 text-xs text-lav/75 hover:bg-lav/20">
                  {ex.split(" ").slice(0, 4).join(" ")}…
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={run}
              disabled={stage >= 0}
              className="inline-flex items-center gap-2 rounded-full bg-lav px-5 py-2.5 text-sm font-medium text-deep transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
            >
              <Wand2 className="size-4" aria-hidden /> Analyse
            </button>
          </div>
        </div>

        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {stage >= 0 && (
              <motion.ul key="stages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 space-y-2 text-sm">
                {STAGES.map((s, i) => (
                  <li key={s} className={cn("flex items-center gap-2.5 transition-opacity duration-300", i <= stage ? "opacity-100" : "opacity-30")}>
                    {i < stage ? (
                      <Check className="size-4 text-peri" aria-hidden />
                    ) : (
                      <span className={cn("size-4 rounded-full border-2 border-lav/30", i === stage && "animate-spin border-t-lav")} />
                    )}
                    {s}
                  </li>
                ))}
              </motion.ul>
            )}
            {result && (
              <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} className="mt-6">
                <p className="text-sm text-lav/70">{result.summary}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Stat label="Indicative range" value={`${inr(result.low)} – ${inr(result.high)}`} />
                  <Stat label="Timeline" value={`${result.weeks[0]}–${result.weeks[1]} weeks`} />
                  <Stat label="Complexity" value={`${result.complexityLabel} · ${result.complexity}/100`} bar={result.complexity} />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="eyebrow text-[0.62rem] text-lav/50">Suggested pages · {result.pageCount}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {result.pages.map((p, i) => (
                        <motion.li key={p} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.04 }} className="rounded-full bg-lav/10 px-2.5 py-1 text-xs">
                          {p}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow text-[0.62rem] text-lav/50">Detected features</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {(result.features.length ? result.features.map((f) => f.label) : ["Core website essentials"]).map((f, i) => (
                        <motion.li key={f} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.05 }} className="rounded-full bg-peri/30 px-2.5 py-1 text-xs">
                          {f}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
                {result.notes.length > 0 && <p className="mt-4 text-xs leading-relaxed text-lav/55">{result.notes.join(" ")}</p>}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={apply} className="inline-flex items-center gap-2 rounded-full bg-lav px-5 py-2.5 text-sm font-medium text-deep hover:bg-paper">
                    {applied ? <Check className="size-4" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
                    {applied ? "Applied to the form" : "Apply to the form"}
                  </button>
                  <p className="text-xs text-lav/50">Automated, indicative estimate — the final quote follows a short conversation.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, bar }: { label: string; value: string; bar?: number }) {
  return (
    <div className="rounded-2xl bg-lav/10 p-4 ring-1 ring-lav/10">
      <p className="text-[0.7rem] text-lav/55">{label}</p>
      <p className="mt-1 font-display text-lg font-normal tracking-[-0.02em]">{value}</p>
      {bar !== undefined && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-lav/15">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-mist to-peri" initial={{ width: 0 }} animate={{ width: `${bar}%` }} transition={{ duration: 1, ease: EASE }} />
        </div>
      )}
    </div>
  );
}

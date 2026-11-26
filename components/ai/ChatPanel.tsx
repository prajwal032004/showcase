"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp, Copy, Eye, Maximize2, Minimize2, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { respond, welcome, type BotReply, type ChatAction, type Context } from "@/lib/ai/engine";
import { inr, type Estimate } from "@/lib/ai/estimator";
import { applyEstimateToDraft } from "@/lib/ai/prefill";
import { openProjectPreview } from "@/components/showcase/previewBus";
import { useToast } from "@/components/layout/Providers";
import { copyText, cn } from "@/lib/utils";
import { site } from "@/lib/site";

type Msg = { id: number; role: "user" | "bot"; text: string; reply?: BotReply; streamed?: boolean };
const STORE = "forma-chat";
const EASE = [0.16, 1, 0.3, 1] as const;

/** Tiny markdown: **bold**, *italic*, line breaks, bullet lines. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((p, j) =>
          p.startsWith("**") ? (
            <strong key={j} className="font-semibold text-ink">
              {p.slice(2, -2)}
            </strong>
          ) : p.startsWith("*") && p.length > 2 ? (
            <em key={j}>{p.slice(1, -1)}</em>
          ) : (
            <Fragment key={j}>{p}</Fragment>
          )
        );
        const bullet = line.startsWith("• ");
        return (
          <span key={i} className={cn("block", bullet && "pl-3", !line && "h-2")}>
            {parts}
          </span>
        );
      })}
    </>
  );
}

function EstimateCard({ e }: { e: Estimate }) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl bg-deep p-4 text-lav">
      <p className="eyebrow text-[0.6rem] text-lav/60">Instant estimate</p>
      <p className="mt-1 font-display text-2xl font-light tracking-[-0.03em]">
        {inr(e.low)} – {inr(e.high)}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-[0.72rem]">
        <div>
          <p className="text-lav/55">Timeline</p>
          <p className="font-medium">
            {e.weeks[0]}–{e.weeks[1]} wks
          </p>
        </div>
        <div>
          <p className="text-lav/55">Pages</p>
          <p className="font-medium">{e.pageCount}</p>
        </div>
        <div>
          <p className="text-lav/55">Type</p>
          <p className="truncate font-medium">{e.type}</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-[0.68rem] text-lav/60">
          <span>Complexity · {e.complexityLabel}</span>
          <span>{Math.round(e.confidence * 100)}% confidence</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-lav/15">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-mist to-peri" initial={{ width: 0 }} animate={{ width: `${e.complexity}%` }} transition={{ duration: 1, ease: EASE, delay: 0.2 }} />
        </div>
      </div>
    </div>
  );
}

export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [ctx, setCtx] = useState<Context>({ turns: 0 });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [streamId, setStreamId] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const idRef = useRef(1);

  // Restore session conversation
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE);
      if (raw) {
        const saved = JSON.parse(raw) as { msgs: Msg[]; ctx: Context };
        setMsgs(saved.msgs.map((m) => ({ ...m, streamed: true })));
        setCtx(saved.ctx);
        idRef.current = Math.max(1, ...saved.msgs.map((m) => m.id)) + 1;
        return;
      }
    } catch {}
    setMsgs([{ id: idRef.current++, role: "bot", text: welcome.text, reply: welcome, streamed: true }]);
  }, []);

  useEffect(() => {
    if (!msgs.length) return;
    try {
      sessionStorage.setItem(STORE, JSON.stringify({ msgs: msgs.slice(-40), ctx }));
    } catch {}
  }, [msgs, ctx]);

  // Stream the latest bot message character-by-character (feels live, stays fast)
  useEffect(() => {
    if (streamId == null) return;
    const m = msgs.find((x) => x.id === streamId);
    if (!m) return;
    let n = 0;
    const chunk = Math.max(3, Math.round(m.text.length / 60)); // ~1s for any length
    const finish = () => {
      clearInterval(iv);
      setShown(m.text.length);
      setMsgs((all) => all.map((x) => (x.id === streamId ? { ...x, streamed: true } : x)));
      setStreamId(null);
    };
    const iv = window.setInterval(() => {
      if (document.hidden) return finish();
      n = Math.min(m.text.length, n + chunk);
      setShown(n);
      if (n >= m.text.length) finish();
    }, 16);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamId]);

  // Auto-scroll
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs.length, shown, typing]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 300);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const ask = useCallback(
    (q: string) => {
      const text = q.trim();
      if (!text || typing) return;
      setInput("");
      setMsgs((m) => [...m, { id: idRef.current++, role: "user", text, streamed: true }]);
      setTyping(true);
      const { reply, ctx: next } = respond(text, ctx);
      const think = Math.min(1100, 380 + text.length * 6 + (reply.estimate ? 450 : 0));
      setTimeout(() => {
        const id = idRef.current++;
        setTyping(false);
        setShown(0);
        setMsgs((m) => [...m, { id, role: "bot", text: reply.text, reply, streamed: false }]);
        setStreamId(id);
        setCtx(next);
      }, think);
    },
    [ctx, typing]
  );

  useEffect(() => {
    const on = (e: Event) => ask((e as CustomEvent<string>).detail);
    window.addEventListener("forma:chat-ask", on);
    return () => window.removeEventListener("forma:chat-ask", on);
  }, [ask]);

  const runAction = async (a: ChatAction) => {
    switch (a.kind) {
      case "navigate":
        router.push(a.href);
        if (window.innerWidth < 640) onClose();
        break;
      case "preview":
        openProjectPreview(a.slug);
        break;
      case "copy":
        toast((await copyText(a.text)) ? "Copied to clipboard" : "Couldn't copy", "ok");
        break;
      case "prefill":
        applyEstimateToDraft(a.estimate, a.description);
        toast("Contact form pre-filled with your project");
        router.push("/contact");
        if (window.innerWidth < 640) onClose();
        break;
      case "gmail":
        router.push("/contact");
        break;
    }
  };

  const reset = () => {
    try {
      sessionStorage.removeItem(STORE);
    } catch {}
    setCtx({ turns: 0 });
    setStreamId(null);
    setMsgs([{ id: idRef.current++, role: "bot", text: welcome.text, reply: welcome, streamed: true }]);
  };

  const last = msgs[msgs.length - 1];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-label={`${site.shortName} assistant`}
          data-lenis-prevent
          data-native-context
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{ transformOrigin: "bottom right" }}
          className={cn(
            "fixed inset-x-2 bottom-20 top-20 z-[96] flex flex-col overflow-hidden rounded-[1.75rem] bg-lav shadow-[0_40px_100px_-30px_rgba(16,20,47,.65)] ring-1 ring-ink/[0.08] transition-[width,height] duration-500 ease-[var(--ease-out-expo)] sm:inset-auto sm:bottom-24 sm:right-6",
            expanded ? "sm:h-[calc(100svh-13rem)] sm:w-[min(820px,calc(100vw-3rem))]" : "sm:h-[min(640px,calc(100svh-13rem))] sm:w-[400px]"
          )}
        >
          {/* Header */}
          <div className="relative flex items-center gap-3 overflow-hidden bg-deep px-5 py-4 text-lav">
            <div className="pointer-events-none absolute -right-10 -top-16 size-40 rounded-full bg-peri/40 blur-2xl" aria-hidden />
            <span className="relative grid size-10 place-items-center rounded-full bg-lav/15">
              <Sparkles className="size-5" aria-hidden />
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-deep bg-[#5be0a0]" />
            </span>
            <div className="relative min-w-0 flex-1">
              <p className="font-display text-lg font-medium leading-tight tracking-[-0.02em]">{site.shortName} Assistant</p>
              <p className="text-xs text-lav/65">Instant answers · runs privately in your browser</p>
            </div>
            <button type="button" onClick={reset} aria-label="Start a new conversation" className="relative grid size-9 place-items-center rounded-full text-lav/70 hover:bg-lav/10 hover:text-lav">
              <RotateCcw className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              aria-label={expanded ? "Shrink assistant" : "Expand assistant"}
              aria-pressed={expanded}
              title={expanded ? "Shrink" : "Expand"}
              className="relative hidden size-9 place-items-center rounded-full text-lav/70 hover:bg-lav/10 hover:text-lav sm:grid"
            >
              {expanded ? <Minimize2 className="size-4" aria-hidden /> : <Maximize2 className="size-4" aria-hidden />}
            </button>
            <button type="button" onClick={onClose} aria-label="Close assistant" className="relative grid size-9 place-items-center rounded-full text-lav/70 hover:bg-lav/10 hover:text-lav">
              <X className="size-4" aria-hidden />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite">
            {msgs.map((m) => {
              const isStreaming = m.id === streamId;
              const text = isStreaming ? m.text.slice(0, shown) : m.text;
              const showExtras = m.role === "bot" && (m.streamed || false) && !isStreaming;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div className={cn(expanded ? "max-w-[75%]" : "max-w-[88%]", m.role === "user" && "text-right")}>
                    <div
                      className={cn(
                        "inline-block text-left text-[0.9rem] leading-relaxed",
                        m.role === "user"
                          ? "rounded-2xl rounded-br-md bg-deep px-4 py-2.5 text-lav"
                          : "rounded-2xl rounded-bl-md bg-paper px-4 py-3 text-ink/80 ring-1 ring-ink/[0.05]"
                      )}
                    >
                      {m.role === "bot" ? <Rich text={text} /> : m.text}
                      {isStreaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-sm bg-deep align-middle" />}
                      {showExtras && m.reply?.estimate && <EstimateCard e={m.reply.estimate} />}
                    </div>
                    {showExtras && m.reply?.actions && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.reply.actions.map((a) => (
                          <button
                            key={a.label}
                            type="button"
                            onClick={() => runAction(a)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-deep/10 px-3 py-1.5 text-xs font-medium text-deep transition-colors hover:bg-deep hover:text-lav"
                          >
                            {a.kind === "preview" ? <Eye className="size-3.5" aria-hidden /> : a.kind === "copy" ? <Copy className="size-3.5" aria-hidden /> : <ArrowRight className="size-3.5" aria-hidden />}
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
            <AnimatePresence>
              {typing && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-xs text-ink/50">
                  <span className="flex gap-1 rounded-2xl rounded-bl-md bg-paper px-4 py-3 ring-1 ring-ink/[0.05]">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-1.5 rounded-full bg-deep/60"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </span>
                  Thinking…
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggestions */}
          {last?.role === "bot" && last.reply?.chips && !typing && streamId == null && (
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2">
              {last.reply.chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => ask(c)}
                  className="shrink-0 rounded-full border border-ink/10 bg-paper px-3 py-1.5 text-xs text-ink/75 transition-colors hover:border-deep hover:text-deep"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="border-t border-ink/[0.07] bg-paper/70 p-3"
          >
            <div className="flex items-end gap-2 rounded-2xl bg-paper p-1.5 pl-4 ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-peri">
              <label htmlFor="chat-input" className="sr-only">
                Message
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={600}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
                placeholder="Ask anything or describe your project…"
                className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink/40"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="grid size-9 shrink-0 place-items-center rounded-xl bg-deep text-lav transition-all disabled:opacity-30 enabled:hover:bg-ink"
              >
                {input.trim() ? <Send className="size-4" aria-hidden /> : <ArrowUp className="size-4" aria-hidden />}
              </button>
            </div>
            <p className="mt-2 text-center text-[0.65rem] text-ink/40">Estimates are indicative. Final quotes follow a short conversation.</p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

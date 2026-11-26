"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Copy,
  Eye,
  House,
  Layers,
  Link as LinkIcon,
  Mail,
  Search,
  TextSelect,
  User,
  X,
  LayoutTemplate,
  ExternalLink,
  RotateCw,
  Share2,
  Sparkles,
  Hash,
  MessageCircle,
} from "lucide-react";
import { useSmoothScroll, useToast } from "./Providers";
import { copyText } from "@/lib/utils";
import { getProject } from "@/lib/projects";
import { site } from "@/lib/site";
import { openProjectPreview } from "@/components/showcase/previewBus";
import { openChat } from "@/components/ai/ChatLauncher";
import { usePathname } from "next/navigation";

type Item = { id: string; label: string; icon: React.ComponentType<{ className?: string }>; action: () => void; hint?: string };
type Group = { title?: string; items: Item[]; row?: boolean };

/**
 * Custom right-click menu.
 * - Native menu is preserved in form fields, editable content, links with
 *   [data-native-context], on touch devices, and with Shift + right-click.
 */
export function ContextMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const { scrollTo } = useSmoothScroll();
  const [state, setState] = useState<{ x: number; y: number; groups: Group[] } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setState(null);
    restoreFocus.current?.focus?.({ preventScroll: true });
  }, []);

  const build = useCallback(
    (target: HTMLElement): Group[] => {
      const groups: Group[] = [];
      const selection = window.getSelection()?.toString().trim() ?? "";
      const projectEl = target.closest<HTMLElement>("[data-project-slug]");
      const imageEl = target.closest<HTMLElement>("img,[data-ctx-image]");

      if (selection) {
        groups.push({
          title: "Selection",
          items: [
            {
              id: "copy",
              label: "Copy",
              icon: Copy,
              hint: "Ctrl C",
              action: async () => toast((await copyText(selection)) ? "Copied to clipboard" : "Couldn't copy", "ok"),
            },
            {
              id: "select-all",
              label: "Select all",
              icon: TextSelect,
              action: () => {
                const scope = target.closest("main") ?? document.body;
                const range = document.createRange();
                range.selectNodeContents(scope);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(range);
              },
            },
            {
              id: "ask-sel",
              label: "Ask the assistant about this",
              icon: Sparkles,
              action: () => openChat(selection.slice(0, 300)),
            },
            {
              id: "search",
              label: `Search “${selection.length > 18 ? selection.slice(0, 18) + "…" : selection}”`,
              icon: Search,
              action: () => window.open(`https://www.google.com/search?q=${encodeURIComponent(selection)}`, "_blank", "noopener,noreferrer"),
            },
          ],
        });
      }

      const linkEl = target.closest<HTMLAnchorElement>("a[href]");
      if (linkEl && !projectEl) {
        const href = linkEl.href;
        groups.push({
          title: "Link",
          items: [
            { id: "open-tab", label: "Open in new tab", icon: ExternalLink, action: () => window.open(href, "_blank", "noopener,noreferrer") },
            { id: "copy-href", label: "Copy link address", icon: LinkIcon, action: async () => toast((await copyText(href)) ? "Link copied" : "Couldn't copy link") },
          ],
        });
      }

      if (projectEl) {
        const slug = projectEl.dataset.projectSlug!;
        const p = getProject(slug);
        if (p) {
          const items: Item[] = [
            { id: "view", label: "View project", icon: LayoutTemplate, action: () => router.push(`/showcase/${slug}`) },
            { id: "preview", label: "Quick preview", icon: Eye, action: () => openProjectPreview(slug) },
            {
              id: "copy-link",
              label: "Copy project link",
              icon: LinkIcon,
              action: async () =>
                toast((await copyText(`${window.location.origin}/showcase/${slug}`)) ? "Project link copied" : "Couldn't copy link"),
            },
          ];
          if (p.liveUrl) items.push({ id: "live", label: "Open live site", icon: ExternalLink, action: () => window.open(p.liveUrl, "_blank", "noopener,noreferrer") });
          groups.push({ title: p.title, items });
        }
      } else if (imageEl) {
        groups.push({
          title: "Image",
          items: [{ id: "showcase", label: "Browse the showcase", icon: Eye, action: () => router.push("/showcase") }],
        });
      }

      // Section-aware: link straight to the part of the page you clicked
      const section = target.closest<HTMLElement>("main [id]:not(main)");
      const serviceLink = target.closest<HTMLAnchorElement>('a[href^="/services#"]');
      const here: Item[] = [];
      if (serviceLink) {
        const name = serviceLink.querySelector("h3")?.textContent ?? "this service";
        here.push({ id: "ask-svc", label: `Ask about ${name}`, icon: MessageCircle, action: () => openChat(`Tell me about ${name}`) });
      }
      if (section?.id && !["main"].includes(section.id)) {
        here.push({
          id: "copy-section",
          label: "Copy link to this section",
          icon: Hash,
          action: async () => toast((await copyText(`${window.location.origin}${pathname}#${section.id}`)) ? "Section link copied" : "Couldn't copy"),
        });
      }
      if (here.length) groups.push({ title: "This section", items: here });

      groups.push({
        title: "Assistant",
        items: [
          { id: "estimate", label: "Get an instant estimate", icon: Sparkles, action: () => openChat("Estimate my project") },
          { id: "ask", label: "Ask the assistant", icon: MessageCircle, action: () => openChat() },
        ],
      });

      const pages: Item[] = [
        { id: "home", label: "Home", icon: House, action: () => router.push("/") },
        { id: "about", label: "About", icon: User, action: () => router.push("/about") },
        { id: "services", label: "Services", icon: Layers, action: () => router.push("/services") },
        { id: "showcase", label: "Showcase", icon: LayoutTemplate, action: () => router.push("/showcase") },
        { id: "contact", label: "Start a project", icon: Mail, action: () => router.push("/contact") },
      ].filter((it) => {
        const href = it.id === "home" ? "/" : it.id === "contact" ? "/contact" : `/${it.id}`;
        return href === "/" ? pathname !== "/" : !pathname.startsWith(href);
      });
      groups.push({ title: "Go to", items: pages });

      const pageItems: Item[] = [
        { id: "copy-page", label: "Copy page link", icon: LinkIcon, action: async () => toast((await copyText(window.location.href)) ? "Page link copied" : "Couldn't copy") },
      ];
      if (typeof navigator !== "undefined" && "share" in navigator) {
        pageItems.push({
          id: "share",
          label: "Share this page",
          icon: Share2,
          action: () => navigator.share({ title: document.title, url: window.location.href }).catch(() => {}),
        });
      }
      pageItems.push({ id: "close", label: "Close", icon: X, hint: "Esc", action: () => {} });
      groups.push({ items: pageItems });

      // Browser-style controls on top
      groups.unshift({
        row: true,
        items: [
          { id: "back", label: "Back", icon: ArrowLeft, action: () => router.back() },
          { id: "forward", label: "Forward", icon: ArrowRight, action: () => router.forward() },
          { id: "reload", label: "Reload", icon: RotateCw, action: () => window.location.reload() },
          { id: "top", label: "Scroll to top", icon: ArrowUp, action: () => scrollTo(0, { offset: 0 }) },
        ],
      });
      return groups;
    },
    [router, scrollTo, toast, pathname]
  );

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const onContext = (e: MouseEvent) => {
      if (coarse.matches || e.shiftKey) return; // keep native long-press / power-user menu
      const t = e.target as HTMLElement;
      if (t.closest("input,textarea,select,[contenteditable=''],[contenteditable='true'],[data-native-context]")) return;
      if (t.closest("[data-loader]")) return;
      e.preventDefault();
      restoreFocus.current = document.activeElement as HTMLElement;
      setState({ x: e.clientX, y: e.clientY, groups: build(t) });
    };
    document.addEventListener("contextmenu", onContext);
    return () => document.removeEventListener("contextmenu", onContext);
  }, [build]);

  // Keep the menu on-screen
  useLayoutEffect(() => {
    if (!state || !menuRef.current) return;
    const { offsetWidth: w, offsetHeight: h } = menuRef.current;
    const pad = 10;
    const x = Math.min(state.x, window.innerWidth - w - pad);
    const y = state.y + h > window.innerHeight - pad ? Math.max(pad, state.y - h) : state.y;
    setPos({ x: Math.max(pad, x), y: Math.max(pad, y) });
    menuRef.current.querySelector<HTMLElement>("[role=menuitem]")?.focus({ preventScroll: true });
  }, [state]);

  useEffect(() => {
    if (!state) return;
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setState(null);
    };
    const onKey = (e: KeyboardEvent) => {
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []);
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        items[(i + 1) % items.length]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        items[(i - 1 + items.length) % items.length]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        items[items.length - 1]?.focus();
      } else if (e.key === "Tab") {
        setState(null);
      }
    };
    const onScroll = () => setState(null);
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("blur", onScroll);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("blur", onScroll);
    };
  }, [state, close]);

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          ref={menuRef}
          role="menu"
          aria-label="Context menu"
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ left: pos.x, top: pos.y, transformOrigin: "top left" }}
          className="fixed z-[250] w-64 overflow-hidden rounded-2xl border border-ink/[0.08] bg-paper/95 p-1.5 text-sm text-ink shadow-[0_24px_60px_-20px_rgba(22,27,63,.45),0_2px_6px_-2px_rgba(22,27,63,.12)] backdrop-blur-xl"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-2 px-2.5 pb-2 pt-1.5">
            <span className="size-1.5 rounded-full bg-peri" />
            <span className="eyebrow text-[0.62rem] text-ink/45">{site.name}</span>
          </div>
          {state.groups.map((g, gi) => (
            <div key={gi} role="group" aria-label={g.title} className={gi ? "mt-1 border-t border-ink/[0.07] pt-1" : ""}>
              {g.title && <p className="px-2.5 pb-1 pt-1.5 text-[0.68rem] font-medium uppercase tracking-wider text-muted">{g.title}</p>}
              {g.row ? (
                <div className="flex gap-1 px-1 pb-1">
                  {g.items.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      role="menuitem"
                      tabIndex={-1}
                      aria-label={it.label}
                      title={it.label}
                      onClick={() => {
                        setState(null);
                        it.action();
                      }}
                      className="grid h-9 flex-1 place-items-center rounded-lg bg-ink/[0.04] text-ink/70 outline-none transition-colors hover:bg-deep hover:text-lav focus:bg-deep focus:text-lav"
                    >
                      <it.icon className="size-4" />
                    </button>
                  ))}
                </div>
              ) : g.items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => {
                    setState(null);
                    it.action();
                  }}
                  className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-ink/80 outline-none transition-colors hover:bg-deep hover:text-lav focus-visible:bg-deep focus-visible:text-lav focus:bg-deep focus:text-lav"
                >
                  <it.icon className="size-4 shrink-0 opacity-60 group-hover:opacity-100 group-focus:opacity-100" />
                  <span className="flex-1 truncate">{it.label}</span>
                  {it.hint && <span className="font-mono text-[0.62rem] opacity-40">{it.hint}</span>}
                </button>
              ))}
            </div>
          ))}
          <p className="mt-1 border-t border-ink/[0.07] px-2.5 pb-1 pt-2 text-[0.66rem] text-ink/40">Shift + right-click for the browser menu</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

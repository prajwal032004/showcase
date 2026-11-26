"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarClock, ChevronDown, Clock, Copy, Globe2, Mail, MessageSquareText, Sparkles } from "lucide-react";
import { site, socials, pricing } from "@/lib/site";
import { projects, categories } from "@/lib/projects";
import { DesktopMockup } from "@/components/showcase/SiteMockup";
import { founders } from "@/lib/founders";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useIntro, useSmoothScroll, useToast } from "./Providers";
import { openChat } from "@/components/ai/ChatLauncher";
import { navMenus, type NavMenu } from "./navData";
import { copyText, cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const CONTACT_TILES: { icon: typeof Sparkles; title: string; text: string; href?: string; chat?: boolean; dark?: boolean }[] = [
  { icon: ArrowUpRight, title: "Start a project", text: "Guided inquiry, ready-made email", href: "/contact", dark: true },
  { icon: Sparkles, title: "AI project planner", text: "Instant scope & estimate", href: "/contact#planner-title" },
  { icon: MessageSquareText, title: "Ask the assistant", text: "Pricing, process, anything", chat: true },
  { icon: CalendarClock, title: "Book a call", text: "Share a few times that suit you", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { ready } = useIntro();
  const { lenis, stop, start } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false); // mobile menu
  const [mega, setMega] = useState<string | null>(null); // desktop hover menu
  const lastY = useRef(0);
  const closeTimer = useRef<number | null>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Show / hide on scroll direction
  useEffect(() => {
    const onScroll = (y: number) => {
      setScrolled(y > 24);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 420);
        if (delta > 0) setMega(null);
      }
      lastY.current = y;
    };
    if (lenis) {
      const h = ({ scroll }: { scroll: number }) => onScroll(scroll);
      lenis.on("scroll", h);
      return () => lenis.off("scroll", h);
    }
    const h = () => onScroll(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    h();
    return () => window.removeEventListener("scroll", h);
  }, [lenis]);

  useEffect(() => {
    setOpen(false);
    setMega(null);
  }, [pathname]);

  // Desktop hover intent (small delay so moving to the panel doesn't close it)
  const openMega = useCallback((key: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMega(key);
  }, []);
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(null), 160);
  }, []);
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mega]);

  // Mobile: lock scroll, Escape, focus trap
  useEffect(() => {
    if (!open) return;
    stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a,button");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
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
    setTimeout(() => panelRef.current?.querySelector<HTMLElement>("a,button")?.focus(), 350);
    return () => {
      document.removeEventListener("keydown", onKey);
      start();
      menuBtn.current?.focus({ preventScroll: true });
    };
  }, [open, stop, start]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const current = navMenus.find((m) => m.href === mega);
  const solid = (scrolled || !!mega) && !open;

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={ready ? { y: hidden && !open && !mega ? -110 : 0, opacity: 1 } : { y: -24, opacity: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: ready && !scrolled ? 0.5 : 0 }}
        className="fixed inset-x-0 top-0 z-[99] px-3 pt-3 sm:px-5 sm:pt-4"
        onMouseLeave={scheduleClose}
      >
        <div className="relative mx-auto max-w-[132rem]">
          <nav
            aria-label="Primary"
            className={cn(
              "relative z-[2] flex h-14 items-center justify-between rounded-full pl-4 pr-2 transition-[background-color,box-shadow,border-color] duration-500 sm:h-16 sm:pl-6",
              solid
                ? "border border-ink/[0.07] bg-lav/90 shadow-[0_12px_40px_-24px_rgba(22,27,63,.45)] backdrop-blur-md"
                : "border border-transparent bg-transparent"
            )}
          >
            <Logo mono={open} className={cn("relative z-[2] transition-colors", open ? "text-lav" : "text-ink")} />

            <ul className="hidden items-center gap-0.5 lg:flex">
              {navMenus.map((item) => {
                const active = isActive(item.href);
                const expanded = mega === item.href;
                return (
                  <li key={item.href} onMouseEnter={() => openMega(item.href)} onFocus={() => openMega(item.href)}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      aria-expanded={expanded}
                      aria-haspopup="true"
                      className={cn(
                        "relative flex items-center gap-1 rounded-full px-4 py-2 text-[1.05rem] transition-colors duration-300",
                        active ? "text-deep" : expanded ? "text-ink" : "text-ink/70 hover:text-ink"
                      )}
                    >
                      {(active || expanded) && (
                        <motion.span
                          layoutId={active ? "nav-active" : "nav-hover"}
                          className={cn("absolute inset-0 -z-[1] rounded-full", active ? "bg-deep/[0.09]" : "bg-ink/[0.05]")}
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      {item.label}
                      <ChevronDown className={cn("size-3.5 opacity-50 transition-transform duration-300", expanded && "rotate-180 opacity-90")} aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openChat("Estimate my project")}
                className="hidden h-11 items-center gap-2 rounded-full px-4 text-[1.05rem] text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-deep xl:flex"
              >
                <Sparkles className="size-4" aria-hidden /> AI estimate
              </button>
              <span className="hidden sm:block">
                <ButtonLink href="/contact" size="sm" icon className="h-11 text-[1.05rem]">
                  Start a project
                </ButtonLink>
              </span>
              <button
                ref={menuBtn}
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className={cn(
                  "relative z-[2] flex h-11 items-center gap-2.5 rounded-full pl-4 pr-3.5 text-sm font-medium transition-colors lg:hidden",
                  open ? "bg-lav text-deep" : "bg-deep text-lav"
                )}
              >
                <span>{open ? "Close" : "Menu"}</span>
                <span className="relative block h-3 w-5">
                  <span
                    className={cn(
                      "absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                      open && "translate-y-[5px] rotate-45"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                      open && "-translate-y-[5.5px] -rotate-45"
                    )}
                  />
                </span>
              </button>
            </div>
          </nav>

          {/* Desktop mega menu */}
          <AnimatePresence>
            {current && (
              <motion.div
                key="mega"
                onMouseEnter={() => openMega(current.href)}
                onMouseLeave={scheduleClose}
                initial={{ opacity: 0, y: -8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.18 } }}
                transition={{ duration: 0.35, ease: EASE }}
                className="absolute inset-x-0 top-full hidden pt-2 lg:block"
              >
                <div className="overflow-hidden rounded-[2rem] bg-paper/95 shadow-[0_40px_100px_-40px_rgba(22,27,63,.55)] ring-1 ring-ink/[0.07] backdrop-blur-xl">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={current.href}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: EASE }}
                    >
                      <MegaPanel menu={current} onNavigate={() => setMega(null)} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Soft dim behind the mega menu */}
      <AnimatePresence>
        {current && (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[80] hidden bg-night/10 backdrop-blur-[2px] lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <MobileMenu open={open} panelRef={panelRef} isActive={isActive} onClose={() => setOpen(false)} />
    </>
  );
}

/* ───────────────────── Desktop mega panel ───────────────────── */

function MegaPanel({ menu, onNavigate }: { menu: NavMenu; onNavigate: () => void }) {
  const toast = useToast();
  const featured = projects.find((p) => !p.concept) ?? projects[0];
  const cols = menu.columns;
  return (
    <div className="grid grid-cols-12 gap-8 p-8">
      <div className="col-span-3 flex flex-col">
        <p className="eyebrow text-ink/45">{menu.label}</p>
        <p className="mt-3 font-display text-2xl font-light leading-snug tracking-[-0.03em] text-ink">{menu.intro}</p>
        {menu.feature === "project" && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <Link
                key={c}
                href={c === "All" ? "/showcase" : `/showcase?category=${encodeURIComponent(c)}`}
                onClick={onNavigate}
                className="rounded-full border border-ink/10 px-3 py-1 text-sm text-ink/70 transition-colors hover:border-deep hover:bg-deep hover:text-lav"
              >
                {c}
              </Link>
            ))}
          </div>
        )}
        {menu.feature === "contact" && (
          <ul className="mt-5 space-y-3 text-sm text-ink/65">
            <li className="flex items-center gap-2.5">
              <Clock className="size-4 text-deep" aria-hidden /> Replies within a couple of working days
            </li>
            <li className="flex items-center gap-2.5">
              <Globe2 className="size-4 text-deep" aria-hidden /> {site.location}
            </li>
            <li className="flex items-center gap-2.5">
              <Sparkles className="size-4 text-deep" aria-hidden /> Websites from {pricing.startingPriceLabel}
            </li>
          </ul>
        )}
        <Link href={menu.href} onClick={onNavigate} className="group mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-deep">
          Go to {menu.label}
          <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" aria-hidden />
        </Link>
      </div>

      {menu.feature === "project" ? (
        <div className="col-span-5">
          <p className="eyebrow mb-3 text-ink/40">All projects</p>
          <ul className="grid grid-cols-3 gap-3">
            {projects.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <Link href={`/showcase/${p.slug}`} onClick={onNavigate} className="group block">
                  <div className="overflow-hidden rounded-xl ring-1 ring-ink/[0.06] transition-transform duration-500 group-hover:-translate-y-0.5">
                    <DesktopMockup project={p} chrome={false} className="rounded-xl shadow-none" />
                  </div>
                  <p className="mt-1.5 truncate text-sm font-medium text-ink group-hover:text-deep">{p.title}</p>
                  <p className="truncate text-xs text-ink/45">
                    {p.category}
                    {!p.concept && " · Live"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : menu.feature === "contact" ? (
        <div className="col-span-5">
          <p className="eyebrow mb-3 text-ink/40">How would you like to start?</p>
          <div className="grid grid-cols-2 gap-3">
            {CONTACT_TILES.map((t) => {
              const inner = (
                <>
                  <t.icon className={cn("size-5", t.dark ? "text-peri" : "text-deep")} aria-hidden />
                  <span className="mt-6 block font-medium">{t.title}</span>
                  <span className={cn("mt-0.5 block text-sm", t.dark ? "text-lav/65" : "text-ink/55")}>{t.text}</span>
                </>
              );
              const cls = cn(
                "block h-full w-full rounded-2xl p-4 text-left transition-all duration-300 hover:-translate-y-0.5",
                t.dark ? "bg-deep text-lav hover:bg-ink" : "bg-lav text-ink ring-1 ring-ink/[0.05] hover:ring-deep/30"
              );
              return t.chat ? (
                <button
                  key={t.title}
                  type="button"
                  className={cls}
                  onClick={() => {
                    onNavigate();
                    openChat();
                  }}
                >
                  {inner}
                </button>
              ) : (
                <Link key={t.title} href={t.href ?? "/contact"} onClick={onNavigate} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
      <div className={cn("col-span-5 grid gap-6", cols.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="eyebrow mb-3 text-ink/40">{col.title}</p>
            <ul className={cn("grid gap-0.5", cols.length === 1 && col.links.length > 4 && "grid-cols-2")}>
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} onClick={onNavigate} className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-lav">
                    <span className="flex items-center gap-1.5 text-[1.05rem] font-medium text-ink group-hover:text-deep">
                      {l.label}
                      <ArrowUpRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                    </span>
                    {l.desc && <span className="mt-0.5 block text-sm text-ink/50">{l.desc}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      )}

      <div className="col-span-4">
        {menu.feature === "pricing" && (
          <div className="relative h-full overflow-hidden rounded-3xl bg-deep p-6 text-lav">
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-peri/40 blur-2xl" aria-hidden />
            <p className="eyebrow text-lav/60">Websites from</p>
            <p className="mt-2 font-display text-5xl font-extralight tracking-[-0.05em]">{pricing.startingPriceLabel}</p>
            <p className="mt-3 text-sm text-lav/70">Design, build, domain & email guidance, basic SEO and launch — itemised.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/services#breakdown" onClick={onNavigate} className="rounded-full bg-lav px-4 py-2 text-sm font-medium text-deep hover:bg-paper">
                See breakdown
              </Link>
              <button
                type="button"
                onClick={() => {
                  onNavigate();
                  openChat("Estimate my project");
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-lav/30 px-4 py-2 text-sm hover:border-lav"
              >
                <Sparkles className="size-3.5" aria-hidden /> AI estimate
              </button>
            </div>
          </div>
        )}
        {menu.feature === "project" && featured && (
          <Link href={`/showcase/${featured.slug}`} onClick={onNavigate} className="group block overflow-hidden rounded-3xl bg-lav ring-1 ring-ink/[0.06]">
            <div className="relative aspect-[16/9] overflow-hidden bg-night">
              {featured.media?.desktop && (
                <Image src={featured.media.desktop} alt="" fill sizes="30vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              )}
              {!featured.concept && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#1f9d6b] px-2.5 py-1 text-xs font-medium text-white">
                  <span className="size-1.5 rounded-full bg-white" /> Live project
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium text-ink">{featured.title}</p>
                <p className="text-sm text-ink/55">{featured.industry}</p>
              </div>
              <ArrowUpRight className="size-5 text-deep transition-transform group-hover:rotate-45" aria-hidden />
            </div>
          </Link>
        )}
        {menu.feature === "founders" && (
          <div className="h-full rounded-3xl bg-lav p-6">
            <p className="eyebrow text-ink/45">Founded by</p>
            <ul className="mt-4 space-y-3">
              {founders.map((f) => (
                <li key={f.name} className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-peri to-deep font-display text-sm text-lav">{f.initials}</span>
                  <span className="font-medium text-ink">{f.name}</span>
                </li>
              ))}
            </ul>
            <Link href="/about#founders" onClick={onNavigate} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-deep">
              Meet the founders <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        )}
        {menu.feature === "contact" && (
          <div className="h-full rounded-3xl bg-deep p-6 text-lav">
            <p className="eyebrow text-lav/60">Email us directly</p>
            <p className="mt-2 break-words font-display text-2xl font-light tracking-[-0.03em]">{site.email}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={async () => toast((await copyText(site.email)) ? "Email copied" : "Couldn't copy")}
                className="inline-flex items-center gap-1.5 rounded-full bg-lav px-4 py-2 text-sm font-medium text-deep"
              >
                <Copy className="size-3.5" aria-hidden /> Copy
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate();
                  openChat();
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-lav/30 px-4 py-2 text-sm hover:border-lav"
              >
                <Sparkles className="size-3.5" aria-hidden /> Ask the assistant
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 border-t border-lav/15 pt-4 text-sm text-lav/60">
              {socials.map((so) => (
                <a key={so.label} href={so.href} target="_blank" rel="noopener noreferrer" className="hover:text-lav">
                  {so.label}
                </a>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-xs text-lav/45">
              <Link href="/privacy-policy" onClick={onNavigate} className="hover:text-lav">
                Privacy
              </Link>
              <Link href="/terms-and-conditions" onClick={onNavigate} className="hover:text-lav">
                Terms
              </Link>
            </div>
          </div>
        )}
        {menu.feature === "home" && (
          <div className="relative h-full overflow-hidden rounded-3xl bg-lav p-6">
            <LogoMark className="absolute -bottom-6 -right-6 size-40 opacity-20" />
            <p className="eyebrow text-ink/45">{site.availability}</p>
            <p className="mt-3 max-w-[16rem] font-display text-2xl font-light tracking-[-0.03em] text-ink">Have an idea? Get an instant estimate.</p>
            <button
              type="button"
              onClick={() => {
                onNavigate();
                openChat("Estimate my project");
              }}
              className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-deep px-4 py-2.5 text-sm font-medium text-lav hover:bg-ink"
            >
              <Sparkles className="size-4" aria-hidden /> Try the AI planner
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────── Mobile menu ───────────────────── */

function MobileMenu({
  open,
  panelRef,
  isActive,
  onClose,
}: {
  open: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  isActive: (href: string) => boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toast = useToast();
  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          data-lenis-prevent
          className="fixed inset-0 z-[98] flex flex-col overflow-y-auto overscroll-contain bg-deep text-lav lg:hidden"
          initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2.6rem)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2.6rem)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2.6rem)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="pointer-events-none absolute -right-24 bottom-24 opacity-[0.06]" aria-hidden>
            <LogoMark mono className="size-[26rem] text-lav" />
          </div>
          <div className="container-x relative flex flex-1 flex-col pb-8 pt-24">
            {/* Quick actions */}
            <motion.div
              className="grid grid-cols-2 gap-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            >
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setTimeout(() => openChat("Estimate my project"), 350);
                }}
                className="flex flex-col items-start gap-3 rounded-2xl bg-lav/10 p-4 text-left ring-1 ring-lav/10 active:scale-[0.98]"
              >
                <Sparkles className="size-5 text-peri" aria-hidden />
                <span className="text-sm font-medium leading-tight">Instant AI estimate</span>
              </button>
              <Link href="/contact" onClick={onClose} className="flex flex-col items-start gap-3 rounded-2xl bg-lav p-4 text-deep active:scale-[0.98]">
                <ArrowUpRight className="size-5" aria-hidden />
                <span className="text-sm font-medium leading-tight">Start a project</span>
              </Link>
            </motion.div>

            <p className="eyebrow mb-2 mt-8 text-lav/45">Menu</p>
            <ul className="flex flex-col">
              {navMenus.map((item, i) => {
                const isOpen = expanded === item.href;
                const links = item.columns.flatMap((c) => c.links);
                return (
                  <motion.li
                    key={item.href}
                    className="border-b border-lav/10"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className="flex flex-1 items-baseline gap-4 py-4 font-display text-[clamp(2rem,9vw,3.2rem)] font-light leading-none tracking-[-0.04em]"
                      >
                        <span className="font-mono text-xs tracking-normal text-lav/40">0{i + 1}</span>
                        <span className={cn(isActive(item.href) && "italic text-peri")}>{item.label}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : item.href)}
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? "Hide" : "Show"} ${item.label} links`}
                        className={cn(
                          "grid size-11 place-items-center rounded-full border transition-colors",
                          isOpen ? "border-lav bg-lav text-deep" : "border-lav/20 text-lav/80"
                        )}
                      >
                        <ChevronDown className={cn("size-4 transition-transform duration-300", isOpen && "rotate-180")} aria-hidden />
                      </button>
                    </div>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="grid grid-cols-2 gap-1 overflow-hidden pb-4"
                        >
                          {links.map((l) => (
                            <li key={l.href + l.label}>
                              <Link href={l.href} onClick={onClose} className="block rounded-xl bg-lav/[0.06] px-3 py-2.5 text-sm text-lav/85 active:bg-lav/15">
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div className="mt-auto pt-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}>
              <button
                type="button"
                onClick={async () => toast((await copyText(site.email)) ? "Email copied" : "Couldn't copy")}
                className="flex w-full items-center justify-between gap-3 rounded-2xl bg-lav/10 px-4 py-3.5 text-left"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Mail className="size-4 shrink-0 text-peri" aria-hidden />
                  <span className="truncate text-sm">{site.email}</span>
                </span>
                <Copy className="size-4 shrink-0 text-lav/60" aria-hidden />
              </button>
              <div className="mt-5 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-lav/15 px-3.5 py-1.5 text-sm text-lav/70 hover:text-lav"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

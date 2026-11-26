"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { nav, site, socials } from "@/lib/site";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useIntro, useSmoothScroll } from "./Providers";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar() {
  const pathname = usePathname();
  const { ready } = useIntro();
  const { lenis, stop, start } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Show / hide on scroll direction
  useEffect(() => {
    const onScroll = (y: number) => {
      setScrolled(y > 24);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) setHidden(delta > 0 && y > 420);
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

  // Close menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll, Escape to close, simple focus trap
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
    setTimeout(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus(), 350);
    return () => {
      document.removeEventListener("keydown", onKey);
      start();
      menuBtn.current?.focus({ preventScroll: true });
    };
  }, [open, stop, start]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={ready ? { y: hidden && !open ? -110 : 0, opacity: 1 } : { y: -24, opacity: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: ready && !scrolled ? 0.5 : 0 }}
        className="fixed inset-x-0 top-0 z-[90] px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-14 max-w-[132rem] items-center justify-between rounded-full pl-4 pr-2 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 sm:h-16 sm:pl-6",
            scrolled && !open
              ? "border border-ink/[0.07] bg-lav/85 shadow-[0_12px_40px_-24px_rgba(22,27,63,.45)] backdrop-blur-md"
              : "border border-transparent bg-transparent"
          )}
        >
          <Logo mono={open} className={cn("relative z-[2] transition-colors", open ? "text-lav" : "text-ink")} />

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-[0.92rem] transition-colors duration-300",
                      active ? "text-deep" : "text-ink/70 hover:text-ink"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-[1] rounded-full bg-deep/[0.08]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <ButtonLink href="/contact" size="sm" icon className="h-11">
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
                "relative z-[2] grid size-11 place-items-center rounded-full transition-colors lg:hidden",
                open ? "bg-lav text-deep" : "bg-deep text-lav"
              )}
            >
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
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[85] flex flex-col overflow-y-auto bg-deep text-lav lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 2.6rem) 2.6rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.6rem) 2.6rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.6rem) 2.6rem)" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="pointer-events-none absolute -right-24 bottom-24 opacity-[0.07]">
              <LogoMark mono className="size-[26rem] text-lav" />
            </div>
            <div className="container-x flex flex-1 flex-col pb-8 pt-28">
              <p className="eyebrow mb-6 text-lav/50">Menu</p>
              <ul className="flex flex-col">
                {nav.map((item, i) => (
                  <li key={item.href} className="overflow-hidden border-b border-lav/10">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.06 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className="group flex items-center justify-between py-4 font-display text-[clamp(2.2rem,10vw,4rem)] font-light leading-none tracking-[-0.04em]"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-mono text-xs tracking-normal text-lav/40">0{i + 1}</span>
                          <span className={cn(isActive(item.href) && "italic text-peri")}>{item.label}</span>
                        </span>
                        <ArrowUpRight className="size-7 opacity-40 transition-all group-hover:rotate-45 group-hover:opacity-100" aria-hidden />
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
              <motion.div
                className="mt-auto pt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <ButtonLink href="/contact" variant="light" size="lg" icon className="w-full" onClick={() => setOpen(false)}>
                  Start a project
                </ButtonLink>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-lav/60">
                  <a href={`mailto:${site.email}`} className="hover:text-lav">
                    {site.email}
                  </a>
                  <div className="flex gap-4">
                    {socials.map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-lav">
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

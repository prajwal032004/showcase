import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The Forma mark: three stepped platforms (an abstract "F" and a staircase
 * of building blocks) with a sphere resting on the lowest step.
 */
export function LogoMark({ className, mono = false }: { className?: string; mono?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <rect x="2" y="4" width="44" height="12" rx="1.5" fill={mono ? "currentColor" : "#3D52A0"} />
      <rect x="2" y="18" width="30" height="12" rx="1.5" fill={mono ? "currentColor" : "#7091E6"} opacity={mono ? 0.75 : 1} />
      <rect x="2" y="32" width="16" height="12" rx="1.5" fill={mono ? "currentColor" : "#8697C4"} opacity={mono ? 0.5 : 1} />
      <circle cx="39" cy="38" r="6" fill={mono ? "currentColor" : "#3D52A0"} opacity={mono ? 0.9 : 1} />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-baseline gap-1.5 leading-none", className)}>
      <span className="font-display text-[1.15em] font-medium tracking-[-0.04em]">{site.wordmark}</span>
      <span className="font-mono text-[0.55em] tracking-[0.2em] opacity-60">{site.wordmarkSuffix}</span>
    </span>
  );
}

export function Logo({ className, mono = false, onClick }: { className?: string; mono?: boolean; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className={cn("group inline-flex items-center gap-2.5", className)} aria-label={`${site.name} — home`}>
      <LogoMark mono={mono} className="size-7 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-6 group-hover:scale-105" />
      <Wordmark className="text-base" />
    </Link>
  );
}

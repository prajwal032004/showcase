"use client";

import Link from "next/link";
import { forwardRef, useRef } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outline-light";
type Size = "md" | "lg" | "sm";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[color,background-color,border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-expo)] disabled:pointer-events-none disabled:opacity-60 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-deep text-lav shadow-[0_10px_30px_-12px_rgba(61,82,160,.7)] hover:shadow-[0_18px_40px_-14px_rgba(61,82,160,.85)]",
  secondary: "bg-paper text-ink border border-ink/10 hover:border-deep/30",
  ghost: "text-ink hover:bg-ink/5",
  light: "bg-lav text-deep hover:bg-paper",
  "outline-light": "border border-lav/30 text-lav hover:border-lav/70",
};
const fills: Record<Variant, string> = {
  primary: "bg-ink",
  secondary: "bg-deep",
  ghost: "bg-transparent",
  light: "bg-peri",
  "outline-light": "bg-lav",
};
const hoverText: Record<Variant, string> = {
  primary: "",
  secondary: "group-hover/btn:text-lav",
  ghost: "",
  light: "group-hover/btn:text-lav",
  "outline-light": "group-hover/btn:text-deep",
};
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-7 text-base sm:h-16 sm:px-8 sm:text-lg",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  icon?: boolean;
  iconNode?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  magnetic?: boolean;
};

function Inner({ variant = "primary", icon, iconNode, children, loading }: CommonProps & { loading?: boolean }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 translate-y-[101%] rounded-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-y-0",
          fills[variant]
        )}
      />
      <span className={cn("relative z-10 flex items-center gap-2.5 transition-colors duration-500", hoverText[variant])}>
        {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
        {children}
        {iconNode ??
          (icon ? (
            <span className="relative grid size-4 place-items-center overflow-hidden">
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:-translate-y-4 group-hover/btn:translate-x-4"
              />
              <ArrowUpRight
                aria-hidden
                className="absolute size-4 -translate-x-4 translate-y-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
              />
            </span>
          ) : null)}
      </span>
    </>
  );
}

function useMagnet(enabled: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  const onMove = (e: React.PointerEvent) => {
    if (!enabled || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return { ref, onMove, onLeave };
}

type LinkProps = CommonProps & { href: string; external?: boolean; onClick?: () => void; "aria-label"?: string };

export function ButtonLink({ href, external, variant = "primary", size = "md", className, magnetic = true, ...rest }: LinkProps) {
  const m = useMagnet(magnetic);
  const cls = cn(base, variants[variant], sizes[size], className);
  if (external) {
    return (
      <a
        ref={m.ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        onPointerMove={m.onMove}
        onPointerLeave={m.onLeave}
        onClick={rest.onClick}
        aria-label={rest["aria-label"]}
      >
        <Inner variant={variant} {...rest} />
      </a>
    );
  }
  return (
    <Link
      ref={m.ref as React.Ref<HTMLAnchorElement>}
      href={href}
      className={cls}
      onPointerMove={m.onMove}
      onPointerLeave={m.onLeave}
      onClick={rest.onClick}
      aria-label={rest["aria-label"]}
    >
      <Inner variant={variant} {...rest} />
    </Link>
  );
}

type BtnProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & { loading?: boolean };

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = "primary", size = "md", className, icon, iconNode, children, loading, magnetic = false, type = "button", ...props },
  _ref
) {
  const m = useMagnet(magnetic);
  return (
    <button
      ref={m.ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      onPointerMove={m.onMove}
      onPointerLeave={m.onLeave}
      aria-busy={loading || undefined}
      {...props}
    >
      <Inner variant={variant} icon={icon} iconNode={iconNode} loading={loading}>
        {children}
      </Inner>
    </button>
  );
});

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grid min-h-[90svh] place-items-center bg-lav px-6 pt-24 text-center">
      <div>
        <p className="eyebrow text-ink/50">Error 404</p>
        <h1 className="mt-6 font-display text-[clamp(6rem,22vw,16rem)] font-extralight leading-none tracking-[-0.08em] text-deep">404</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink/65">This page took a wrong turn somewhere in the stack. Let&apos;s get you back on track.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" icon>
            Back home
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact us
          </ButtonLink>
        </div>
        <p className="mt-8 text-sm text-ink/50">
          Or explore the{" "}
          <Link href="/showcase" className="text-deep underline underline-offset-4">
            showcase
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

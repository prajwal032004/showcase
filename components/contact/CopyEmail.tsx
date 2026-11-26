"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { site } from "@/lib/site";
import { copyText } from "@/lib/utils";
import { useToast } from "@/components/layout/Providers";

export function CopyEmail() {
  const [done, setDone] = useState(false);
  const toast = useToast();
  return (
    <div className="mt-3">
      <a href={`mailto:${site.email}`} className="block break-words font-display text-[clamp(1.2rem,1.7vw,1.6rem)] font-light tracking-[-0.03em] hover:underline">
        {site.email}
      </a>
      <button
        type="button"
        onClick={async () => {
          const ok = await copyText(site.email);
          toast(ok ? "Email copied to clipboard" : "Couldn't copy — please copy manually", ok ? "ok" : "error");
          if (ok) {
            setDone(true);
            setTimeout(() => setDone(false), 2000);
          }
        }}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-lav/25 px-4 py-2 text-sm text-lav/85 transition-colors hover:border-lav hover:text-lav"
      >
        {done ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        {done ? "Copied" : "Copy address"}
      </button>
    </div>
  );
}

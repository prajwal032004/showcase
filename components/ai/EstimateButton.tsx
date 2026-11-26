"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { openChat } from "./ChatLauncher";

export function EstimateButton({ label = "Get an instant estimate", variant = "secondary" as const }: { label?: string; variant?: "secondary" | "light" }) {
  return (
    <Button size="lg" variant={variant} onClick={() => openChat("Estimate my project")} iconNode={<Sparkles className="size-4" aria-hidden />}>
      {label}
    </Button>
  );
}

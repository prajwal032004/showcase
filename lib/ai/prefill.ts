"use client";

import { emptyInquiry, formatText, type Inquiry } from "@/lib/inquiry";
import { inr, type Estimate } from "./estimator";

export const DRAFT_KEY = "forma-inquiry-draft";
export const DRAFT_EVENT = "forma:draft-updated";

/** Merge an AI estimate into the contact-form draft (kept in sessionStorage only). */
export function applyEstimateToDraft(est: Estimate, description: string) {
  let draft: Inquiry = emptyInquiry;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (raw) draft = { ...emptyInquiry, ...JSON.parse(raw) };
  } catch {}
  const summary = [
    formatText(description),
    "",
    `Assistant summary: ${est.summary}`,
    `Suggested pages: ${est.pages.join(", ")}`,
    est.features.length ? `Features: ${est.features.map((f) => f.label).join(", ")}` : "",
    `Indicative estimate: ${inr(est.low)} – ${inr(est.high)}, ~${est.weeks[0]}–${est.weeks[1]} weeks`,
  ]
    .filter((l) => l !== null)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
  const next: Inquiry = {
    ...draft,
    type: est.type,
    budget: est.budgetOption,
    timeline: est.timelineOption,
    description: summary,
  };
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new CustomEvent(DRAFT_EVENT));
}

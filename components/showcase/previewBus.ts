"use client";

export const PREVIEW_EVENT = "forma:project-preview";

export function openProjectPreview(slug: string) {
  window.dispatchEvent(new CustomEvent<string>(PREVIEW_EVENT, { detail: slug }));
}

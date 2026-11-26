"use client";
import { useEffect, useLayoutEffect, useState } from "react";

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

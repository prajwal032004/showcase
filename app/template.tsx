"use client";

import { motion } from "framer-motion";

/** Pages fade in under the RouteTransition curtain (opacity only, so GSAP pinning stays reliable). */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0.001 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
      {children}
    </motion.div>
  );
}

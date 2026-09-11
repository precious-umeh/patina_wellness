"use client";

import { AnimatePresence, useReducedMotion } from "framer-motion";

function PresenceTable({
  children,
  className = "",
  mode = "sync",
  initial = false,
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <tbody className={className}>
      <AnimatePresence
        mode={mode}
        initial={shouldReduceMotion ? false : initial}
      >
        {children}
      </AnimatePresence>
    </tbody>
  );
}

export default PresenceTable;

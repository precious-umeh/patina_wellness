"use client";

import {
  AnimatePresence as MotionPresence,
  useReducedMotion,
} from "framer-motion";

function Presence({ children, mode = "wait", initial = false }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionPresence mode={mode} initial={shouldReduceMotion ? false : initial}>
      {children}
    </MotionPresence>
  );
}

export default Presence;

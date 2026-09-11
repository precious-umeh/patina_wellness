"use client";

import { motion, useReducedMotion } from "framer-motion";

function PresenceItem({
  children,
  duration = 0.3,
  distance = 12,
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : distance,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      exit={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : -distance,
      }}

      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        ease: "easeOut",
      }}

      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PresenceItem;

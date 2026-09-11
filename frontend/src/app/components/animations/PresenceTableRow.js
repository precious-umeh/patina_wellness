"use client";

import { motion, useReducedMotion } from "framer-motion";

function PresenceTableRow({
  children,
  className = "",
  distance = 5,
  duration = 0.18,
  layout = true,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.tr
      layout={layout}

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
        layout: {
          duration: shouldReduceMotion ? 0 : 0.2,
          ease: "easeOut",
        },
      }}

      className={className}

      {...props}
    >
      {children}
    </motion.tr>
  );
}

export default PresenceTableRow;

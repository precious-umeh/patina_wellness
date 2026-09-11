"use client";

import { motion, useReducedMotion } from "framer-motion";

function FadeUp({
  children,
  delay = 0,
  duration = 0.6,
  distance = 20,
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

      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: "easeOut",
      }}

      className={className}
    >
      {children}
    </motion.div>
  );
}

export default FadeUp;

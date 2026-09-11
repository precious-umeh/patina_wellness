"use client";

import { motion, useReducedMotion } from "framer-motion";

function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  distance = 20,
  direction = "up",
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion();

  const initialPosition = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
  };

  const position = initialPosition[direction] ?? initialPosition.up;

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...(shouldReduceMotion ? { x: 0, y: 0 } : position),
      }}

      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}

      viewport={{
        once: true,
        amount: 0.2,
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

export default Reveal;

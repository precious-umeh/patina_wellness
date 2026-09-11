"use client";

import { motion, useReducedMotion } from "framer-motion";

function Stagger({ children, delay = 0, staggerDelay = 0.1, className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"

      whileInView="visible"

      viewport={{
        once: true,
        amount: 0.2,
      }}

      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: shouldReduceMotion ? 0 : delay,
            staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
          },
        },
      }}

      className={className}
    >
      {children}
    </motion.div>
  );
}

export default Stagger;

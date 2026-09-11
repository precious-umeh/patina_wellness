"use client";

import { motion, useReducedMotion } from "framer-motion";

function StaggerItem({
  children,
  duration = 0.5,
  distance = 20,
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: shouldReduceMotion ? 0 : distance,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
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

export default StaggerItem;

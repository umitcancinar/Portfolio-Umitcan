import React from "react";
import { motion } from "framer-motion";

/**
 * 🎬 PageTransition — Apple kalitesinde sayfa geçiş animasyonu
 * Framer Motion ile smooth page transitions
 */

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

const pageTransition = {
  type: "tween",
  ease: [0.16, 1, 0.3, 1], // Apple-inspired cubic bezier
  duration: 0.4,
};

function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;

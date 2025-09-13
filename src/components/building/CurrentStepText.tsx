import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export function CurrentStepText({
  text,
  isComplete,
}: {
  text: string;
  isComplete: boolean;
}) {
  return (
    <motion.div className="text-center min-h-[50px] md:min-h-[60px] mb-6 md:mb-7 px-4" key={text} initial={{ opacity: 0, y: 15, z: -20 }} animate={{ opacity: 1, y: 0, z: 0 }} exit={{ opacity: 0, y: -15, z: -20 }} transition={{ duration: 0.4 }}>
      <AnimatePresence mode="wait">
        <motion.p
          className="text-base md:text-lg font-semibold text-gray-800"
          key={text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-live="polite"
        >
          {isComplete ? "Your resume is ready!" : text}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}










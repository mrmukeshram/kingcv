import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export function CompletionSparkles({ isComplete }: { isComplete: boolean }) {
  return (
    <AnimatePresence>
      {isComplete && (
        <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-emerald-400"
              initial={{ x: "50%", y: "50%", scale: 0 }}
              animate={{
                x: `${50 + (Math.random() * 120 - 60)}%`,
                y: `${50 + (Math.random() * 80 - 40)}%`,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.2 + Math.random() * 0.6, ease: "easeOut", delay: Math.random() * 0.3 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}










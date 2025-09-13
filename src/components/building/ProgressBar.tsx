import React from "react";
import { motion } from "framer-motion";

export function ProgressBar({
  progress,
  currentColor,
  glowColor,
}: {
  progress: number;
  currentColor: string;
  glowColor: string;
}) {
  const solidGlow = glowColor.split("(")[0] + "(" + glowColor.split("(")[1].replace("0.7", "1");
  return (
    <motion.div
      className="mb-6 md:mb-7 px-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex justify-between items-center mb-2 md:mb-3">
        <span className="text-base md:text-lg font-bold text-gray-700">Progress</span>
        <motion.span
          className="text-xl md:text-2xl font-black text-gray-800"
          style={{ color: solidGlow as any }}
          key={Math.round(progress)}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 15 }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
      <div
        className="relative h-4 md:h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner"
        role="progressbar"
        aria-label="Resume building progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <motion.div
          className={`h-full bg-gradient-to-r ${currentColor} rounded-full relative shadow-md`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] animate-[shimmer_2s_infinite]"></div>
          <motion.div
            className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-xl border-2 border-white"
            style={{ boxShadow: `0 0 20px 5px ${glowColor}` }}
            animate={{ scale: [1, 1.4, 1], y: [-6, 6, -6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}



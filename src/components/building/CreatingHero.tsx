import React from "react";
import { motion } from "framer-motion";

export function CreatingHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative text-center mb-5 md:mb-7">
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block relative">
          <span className="text-gradient-primary">
            {title}
          </span>
          <motion.span
            className="absolute -inset-x-2 -bottom-2 h-1.5 rounded-full bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-fuchsia-500/60 blur-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </span>
      </motion.h2>

      <motion.p
        className="mt-2 text-sm md:text-base text-gray-600 font-medium"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {subtitle}
      </motion.p>
    </div>
  );
}



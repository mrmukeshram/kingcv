import React, { PropsWithChildren, forwardRef } from "react";
import { motion } from "framer-motion";

export const PremiumCard = forwardRef<HTMLDivElement, PropsWithChildren<{ glowColor: string; tiltX?: number; tiltY?: number }>>(
  function PremiumCard({ children, glowColor, tiltX = 0, tiltY = 0 }, ref) {
    return (
      <motion.div
        ref={ref}
        className="relative z-10 w-full max-w-4xl mx-auto"
        style={{ rotateX: tiltY * -2, rotateY: tiltX * 2, transformPerspective: 900 }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
      {/* Animated gradient border */}
      <div className="relative rounded-3xl p-[1.5px] bg-[linear-gradient(120deg,rgba(59,130,246,0.6),rgba(236,72,153,0.6),rgba(16,185,129,0.6))] bg-[length:200%_200%] animate-[background-pan_25s_linear_infinite] shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
        {/* Glass body */}
        <div className="relative rounded-3xl bg-white/85 backdrop-blur-xl border border-white/70 overflow-hidden">
          {/* Subtle vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.4)_35%,transparent_60%)]" />
          {/* Soft moving gloss */}
          <motion.div
            className="pointer-events-none absolute -top-1/2 left-0 right-0 h-full bg-gradient-to-b from-white/35 to-transparent"
            animate={{ y: [0, 30, 0], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: `drop-shadow(0 0 40px ${glowColor})` }}
          />
          <div className="relative p-5 sm:p-7">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
    );
  }
);



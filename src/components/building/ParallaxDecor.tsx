import React from "react";
import { motion } from "framer-motion";

export type Pointer = { x: number; y: number };

export function ParallaxDecor({ pointer, glowColor }: { pointer: Pointer; glowColor: string }) {
  const layer = (multiplier: number) => ({
    x: pointer.x * multiplier,
    y: pointer.y * multiplier,
  });

  return (
    <>
      {/* Soft gradient blobs with parallax */}
      <motion.div
        className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-gradient-to-br from-cyan-300/30 to-blue-400/30 blur-3xl"
        style={{ translateX: layer(12).x, translateY: layer(12).y }}
      />
      <motion.div
        className="absolute -bottom-16 -right-12 w-80 h-80 rounded-full bg-gradient-to-br from-fuchsia-300/30 to-pink-400/30 blur-3xl"
        style={{ translateX: layer(-18).x, translateY: layer(-10).y }}
      />
      <motion.div
        className="absolute top-1/3 -right-8 w-48 h-48 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-400/30 blur-3xl"
        style={{ translateX: layer(8).x, translateY: layer(-6).y }}
      />

      {/* Glow sweep behind the card */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ filter: `drop-shadow(0 0 40px ${glowColor})` }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}










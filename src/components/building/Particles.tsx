import React from "react";
import { motion } from "framer-motion";

export type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  hue: number;
};

export function Particles({ particles }: { particles: Particle[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: `hsla(${particle.hue}, 80%, 70%, 0.5)`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            boxShadow: `0 0 ${particle.size * 2}px hsla(${particle.hue}, 80%, 70%, 0.4)`,
          }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            y: [0, -(25 + particle.size * 5), 0],
            x: [0, (Math.random() - 0.5) * 50, 0],
            opacity: [0, Math.min(0.7, particle.size / 5), 0],
            scale: [1, particle.size / 3, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}









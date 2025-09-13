import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Rocket } from "lucide-react";

export function HeroBadge({
  isComplete,
  currentColor,
  glowColor,
  Icon,
}: {
  isComplete: boolean;
  currentColor: string;
  glowColor: string;
  Icon: any;
}) {
  const DisplayIcon = isComplete ? CheckCircle : Icon || Rocket;
  return (
    <motion.div className="relative w-24 h-24 md:w-28 md:h-28" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
      <motion.div className="absolute inset-0 rounded-full border-2 border-blue-200" animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.div
        className={`absolute inset-2 bg-gradient-to-br ${currentColor} rounded-full flex items-center justify-center shadow-xl`}
        style={{ boxShadow: `0 0 40px ${glowColor}` }}
        animate={{ scale: [1, 1.07, 1], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="absolute inset-0 rounded-full bg-white/20" />
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={isComplete ? { rotate: [0, 360] } : { scale: [1, 1.15, 1] }}
            transition={{ rotate: { duration: 1, repeat: isComplete ? Infinity : 0, ease: "linear" }, scale: { duration: 2.2, repeat: isComplete ? 0 : Infinity, repeatType: "reverse" } }}
          >
            <DisplayIcon className="h-10 w-10 md:h-12 md:w-12 text-white drop-shadow-lg" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}



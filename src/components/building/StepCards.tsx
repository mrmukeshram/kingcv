import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { StepDefinition } from "./steps";

export function StepCards({
  steps,
  currentStepIndex,
}: {
  steps: StepDefinition[];
  currentStepIndex: number;
}) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-7 px-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <motion.div
            key={index}
            className={`relative rounded-2xl p-4 transition-all duration-500 overflow-hidden group ${
              isCompleted
                ? "bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 shadow-md"
                : isCurrent
                ? "border-2 border-blue-300 shadow-lg"
                : "bg-gray-50 border border-gray-200"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            {isCurrent && (
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at center, ${step.glowColor}, transparent 70%)` }}
              />
            )}

            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md ${
                  isCompleted
                    ? "bg-gradient-to-br from-emerald-400 to-green-500 text-white"
                    : isCurrent
                    ? `bg-gradient-to-br ${step.color} text-white`
                    : "bg-gray-200 text-gray-500"
                }`}
                animate={
                  isCurrent
                    ? {
                        scale: [1, 1.15, 1],
                        rotate: [0, 10, -10, 0],
                        boxShadow: [
                          `0 0 0px 0px ${step.glowColor}`,
                          `0 0 0px 12px ${step.glowColor}00`,
                          `0 0 0px 0px ${step.glowColor}`,
                        ],
                      }
                    : isCompleted
                    ? { rotate: [0, 360] }
                    : {}
                }
                transition={{
                  scale: { duration: 1.8, repeat: isCurrent ? Infinity : 0 },
                  rotate: { duration: isCompleted ? 0.8 : isCurrent ? 2 : 0, repeat: isCompleted ? 0 : isCurrent ? Infinity : 0 },
                  boxShadow: { duration: 2, repeat: isCurrent ? Infinity : 0 },
                }}
                whileHover={{ y: -2, scale: 1.08 }}
              >
                {isCompleted ? <CheckCircle className="h-7 w-7" /> : <Icon className="h-7 w-7" />}
              </motion.div>

              <motion.span
                className={`text-xs font-semibold ${
                  isCompleted ? "text-emerald-700" : isCurrent ? "text-blue-700" : "text-gray-600"
                }`}
                animate={isCurrent ? { x: [0, 4, 0] } : {}}
                transition={{ duration: 1.7, repeat: isCurrent ? Infinity : 0 }}
              >
                {step.text}
              </motion.span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}










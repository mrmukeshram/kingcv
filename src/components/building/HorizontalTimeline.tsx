import React from "react";
import { motion } from "framer-motion";
import type { StepDefinition } from "./steps";
import { CheckCircle } from "lucide-react";

export function HorizontalTimeline({
  steps,
  currentStepIndex,
}: {
  steps: StepDefinition[];
  currentStepIndex: number;
}) {
  return (
    <div className="relative w-full px-2 mb-6">
      <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto max-w-3xl">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-fuchsia-500"
          initial={{ width: 0 }}
          animate={{ width: `${(Math.min(currentStepIndex + 1, steps.length) / steps.length) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2 max-w-4xl mx-auto">
        {steps.map((s, i) => {
          const isCompleted = i < currentStepIndex;
          const isCurrent = i === currentStepIndex;
          const Icon = isCompleted ? CheckCircle : s.icon;
          return (
            <motion.div key={i} className="flex flex-col items-center text-center">
              <div
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow ${
                  isCompleted ? "bg-emerald-500 text-white" : isCurrent ? `bg-gradient-to-br ${s.color} text-white` : "bg-gray-200 text-gray-600"
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="mt-1.5 text-[10px] md:text-[11px] font-medium text-gray-700">{s.text}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}



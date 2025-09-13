 import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch,
  Brain,
  PenTool,
  Sparkles,
  Zap,
  Layers
} from "lucide-react";
import { OptimizedResume } from "@/types/analysis";

type Step = {
  text: string;
  duration: number;
  icon: React.ElementType;
  color: string;
};

const BUILD_STEPS: Step[] = [
  { text: "Analyzing", duration: 4000, icon: FileSearch, color: "#6366f1" },
  { text: "Optimizing", duration: 5000, icon: Brain, color: "#8b5cf6" },
  { text: "Enhancing", duration: 6000, icon: PenTool, color: "#ec4899" },
  { text: "Finalizing", duration: 5000, icon: Sparkles, color: "#f43f5e" }
];

export interface BuildingResumeViewProps {
  onBack?: () => void;
}

const ModernResumeBuilder: React.FC<BuildingResumeViewProps> = ({ onBack }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [wordCount, setWordCount] = useState<number | undefined>(undefined);
  const startTimeRef = useRef<number>(Date.now());

  const totalDuration = BUILD_STEPS.reduce((sum, step) => sum + step.duration, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;

      let cumulativeTime = 0;
      let newCurrentStep = 0;

      for (let i = 0; i < BUILD_STEPS.length; i++) {
        cumulativeTime += BUILD_STEPS[i].duration;
        if (elapsed < cumulativeTime) {
          newCurrentStep = i;
          break;
        }
        if (i === BUILD_STEPS.length - 1) {
          newCurrentStep = i;
        }
      }

      setCurrentStep(newCurrentStep);
      setProgress(Math.min((elapsed / totalDuration) * 100, 100));
    }, 50);

    return () => clearInterval(timer);
  }, [totalDuration]);

  const currentStepData = BUILD_STEPS[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 10 + 4}px`,
              height: `${Math.random() * 10 + 4}px`,
              background: `linear-gradient(45deg, ${currentStepData?.color}, ${BUILD_STEPS[(currentStep + 1) % BUILD_STEPS.length]?.color || currentStepData?.color})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.6,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [1, Math.random() * 0.5 + 0.8, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Main card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8">
            {/* Progress ring */}
            <div className="relative flex justify-center items-center mb-8">
              <svg width="200" height="200" className="transform -rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="#f1f5f9"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke={currentStepData?.color}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
                  initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - progress / 100) }}
                  transition={{ duration: 0.3 }}
                />
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  key={currentStep}
                  className="mb-2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {currentStepData && React.createElement(currentStepData.icon, {
                    className: "w-10 h-10",
                    style: { color: currentStepData.color }
                  })}
                </motion.div>
                
                <motion.div 
                  className="text-3xl font-bold tabular-nums"
                  key={Math.round(progress)}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {Math.round(progress)}<span className="text-lg">%</span>
                </motion.div>
              </div>
            </div>

            {/* Status text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                className="text-center mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentStepData?.text}
                </h1>
                <p className="text-gray-500">Your AI-powered resume</p>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
              <motion.div 
                className="h-full rounded-full"
                style={{ backgroundColor: currentStepData?.color }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between">
              {BUILD_STEPS.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index <= currentStep
                      ? 'bg-indigo-100'
                      : 'bg-gray-100'
                  }`}>
                    {React.createElement(step.icon, {
                      className: `w-4 h-4 ${
                        index <= currentStep
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      }`,
                      style: { color: 'inherit' }
                    })}
                  </div>
                  <div className={`text-xs font-medium ${
                    index <= currentStep 
                      ? 'text-indigo-600' 
                      : 'text-gray-400'
                  }`}>
                    {step.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>



        {/* Floating accent shapes */}
        <motion.div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
          style={{ backgroundColor: currentStepData?.color }}
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full opacity-20"
          style={{ backgroundColor: BUILD_STEPS[(currentStep + 1) % BUILD_STEPS.length]?.color }}
          animate={{
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
};

export default ModernResumeBuilder;

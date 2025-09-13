import { useEffect, useMemo, useState } from "react";
import type { StepDefinition } from "./steps";

export function useProgress(steps: StepDefinition[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const totalDurationMs = useMemo(
    () => steps.reduce((sum, step) => sum + step.duration, 0),
    [steps]
  );

  const etaSeconds = useMemo(
    () => Math.max(0, Math.round(((100 - progress) / 100) * (totalDurationMs / 1000))),
    [progress, totalDurationMs]
  );

  useEffect(() => {
    let stepTimeout: ReturnType<typeof setTimeout> | null = null;
    let progressInterval: ReturnType<typeof setInterval> | null = null;

    if (currentStepIndex < steps.length) {
      const currentStep = steps[currentStepIndex];

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const targetProgress = ((currentStepIndex + 1) / steps.length) * 100;
          const increment = 100 / (steps.length * (currentStep.duration / 100));
          const newValue = prev + increment;
          if (newValue >= targetProgress) {
            if (progressInterval) clearInterval(progressInterval);
            return targetProgress;
          }
          return newValue;
        });
      }, 50);

      stepTimeout = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, currentStep.duration);
    } else if (currentStepIndex === steps.length && !isComplete) {
      setProgress(100);
      setTimeout(() => setIsComplete(true), 500);
    }

    return () => {
      if (stepTimeout) clearTimeout(stepTimeout);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [currentStepIndex, isComplete, steps]);

  return {
    currentStepIndex,
    setCurrentStepIndex,
    progress,
    isComplete,
    totalDurationMs,
    etaSeconds,
  } as const;
}








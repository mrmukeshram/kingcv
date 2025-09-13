import { useState, useCallback } from 'react';
import { buildDynamicSinglePageResume, analyzeResumeComprehensively, validateSinglePageCompliance } from '../services/dynamic-resume.service';
import { OptimizedResume, ResumeAnalysis } from '../types/analysis';

export interface UseResumeBuilderResult {
  isBuilding: boolean;
  buildResume: (originalText: string, jobDescription: string) => Promise<OptimizedResume>;
  error: string | null;
  analysis: ResumeAnalysis | null;
  validation: any | null;
  resetState: () => void;
}

export const useResumeBuilder = (): UseResumeBuilderResult => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [validation, setValidation] = useState<any | null>(null);

  const buildResume = useCallback(async (originalText: string, jobDescription: string): Promise<OptimizedResume> => {
    try {
      setIsBuilding(true);
      setError(null);
      setAnalysis(null);
      setValidation(null);

      // Analyze original resume
      const resumeAnalysis = analyzeResumeComprehensively(originalText);
      setAnalysis(resumeAnalysis);

      console.log(`🎯 Building ${resumeAnalysis.type} resume...`);

      // Build optimized resume
      const optimizedResume = await buildDynamicSinglePageResume(originalText, jobDescription);

      // Validate result
      const resumeValidation = validateSinglePageCompliance(optimizedResume);
      setValidation(resumeValidation);

      if (resumeValidation.isCompliant) {
        console.log('✅ Perfect single-page resume created!');
      } else {
        console.log('⚠️ Minor adjustments may be needed:', resumeValidation.issues);
      }

      return optimizedResume;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to build resume';
      setError(errorMessage);
      throw err;
    } finally {
      setIsBuilding(false);
    }
  }, []);

  const resetState = useCallback(() => {
    setError(null);
    setAnalysis(null);
    setValidation(null);
  }, []);

  return {
    isBuilding,
    buildResume,
    error,
    analysis,
    validation,
    resetState
  };
};

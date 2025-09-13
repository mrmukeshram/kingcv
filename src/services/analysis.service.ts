// src/services/analysis.service.ts
import { callGemini } from "./gemini-client";
import { createAnalysisPrompt } from "@/lib/gemini-prompts";
import { AnalysisResult } from "@/types/analysis";

// Simple hash function for caching
const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const CACHE_KEY_PREFIX = 'resume-analysis-cache-';

/**
 * Analyzes the user's resume against the job description.
 * @param originalResumeText The user's original resume text.
 * @param jobDescriptionText The target job description text.
 * @returns A promise that resolves to the analysis results.
 */
export const analyzeResume = async (
  originalResumeText: string,
  jobDescriptionText: string
): Promise<AnalysisResult> => {
  try {
    const inputKey = `${originalResumeText}|${jobDescriptionText}`;
    const cacheKey = CACHE_KEY_PREFIX + await hashString(inputKey);

    // Check if result is cached
    const cachedResult = localStorage.getItem(cacheKey);
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    const prompt = createAnalysisPrompt(originalResumeText, jobDescriptionText);
    const analysisResult = await callGemini<AnalysisResult>(prompt);

    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify(analysisResult));

    return analysisResult;
  } catch (error) {
    console.error("Error in analyzeResume:", error);
    throw error;
  }
};

import React, { useState } from 'react';
import HeaderLogo from '@/components/HeaderLogo';
import Footer from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import InputSection from '@/components/InputSection';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import OptimizedResumeDisplay from '@/components/OptimizedResumeDisplay';
import NewBuildingResumeView from '@/components/NewBuildingResumeView';
import BackButton from '@/components/BackButton';
import { AnalysisResult, OptimizedResume } from '@/types/analysis';
import { analyzeResume } from '@/services/analysis.service';
import { buildStandardResume } from '@/services/standard-resume.service';
import { buildFullyOptimizedResume } from '@/services/fully-optimized-resume.service';
import { toast } from 'sonner';
import { ArrowLeft, Home, BarChart3, Sparkles, Zap, Target } from 'lucide-react';
import ModernButton from '@/components/ui/ModernButton';

type AppState = 'input' | 'analyzing' | 'results' | 'building-resume' | 'optimized';
type OptimizationLevel = 'STANDARD' | 'MAXIMUM';

const MainApp = () => {
  const [currentState, setCurrentState] = useState<AppState>('input');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [optimizationLevel, setOptimizationLevel] = useState<OptimizationLevel>('STANDARD');
  
  const [originalResumeText, setOriginalResumeText] = useState<string>('');
  const [jobDescriptionText, setJobDescriptionText] = useState<string>('');

  const handleAnalyze = async (resumeText: string, jobDescText: string) => {
    // STEP 1: Confirm resume and job description being sent
    console.log('STEP 1: Analyzing resume text:', resumeText);
    console.log('STEP 1: Analyzing job description:', jobDescText);
    if (!resumeText.trim() || !jobDescText.trim()) {
      toast.error('Please provide both resume and job description');
      return;
    }

    setOriginalResumeText(resumeText);
    setJobDescriptionText(jobDescText);

    setIsLoading(true);
    setCurrentState('analyzing');
    try {
      console.log('STEP 2: Starting resume analysis with Gemini AI...');
      const results = await analyzeResume(resumeText, jobDescText);
      // STEP 3: Log the raw analysis results
      console.log('STEP 3: Analysis completed. Raw results:', results);
      if (results && results.matchScore) {
        console.log('STEP 4: ATS Score:', results.matchScore.total);
        console.log('STEP 4: Score breakdown:', results.matchScore);
      }
      setAnalysisResults(results);
      setCurrentState('results');
      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('STEP 5: Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
      setCurrentState('input');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToInput = () => {
    setCurrentState('input');
    setAnalysisResults(null);
    setOptimizedResume(null);
    setOriginalResumeText('');
    setJobDescriptionText('');
  };

  const handleBackToResults = () => {
    setCurrentState('results');
  };

  const handleBuildResume = async () => {
    if (!originalResumeText || !jobDescriptionText || !analysisResults) {
      toast.error('Original resume, job description, and analysis results are required');
      return;
    }

    setCurrentState('building-resume');

    try {
      let optimizedResumeResult;
      if (optimizationLevel === 'STANDARD') {
        // Add timeout to prevent hanging on standard resume creation
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Resume building timed out')), 60000) // 60 second timeout
        );
        optimizedResumeResult = await Promise.race([
          buildStandardResume(originalResumeText, jobDescriptionText),
          timeoutPromise
        ]);
      } else {
        optimizedResumeResult = await buildFullyOptimizedResume(originalResumeText, jobDescriptionText);
      }
      setOptimizedResume(optimizedResumeResult);

      setCurrentState('optimized');
      toast.success('🎉 Your new high-scoring resume is ready!');
    } catch (error) {
      console.error('Resume building failed:', error);
      toast.error(error instanceof Error && error.message === 'Resume building timed out'
        ? 'Resume building is taking too long. Please try again or use Fully Optimized Resume.'
        : 'Resume building failed. Please try again.');
      setCurrentState('results');
    }
  };

  const getPageTitle = () => {
    switch (currentState) {
      case 'input': return 'Upload & Analyze';
      case 'analyzing': return 'AI Analysis in Progress';
      case 'results': return 'Resume Analysis Results';
      case 'building-resume': return 'Building Perfect Resume';
      case 'optimized': return 'Your Optimized Resume';
      default: return 'Resume Analyzer';
    }
  };

  const getPageIcon = () => {
    switch (currentState) {
      case 'input': return Home;
      case 'analyzing': case 'building-resume': return Sparkles;
      case 'results': return BarChart3;
      case 'optimized': return Target;
      default: return Home;
    }
  };

  const PageIcon = getPageIcon();

  return (
    <div className="min-h-screen relative overflow-hidden hero-mesh">
      <header className="w-full py-3 px-4 sm:py-4 sm:px-6 flex items-center justify-between bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="flex-1">
          <HeaderLogo />
        </div>
        <div className="flex-1 text-center hidden sm:block">
          <span className="font-bold text-sm sm:text-base lg:text-lg text-gray-700">{getPageTitle()}</span>
        </div>
        <div className="flex-1 flex justify-end">
          {(currentState === 'results' || currentState === 'optimized') && (
            <BackButton onClick={handleBackToInput} label="Start Over" variant="soft" size="sm" />
          )}
        </div>
      </header>
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {currentState === 'input' && (
            <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />
          )}
          {currentState === 'analyzing' && (
            <NewBuildingResumeView onBack={handleBackToInput} />
          )}
          {currentState === 'results' && analysisResults && (
            <AnalysisDashboard
              results={analysisResults}
              onBack={handleBackToInput}
              onBuildResume={handleBuildResume}
              optimizationLevel={optimizationLevel}
              setOptimizationLevel={setOptimizationLevel}
            />
          )}
          {currentState === 'building-resume' && (
            <NewBuildingResumeView onBack={handleBackToResults} />
          )}
          {currentState === 'optimized' && optimizedResume && (
            <OptimizedResumeDisplay 
              resume={optimizedResume}
              onBackToResults={handleBackToResults}
            />
          )}
        </div>
      </main>
      {/* Compact Footer */}
      <Footer variant="main" />
    </div>
  );
}

export default MainApp;

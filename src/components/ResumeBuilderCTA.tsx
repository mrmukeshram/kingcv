
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles, ArrowRight, Zap, TrendingUp, Target, Clock, Star } from 'lucide-react';

interface ResumeBuilderCTAProps {
  currentScore: number;
  onBuildResume: () => void;
}

const ResumeBuilderCTA: React.FC<ResumeBuilderCTAProps> = ({ currentScore, onBuildResume }) => {
  const [isHovered, setIsHovered] = useState(false);
  const predictedScore = Math.min(95, currentScore + 22);
  const improvement = predictedScore - currentScore;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl md:rounded-3xl shadow-2xl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-8 -left-8 w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-48 h-48 md:w-80 md:h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="text-center space-y-6 md:space-y-8">
          {/* Header */}
          <div className="space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white" />
              <span className="text-xs md:text-sm font-medium text-white">AI-Powered Optimization</span>
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Want a <span className="text-blue-200">{predictedScore}%</span> Match Score?
            </h2>
            <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto">
              Let our advanced AI create the perfect ATS-optimized resume in just 30 seconds
            </p>
          </div>

          {/* Score Comparison */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/80 mb-2">{currentScore}%</div>
              <div className="text-xs md:text-sm text-white/70">Current Score</div>
              <div className="w-12 md:w-16 h-1 bg-white/30 rounded-full mt-2 mx-auto"></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 animate-pulse">
                <ArrowRight className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <div className="text-xs text-white/70">AI Magic</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-200 mb-2">{predictedScore}%</div>
              <div className="text-xs md:text-sm text-white/70">Predicted Score</div>
              <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full mt-2 mx-auto"></div>
            </div>
          </div>

          {/* Improvement Highlight */}
          <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/10 rounded-xl md:rounded-2xl backdrop-blur-sm border border-white/20">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-300" />
            <span className="text-base md:text-lg font-bold text-white">+{improvement} Point Improvement</span>
          </div>

          {/* CTA Button */}
          <div className="space-y-3 md:space-y-4">
            <Button
              size="lg"
              onClick={onBuildResume}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`
                relative px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold
                bg-white text-indigo-600 hover:bg-gray-50
                shadow-2xl rounded-xl md:rounded-2xl
                transform transition-all duration-300
                ${isHovered ? 'scale-105 shadow-3xl' : ''}
              `}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 animate-spin" />
                <span className="text-base md:text-xl">Build My Perfect Resume</span>
                <Zap className="h-5 w-5 md:h-6 md:w-6" />
              </div>
            </Button>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 md:h-4 md:w-4" />
                <span>30 seconds</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3 md:h-4 md:w-4" />
                <span>ATS Optimized</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 md:h-4 md:w-4" />
                <span>Job-Specific</span>
              </div>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-white">95%</div>
              <div className="text-xs text-white/70">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-white">50K+</div>
              <div className="text-xs text-white/70">Resumes Built</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-white">30s</div>
              <div className="text-xs text-white/70">Build Time</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-white">99%</div>
              <div className="text-xs text-white/70">ATS Compatible</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderCTA;

import React, { useState } from 'react';
import { useResumeBuilder } from '../hooks/useResumeBuilder';
import { OptimizedResume } from '../types/analysis';

interface ResumeBuilderProps {
  onResumeGenerated?: (resume: OptimizedResume) => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ onResumeGenerated }) => {
  const [originalResume, setOriginalResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generatedResume, setGeneratedResume] = useState<OptimizedResume | null>(null);

  const { isBuilding, buildResume, error, analysis, validation, resetState } = useResumeBuilder();

  const handleBuildResume = async () => {
    try {
      resetState();
      const resume = await buildResume(originalResume, jobDescription);
      setGeneratedResume(resume);
      onResumeGenerated?.(resume);
    } catch (err) {
      console.error('Resume building failed:', err);
    }
  };

  const getAnalysisDisplay = () => {
    if (!analysis) return null;

    return (
      <div className="bg-blue-50 p-4 rounded-lg mt-4">
        <h3 className="font-semibold text-blue-800">Resume Analysis</h3>
        <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
          <div>
            <span className="font-medium">Type:</span> {analysis.type.toUpperCase()}
          </div>
          <div>
            <span className="font-medium">Sections:</span> {analysis.sections}
          </div>
          <div>
            <span className="font-medium">Word Count:</span> {analysis.wordCount}
          </div>
          <div>
            <span className="font-medium">Experience:</span> {analysis.experienceLevel} years
          </div>
        </div>
        {validation && (
          <div className="mt-3">
            <div className={`text-sm ${validation.isCompliant ? 'text-green-600' : 'text-amber-600'}`}>
              Page Utilization: {validation.pageUtilization} (Density: {validation.contentDensity})
            </div>
            {validation.recommendations.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-600">Recommendations:</div>
                <ul className="text-xs text-gray-600 list-disc list-inside">
                  {validation.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          🎯 Dynamic Single-Page Resume Builder
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Resume Text
              </label>
              <textarea
                value={originalResume}
                onChange={(e) => setOriginalResume(e.target.value)}
                placeholder="Paste your current resume text here... (any length, any format)"
                className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description you're targeting..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleBuildResume}
              disabled={isBuilding || !originalResume.trim() || !jobDescription.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isBuilding ? '🔄 Creating Perfect Resume...' : '🚀 Build Single-Page Resume'}
            </button>

            <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">🎯 Optimization Target</h4>
              <div className="text-xs text-blue-600">
                <p>• Single-page resume with 85-95% density (aiming for 16-19cm)</p>
                <p>• Minimum 8-12 sections with comprehensive content</p>
                <p>• ATS-optimized keywords and professional formatting</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                <p className="text-red-600 text-sm">❌ {error}</p>
              </div>
            )}

            {getAnalysisDisplay()}
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
            {generatedResume ? (
              <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto text-xs">
                <pre className="whitespace-pre-wrap font-mono">
                  {JSON.stringify(generatedResume, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-100 p-8 rounded-md text-center text-gray-500">
                <p>Your optimized single-page resume will appear here</p>
                <p className="text-xs mt-2">Works with any resume: minimal, moderate, or extensive</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">✨ Dynamic Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-700">📝 Minimal Resumes</h4>
              <p className="text-gray-600">Expands sparse content into full-page masterpiece with relevant sections</p>
            </div>
            <div>
              <h4 className="font-medium text-purple-700">⚖️ Moderate Resumes</h4>
              <p className="text-gray-600">Optimizes and balances existing content for perfect page utilization</p>
            </div>
            <div>
              <h4 className="font-medium text-green-700">✂️ Extensive Resumes</h4>
              <p className="text-gray-600">Intelligently condenses multi-page content into powerful single page</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

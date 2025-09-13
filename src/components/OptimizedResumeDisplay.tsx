import React from 'react';
import ModernCard from './ui/ModernCard';
import ModernButton from './ui/ModernButton';
import { OptimizedResume } from '@/types/analysis';
import { ArrowLeft, User, Briefcase, GraduationCap, Lightbulb, Star, FolderKanban, Sparkles, Download, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { downloadAsDocx, estimateResumeLayout, autoReduceToSinglePage } from '@/lib/resume-exporter';
import MatchScoreCircular from './ui/MatchScoreCircular';

interface OptimizedResumeDisplayProps {
  resume: OptimizedResume;
  onBackToResults: () => void;
}

const SectionCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; className?: string }> = ({ title, icon: Icon, children, className }) => (
    <div className={`mb-6 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm ${className}`}>
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center text-black">
            <Icon className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-black" />
            {title}
        </h3>
        {children}
    </div>
);

const OptimizedResumeDisplay: React.FC<OptimizedResumeDisplayProps> = ({ resume, onBackToResults }) => {
  const [finalResume, setFinalResume] = React.useState<OptimizedResume>(resume);
  const [hasBeenOptimized, setHasBeenOptimized] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'work' | 'projects' | 'education' | 'other'>('work');
  const [isOptimizationCardExpanded, setIsOptimizationCardExpanded] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Granular selection state for individual items
  const [excludedItems, setExcludedItems] = React.useState<{
    workExperienceIds: Set<number>;
    projectIds: Set<number>;
    educationIds: Set<number>;
    certificationIds: Set<number>;
    awardIds: Set<number>;
    languageIds: Set<number>;
    additionalSectionIds: Set<number>;
  }>({
    workExperienceIds: new Set(),
    projectIds: new Set(),
    educationIds: new Set(),
    certificationIds: new Set(),
    awardIds: new Set(),
    languageIds: new Set(),
    additionalSectionIds: new Set(),
  });

  // Helper functions for granular selections
  const toggleExcludedItem = (sectionType: keyof typeof excludedItems, id: number) => {
    setExcludedItems(prev => {
      const newSet = new Set(prev[sectionType]);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { ...prev, [sectionType]: newSet };
    });
  };

  const isExcluded = (sectionType: keyof typeof excludedItems, id: number): boolean => {
    return excludedItems[sectionType].has(id);
  };

  // Create filtered resume based on excluded items
  React.useEffect(() => {
    const filtered = JSON.parse(JSON.stringify(resume)) as OptimizedResume;
    if (filtered.workExperience) {
      filtered.workExperience = filtered.workExperience.filter((_, i) => !excludedItems.workExperienceIds.has(i));
    }
    if (filtered.projects) {
      filtered.projects = filtered.projects.filter((_, i) => !excludedItems.projectIds.has(i));
    }
    if (filtered.education) {
      filtered.education = filtered.education.filter((_, i) => !excludedItems.educationIds.has(i));
    }
    if (filtered.certifications) {
      filtered.certifications = filtered.certifications.filter((_, i) => !excludedItems.certificationIds.has(i));
    }
    if (filtered.awardsAndHonors) {
      filtered.awardsAndHonors = filtered.awardsAndHonors.filter((_, i) => !excludedItems.awardIds.has(i));
    }
    if (filtered.languages) {
      filtered.languages = filtered.languages.filter((_, i) => !excludedItems.languageIds.has(i));
    }
    if (filtered.additionalSections) {
      filtered.additionalSections = filtered.additionalSections.filter((_, i) => !excludedItems.additionalSectionIds.has(i));
    }
    setFinalResume(filtered);
    setHasBeenOptimized(
      excludedItems.workExperienceIds.size > 0 ||
      excludedItems.projectIds.size > 0 ||
      excludedItems.educationIds.size > 0 ||
      excludedItems.certificationIds.size > 0 ||
      excludedItems.awardIds.size > 0 ||
      excludedItems.languageIds.size > 0 ||
      excludedItems.additionalSectionIds.size > 0
    );
  }, [resume, excludedItems]);

  const handleDownloadDocx = () => {
    downloadAsDocx(finalResume, `${finalResume.header.name.replace(/\s+/g, '_')}_Resume`);
  };

  const formatContact = (contact: any) => {
    if (typeof contact === 'string') return contact;
    if (typeof contact === 'object' && contact !== null) {
      return Object.values(contact).filter(Boolean).join(' | ');
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MOBILE-ONLY: Perfect Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 sm:hidden">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBackToResults}
              className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors touch-target"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Back</span>
            </button>

            <button
              onClick={handleDownloadDocx}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg touch-target"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm">Download</span>
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Resume Optimizer</h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP HEADER - COMPLETELY UNCHANGED */}
      <div className="hidden md:flex md:flex-row justify-between items-center mb-6 md:mb-8 gap-3 md:gap-4 px-4">
        <div className="order-2 md:order-1">
          <ModernButton
            variant="secondary"
            onClick={onBackToResults}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="sm:inline">Back to Results</span>
          </ModernButton>
        </div>

        <div className="text-center order-1 md:order-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gradient-primary mb-1 md:mb-2 leading-tight">
            Perfect Your Resume with AI Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Optimized for ATS and human reviewers
          </p>
        </div>

        <div className="order-3">
          <ModernButton
            variant="primary"
            onClick={handleDownloadDocx}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="sm:inline">Download Word</span>
          </ModernButton>
        </div>
      </div>

      <div className="px-4 pb-8">
        {/* MOBILE-ONLY: Single Page Optimization Card */}
        {(() => {
          const layout = estimateResumeLayout(resume);
          return layout.estimatedPageCount > 1 ? (
            <div className="mb-6 sm:hidden">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-5 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-orange-900">Single Page Fix</h3>
                      <p className="text-sm text-orange-700">{Math.round(layout.estimatedPageCount)} pages detected</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOptimizationCardExpanded(!isOptimizationCardExpanded)}
                    className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors touch-target flex items-center justify-between"
                  >
                    <span>Customize Sections</span>
                    <ArrowLeft className={`h-5 w-5 transform transition-transform duration-300 ${
                      isOptimizationCardExpanded ? 'rotate-[-90deg]' : 'rotate-90'
                    }`} />
                  </button>
                </div>

                {/* Expandable Content */}
                <div className={`transition-all duration-500 ease-in-out ${
                  isOptimizationCardExpanded ? 'max-h-screen opacity-100 p-5 border-t border-orange-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}>
                  {/* Beautiful Section Buttons */}
                  <div className="space-y-4">
                    {/* Work Experience Button */}
                    <button
                      onClick={() => setActiveTab('work')}
                      className={`w-full flex items-center justify-between p-4 touch-target rounded-xl border transition-all ${
                        activeTab === 'work' ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Work Experience</span>
                        {excludedItems.workExperienceIds.size > 0 && (
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                            {excludedItems.workExperienceIds.size} removed
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm">{resume.workExperience?.length || 0} items</span>
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveTab('projects')}
                        className={`p-3 rounded-xl border touch-target flex flex-col items-center gap-2 transition-all ${
                          activeTab === 'projects' ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <FolderKanban className="h-6 w-6 text-gray-600" />
                        <span className="text-xs font-medium text-gray-900">Projects</span>
                        {excludedItems.projectIds.size > 0 && (
                          <div className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{excludedItems.projectIds.size}</div>
                        )}
                      </button>

                      <button
                        onClick={() => setActiveTab('education')}
                        className={`p-3 rounded-xl border touch-target flex flex-col items-center gap-2 transition-all ${
                          activeTab === 'education' ? 'bg-green-50 border-green-300' : 'bg-white border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <GraduationCap className="h-6 w-6 text-gray-600" />
                        <span className="text-xs font-medium text-gray-900">Education</span>
                        {excludedItems.educationIds.size > 0 && (
                          <div className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{excludedItems.educationIds.size}</div>
                        )}
                      </button>

                      <button
                        onClick={() => setActiveTab('other')}
                        className={`p-3 rounded-xl border touch-target flex flex-col items-center gap-2 transition-all ${
                          activeTab === 'other' ? 'bg-purple-50 border-purple-300' : 'bg-white border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <Sparkles className="h-6 w-6 text-gray-600" />
                        <span className="text-xs font-medium text-gray-900">Other</span>
                        {(() => {
                          const totalOther = (resume.certifications?.length || 0) +
                                           (resume.awardsAndHonors?.length || 0) +
                                           (resume.languages?.length || 0) +
                                           (resume.additionalSections?.length || 0);
                          const excludedOther = excludedItems.certificationIds.size +
                                              excludedItems.awardIds.size +
                                              excludedItems.languageIds.size +
                                              excludedItems.additionalSectionIds.size;
                          return excludedOther > 0 ? (
                            <div className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{excludedOther}</div>
                          ) : null;
                        })()}
                      </button>
                    </div>
                  </div>

                  {/* Selection Summary */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      Content to exclude: {
                        excludedItems.workExperienceIds.size +
                        excludedItems.projectIds.size +
                        excludedItems.educationIds.size +
                        excludedItems.certificationIds.size +
                        excludedItems.awardIds.size +
                        excludedItems.languageIds.size +
                        excludedItems.additionalSectionIds.size
                      } items
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* MOBILE-ONLY: Tab Content */}
        {(() => {
          const layout = estimateResumeLayout(resume);
          return layout.estimatedPageCount > 1 && isOptimizationCardExpanded ? (
            <div className="mb-6 sm:hidden">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900 mb-2">Select items to exclude</h3>
                    <p className="text-sm text-gray-600">Tap items to remove them from your resume</p>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4">
                  {/* Work Experience Tab */}
                  {activeTab === 'work' && resume.workExperience && resume.workExperience.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <Briefcase className="mr-2 h-5 w-5" />
                        Work Experience ({resume.workExperience.length} items)
                      </h4>
                      {resume.workExperience.map((exp, i) => (
                        <div
                          key={i}
                          onClick={() => toggleExcludedItem('workExperienceIds', i)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all touch-target ${
                            isExcluded('workExperienceIds', i)
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">{exp.title}</div>
                              <div className="text-sm text-gray-600 truncate">{exp.company} • {exp.duration}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {exp.achievements?.length || 0} achievements
                              </div>
                            </div>
                            <div className="ml-3">
                              <input
                                type="checkbox"
                                checked={isExcluded('workExperienceIds', i)}
                                readOnly
                                className="pointer-events-none h-4 w-4"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Projects Tab */}
                  {activeTab === 'projects' && resume.projects && resume.projects.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <FolderKanban className="mr-2 h-5 w-5" />
                        Projects ({resume.projects.length} items)
                      </h4>
                      {resume.projects.map((proj, i) => (
                        <div
                          key={i}
                          onClick={() => toggleExcludedItem('projectIds', i)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all touch-target ${
                            isExcluded('projectIds', i)
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">{proj.title}</div>
                              <div className="text-sm text-gray-600 truncate">
                                {(proj.technologies || []).length} technologies
                              </div>
                            </div>
                            <div className="ml-3">
                              <input
                                type="checkbox"
                                checked={isExcluded('projectIds', i)}
                                readOnly
                                className="pointer-events-none h-4 w-4"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education Tab */}
                  {activeTab === 'education' && resume.education && resume.education.length > 1 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <GraduationCap className="mr-2 h-5 w-5" />
                        Education ({resume.education.length} items)
                      </h4>
                      {resume.education.map((edu, i) => (
                        <div
                          key={i}
                          onClick={() => toggleExcludedItem('educationIds', i)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all touch-target ${
                            isExcluded('educationIds', i)
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">{edu.degree}</div>
                              <div className="text-sm text-gray-600 truncate">{edu.institution}</div>
                              <div className="text-xs text-gray-500">{edu.year}</div>
                            </div>
                            <div className="ml-3">
                              <input
                                type="checkbox"
                                checked={isExcluded('educationIds', i)}
                                readOnly
                                className="pointer-events-none h-4 w-4"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Other Tab */}
                  {activeTab === 'other' && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Other Sections
                      </h4>

                      {/* Certifications */}
                      {resume.certifications && resume.certifications.map((cert, i) => (
                        <div
                          key={`cert-${i}`}
                          onClick={() => toggleExcludedItem('certificationIds', i)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all touch-target ${
                            isExcluded('certificationIds', i)
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm truncate">{cert.name}</div>
                              <div className="text-xs text-gray-600 truncate">{cert.issuingOrganization} • {cert.year}</div>
                            </div>
                            <div className="ml-3">
                              <input type="checkbox" checked={isExcluded('certificationIds', i)} readOnly className="pointer-events-none h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Awards */}
                      {resume.awardsAndHonors && resume.awardsAndHonors.map((award, i) => (
                        <div
                          key={`award-${i}`}
                          onClick={() => toggleExcludedItem('awardIds', i)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all touch-target ${
                            isExcluded('awardIds', i)
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm truncate">{award.name}</div>
                              <div className="text-xs text-gray-600 truncate">{award.organization} • {award.year}</div>
                            </div>
                            <div className="ml-3">
                              <input type="checkbox" checked={isExcluded('awardIds', i)} readOnly className="pointer-events-none h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Languages */}
                      {resume.languages && resume.languages.map((lang, i) => (
                        <div
                          key={`lang-${i}`}
                          onClick={() => toggleExcludedItem('languageIds', i)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all touch-target ${
                            isExcluded('languageIds', i)
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm truncate">{lang.language}</div>
                              <div className="text-xs text-gray-600 capitalize">{lang.proficiency}</div>
                            </div>
                            <div className="ml-3">
                              <input type="checkbox" checked={isExcluded('languageIds', i)} readOnly className="pointer-events-none h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Additional Sections */}
                      {resume.additionalSections && resume.additionalSections.map((section, i) => (
                        <div
                          key={`section-${i}`}
                          onClick={() => toggleExcludedItem('additionalSectionIds', i)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all touch-target ${
                            isExcluded('additionalSectionIds', i)
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm truncate">{section.title}</div>
                              <div className="text-xs text-gray-600 truncate">Additional content section</div>
                            </div>
                            <div className="ml-3">
                              <input type="checkbox" checked={isExcluded('additionalSectionIds', i)} readOnly className="pointer-events-none h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* DESKTOP VERSION - COMPLETELY PRESERVED */}
        <div className="hidden sm:block">
          {/* DESKTOP: Original optimization UI */}
          {(() => {
            const layout = estimateResumeLayout(resume);
            return layout.estimatedPageCount > 1 ? (
              <ModernCard variant="floating" className="p-4 sm:p-6 mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                <div
                  className="flex items-center justify-between mb-4 cursor-pointer transition-all duration-300 hover:bg-orange-100 rounded-lg p-3 min-h-[48px]"
                  onClick={() => setIsOptimizationCardExpanded(!isOptimizationCardExpanded)}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <AlertTriangle className="mr-3 h-6 w-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <h2 className="text-xl font-bold text-orange-900">Optimize for Single Page</h2>
                      <div className="text-sm text-orange-700 whitespace-nowrap">
                        {Math.round(layout.estimatedPageCount)} pages detected
                      </div>
                    </div>
                  </div>
                  <ArrowLeft className={`h-5 w-5 text-orange-600 transform transition-transform duration-300 flex-shrink-0 ${
                    isOptimizationCardExpanded ? 'rotate-[-90deg]' : 'rotate-90'
                  }`} />
                </div>

                <div className={`bg-white rounded-lg overflow-hidden transition-all duration-500 ease-in-out ${
                  isOptimizationCardExpanded ? 'max-h-screen opacity-100 p-4' : 'max-h-0 opacity-0 p-0'
                }`}>
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm">Select content to exclude (toggles immediately):</h4>
                  <div className="flex gap-4 mb-4 border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('work')}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === 'work' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Work Experience {resume.workExperience?.length > 0 && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
                          {excludedItems.workExperienceIds.size}/{resume.workExperience.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === 'projects' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Projects {resume.projects?.length > 0 && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
                          {excludedItems.projectIds.size}/{resume.projects.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('education')}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === 'education' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Education {resume.education?.length > 0 && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
                          {excludedItems.educationIds.size}/{resume.education.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('other')}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === 'other' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Other {(() => {
                        const totalOther = (resume.certifications?.length || 0) +
                                         (resume.awardsAndHonors?.length || 0) +
                                         (resume.languages?.length || 0) +
                                         (resume.additionalSections?.length || 0);
                        const excludedOther = excludedItems.certificationIds.size +
                                            excludedItems.awardIds.size +
                                            excludedItems.languageIds.size +
                                            excludedItems.additionalSectionIds.size;
                        return totalOther > 0 ? (
                          <span className="ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
                            {excludedOther}/{totalOther}
                          </span>
                        ) : null;
                      })()}
                    </button>
                  </div>

                  {/* Desktop Tab Content */}
                  <div className="max-h-96 overflow-y-auto">
                    {/* Work Experience Tab */}
                    {activeTab === 'work' && resume.workExperience && resume.workExperience.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Work Experience ({resume.workExperience.length} items)
                        </h5>
                        {resume.workExperience.map((exp, i) => (
                          <div
                            key={i}
                            className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-200 ${
                              isExcluded('workExperienceIds', i) ? 'bg-red-50 border-red-200 text-red-800 shadow-sm' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-blue-300'
                            }`}
                            onClick={() => toggleExcludedItem('workExperienceIds', i)}
                          >
                            <input type="checkbox" checked={isExcluded('workExperienceIds', i)} onChange={() => {}} className="mr-3 h-4 w-4 pointer-events-none" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{exp.title}</div>
                              <div className="text-xs text-gray-600">{exp.company} • {exp.duration}</div>
                              <div className="text-xs text-gray-500 mt-1">{exp.achievements?.length || 0} achievements</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && resume.projects && resume.projects.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                          <FolderKanban className="mr-2 h-4 w-4" />
                          Projects ({resume.projects.length} items)
                        </h5>
                        {resume.projects.map((proj, i) => (
                          <div
                            key={i}
                            className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-200 ${
                              isExcluded('projectIds', i) ? 'bg-red-50 border-red-200 text-red-800 shadow-sm' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-blue-300'
                            }`}
                            onClick={() => toggleExcludedItem('projectIds', i)}
                          >
                            <input type="checkbox" checked={isExcluded('projectIds', i)} onChange={() => {}} className="mr-3 h-4 w-4 pointer-events-none" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{proj.title}</div>
                              <div className="text-xs text-gray-600">{(proj.technologies || []).length} technologies</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education Tab */}
                    {activeTab === 'education' && resume.education && resume.education.length > 1 && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          Education ({resume.education.length} items)
                        </h5>
                        {resume.education.map((edu, i) => (
                          <div
                            key={i}
                            className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-200 ${
                              isExcluded('educationIds', i) ? 'bg-red-50 border-red-200 text-red-800 shadow-sm' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-blue-300'
                            }`}
                            onClick={() => toggleExcludedItem('educationIds', i)}
                          >
                            <input type="checkbox" checked={isExcluded('educationIds', i)} onChange={() => {}} className="mr-3 h-4 w-4 pointer-events-none" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{edu.degree}</div>
                              <div className="text-xs text-gray-600">{edu.institution} • {edu.year}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Other Tab */}
                    {activeTab === 'other' && (
                      <div className="space-y-6">
                        {/* Certifications */}
                        {resume.certifications && resume.certifications.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                              <Sparkles className="mr-2 h-4 w-4" />
                              Certifications ({resume.certifications.length} items)
                            </h5>
                            <div className="space-y-2">
                              {resume.certifications.map((cert, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center p-2 border rounded-md cursor-pointer transition-all duration-200 ${
                                    isExcluded('certificationIds', i) ? 'bg-red-50 border-red-200 text-red-800' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-blue-300'
                                  }`}
                                  onClick={() => toggleExcludedItem('certificationIds', i)}
                                >
                                  <input type="checkbox" checked={isExcluded('certificationIds', i)} onChange={() => {}} className="mr-3 h-4 w-4 pointer-events-none" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{cert.name}</div>
                                    <div className="text-xs text-gray-600">{cert.issuingOrganization} • {cert.year}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Awards */}
                        {resume.awardsAndHonors && resume.awardsAndHonors.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                              <Star className="mr-2 h-4 w-4" />
                              Awards & Honors ({resume.awardsAndHonors.length} items)
                            </h5>
                            <div className="space-y-2">
                              {resume.awardsAndHonors.map((award, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center p-2 border rounded-md cursor-pointer transition-all duration-200 ${
                                    isExcluded('awardIds', i) ? 'bg-red-50 border-red-200 text-red-800' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-blue-300'
                                  }`}
                                  onClick={() => toggleExcludedItem('awardIds', i)}
                                >
                                  <input type="checkbox" checked={isExcluded('awardIds', i)} onChange={() => {}} className="mr-3 h-4 w-4 pointer-events-none" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{award.name}</div>
                                    <div className="text-xs text-gray-600">{award.organization} • {award.year}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Languages */}
                        {resume.languages && resume.languages.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                              <Sparkles className="mr-2 h-4 w-4" />
                              Languages ({resume.languages.length} items)
                            </h5>
                            <div className="space-y-2">
                              {resume.languages.map((lang, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center p-2 border rounded-md cursor-pointer transition-all duration-200 ${
                                    isExcluded('languageIds', i) ? 'bg-red-50 border-red-200 text-red-800' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-blue-300'
                                  }`}
                                  onClick={() => toggleExcludedItem('languageIds', i)}
                                >
                                  <input type="checkbox" checked={isExcluded('languageIds', i)} onChange={() => {}} className="mr-3 h-4 w-4 pointer-events-none" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{lang.language}</div>
                                    <div className="text-xs text-gray-600">{lang.proficiency}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Additional Sections */}
                        {resume.additionalSections && resume.additionalSections.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                              <Lightbulb className="mr-2 h-4 w-4" />
                              Additional Sections ({resume.additionalSections.length} items)
                            </h5>
                            <div className="space-y-2">
                              {resume.additionalSections.map((section: any, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center p-2 border rounded-md cursor-pointer transition-all duration-200 ${
                                    isExcluded('additionalSectionIds', i) ? 'bg-red-50 border-red-200 text-red-800' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-blue-300'
                                  }`}
                                  onClick={() => toggleExcludedItem('additionalSectionIds', i)}
                                >
                                  <input type="checkbox" checked={isExcluded('additionalSectionIds', i)} onChange={() => {}} className="mr-3 h-4 w-4 pointer-events-none" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{section.title}</div>
                                    <div className="text-xs text-gray-600">Contains additional information</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </ModernCard>
            ) : null;
          })()}
        </div>

        {/* MOBILE-ONLY: Clean & Modern Mobile Page Layout Analysis */}
        <div className="sm:hidden">
          {(() => {
            const originalLayout = estimateResumeLayout(resume);
            const finalLayout = estimateResumeLayout(finalResume);
            return (
              <div className="mb-6">
                {/* Compact Status Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-600" />
                      <h3 className="text-base font-semibold text-gray-900">Page Analysis</h3>
                    </div>
                    {hasBeenOptimized ? (
                      <div className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg font-medium">Optimized</div>
                    ) : finalLayout.willOverflow ? (
                      <div className="text-xs text-red-600 font-medium">Will Overflow</div>
                    ) : (
                      <div className="text-xs text-green-600 font-medium">Single Page</div>
                    )}
                  </div>

                  {hasBeenOptimized && (
                    <div className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="font-medium">{originalLayout.estimatedPageCount} → {finalLayout.estimatedPageCount} page</span>
                    </div>
                  )}
                </div>

                {/* Modern Metric Cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">{finalLayout.estimatedPageCount}</div>
                    <div className="text-xs text-gray-600 font-medium">Pages</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                    <div className="text-xl font-bold text-green-600">{Math.round(finalLayout.spaceUsedPercentage)}%</div>
                    <div className="text-xs text-gray-600 font-medium">Used</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
                    <div className="text-xl font-bold text-purple-600">{Math.round(finalLayout.contentHeight / 1440 * 2.54)}</div>
                    <div className="text-xs text-gray-600 font-medium">cm</div>
                  </div>
                </div>

                {/* Suggestions with Swipe Carousel */}
                {finalLayout.suggestions.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center">
                        <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />
                        <h4 className="text-sm font-semibold text-gray-900">Suggestions</h4>
                        <div className="ml-auto text-xs text-gray-500">
                          Swipe to see all →
                        </div>
                      </div>
                    </div>
                    {/* Horizontal Swipe Container */}
                    <div className="overflow-x-auto overflow-y-hidden scrollbar-hide touch-pan-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      <div className="flex gap-4 px-4 py-4 min-w-max">
                        {finalLayout.suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-72 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 shadow-sm"
                            style={{ minHeight: '120px' }}
                          >
                            <div className="flex items-center mb-3">
                              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                                {index + 1}
                              </div>
                              <div className="text-xs text-indigo-700 font-medium uppercase tracking-wide">
                                Suggestion
                              </div>
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {suggestion}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* DESKTOP ONLY: Original Page Layout Analysis */}
        <div className="hidden sm:block">
          {(() => {
            const originalLayout = estimateResumeLayout(resume);
            const finalLayout = estimateResumeLayout(finalResume);
            return (
              <ModernCard variant="floating" className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="mr-3 h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-blue-900">Page Layout Analysis</h2>
                  </div>
                  {hasBeenOptimized ? (
                    <div className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">User-Optimized ✅</div>
                  ) : finalLayout.willOverflow ? (
                    <div className="flex items-center text-red-600">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      <span className="text-sm font-medium">Will Overflow</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span className="text-sm font-medium">Single Page Fit</span>
                    </div>
                  )}
                </div>

                {hasBeenOptimized && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      Before: <span className="font-medium text-red-600">{originalLayout.estimatedPageCount} pages</span>
                      → After: <span className="font-medium text-green-600">{finalLayout.estimatedPageCount} page</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{finalLayout.estimatedPageCount}</div>
                    <div className="text-sm text-gray-600">Estimated Pages</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(finalLayout.spaceUsedPercentage)}%</div>
                    <div className="text-sm text-gray-600">Space Used</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(finalLayout.contentHeight / 1440 * 2.54)}cm</div>
                    <div className="text-sm text-gray-600">Estimated Length</div>
                  </div>
                </div>

                {finalLayout.suggestions.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Optimization Suggestions:</h4>
                    <ul className="space-y-1">
                      {finalLayout.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-700">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </ModernCard>
            );
          })()}
        </div>

        {/* Resume Content - Both Mobile & Desktop */}
        <ModernCard variant="floating" className="p-6 sm:p-8">
          {finalResume.header && (
            <div className="text-center mb-8 sm:mb-6">
              <h2 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black leading-tight">
                {finalResume.header.name}
              </h2>
              <p className="text-xl sm:text-lg md:text-xl text-gray-700 font-medium mt-1">
                {finalResume.header.title}
              </p>
              <p className="text-sm sm:text-xs md:text-sm text-gray-600 mt-2 leading-relaxed">
                {formatContact(finalResume.header.contact)}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {finalResume.professionalSummary && (
                <SectionCard title="Professional Summary" icon={Lightbulb}>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {finalResume.professionalSummary}
                  </p>
                </SectionCard>
              )}

              {finalResume.workExperience && finalResume.workExperience.length > 0 && (
                <SectionCard title="Work Experience" icon={Briefcase}>
                  <div className="space-y-6">
                    {finalResume.workExperience.map((exp, i) => (
                      <div key={i} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <h4 className="font-bold text-base sm:text-lg text-black">{exp.title}</h4>
                        <p className="text-gray-700 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600 mb-3">{exp.duration}</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 leading-relaxed">
                          {(exp.achievements || []).map((ach, j) => (
                            <li key={j}>{ach.replace(/^•\s*/, '')}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {finalResume.projects && finalResume.projects.length > 0 && (
                <SectionCard title="Projects" icon={FolderKanban}>
                  <div className="space-y-6">
                    {finalResume.projects.map((proj, i) => (
                      <div key={i} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <h4 className="font-bold text-base sm:text-lg text-black">{proj.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 font-medium">
                          {(proj.technologies || []).join(', ')}
                        </p>
                        <p className="text-gray-700 mb-3 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {finalResume.additionalSections && finalResume.additionalSections.filter((section: any) => {
                if (!section || !section.title || !section.content) return false;
                if (Array.isArray(section.content)) {
                  return section.content.length > 0 && section.content.some((content: any) => typeof content === 'string' && content.trim().length > 0);
                }
                return typeof section.content === 'string' && section.content.trim().length > 0;
              }).length > 0 && (
                <SectionCard title="Additional Information" icon={Sparkles}>
                  <div className="space-y-6">
                    {finalResume.additionalSections
                      .filter((section: any) => {
                        if (!section || !section.title || !section.content) return false;
                        if (Array.isArray(section.content)) {
                          return section.content.length > 0 && section.content.some((content: any) => typeof content === 'string' && content.trim().length > 0);
                        }
                        return typeof section.content === 'string' && section.content.trim().length > 0;
                      })
                      .map((section: any, i: number) => (
                        <div key={i} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <h4 className="font-bold text-base sm:text-lg text-black">{section.title}</h4>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {Array.isArray(section.content) ? section.content.join('\n') : section.content}
                          </p>
                        </div>
                      ))}
                  </div>
                </SectionCard>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              {finalResume.coreSkills && (
                <SectionCard title="Core Skills" icon={Star}>
                  <div className="space-y-4">
                    {(finalResume.coreSkills.technical || []).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-black mb-2">Technical Skills</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {(finalResume.coreSkills.technical || []).join(', ')}
                        </p>
                      </div>
                    )}
                    {(finalResume.coreSkills.soft || []).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-black mb-2">Soft Skills</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {(finalResume.coreSkills.soft || []).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </SectionCard>
              )}

              {finalResume.education && finalResume.education.length > 0 && (
                <SectionCard title="Education" icon={GraduationCap}>
                  {finalResume.education.map((edu, i) => (
                    <div key={i} className="pb-4 last:border-b-0">
                      <h4 className="font-bold text-black">{edu.degree}</h4>
                      <p className="text-gray-700 font-medium">{edu.institution}</p>
                      <p className="text-sm text-gray-600 mt-1">{edu.year}</p>
                      {(edu.relevantCoursework || []).length > 0 && (
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-medium">Relevant Coursework:</span>{' '}
                          {(edu.relevantCoursework || []).join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </SectionCard>
              )}

              {finalResume.certifications && finalResume.certifications.length > 0 && (
                <SectionCard title="Certifications" icon={Sparkles}>
                  {finalResume.certifications.map((cert, i) => (
                    <div key={i} className="pb-4 last:border-b-0">
                      <h4 className="font-bold text-black">{cert.name}</h4>
                      <p className="text-gray-700 font-medium">{cert.issuingOrganization}</p>
                      <p className="text-sm text-gray-600 mt-1">{cert.year}</p>
                    </div>
                  ))}
                </SectionCard>
              )}

              {finalResume.awardsAndHonors && finalResume.awardsAndHonors.length > 0 && (
                <SectionCard title="Awards and Honors" icon={Sparkles}>
                  {finalResume.awardsAndHonors.map((award, i) => (
                    <div key={i} className="pb-4 last:border-b-0">
                      <h4 className="font-bold text-black">{award.name}</h4>
                      <p className="text-gray-700 font-medium">{award.organization}</p>
                      <p className="text-sm text-gray-600 mt-1">{award.year}</p>
                    </div>
                  ))}
                </SectionCard>
              )}

              {finalResume.languages && finalResume.languages.length > 0 && (
                <SectionCard title="Languages" icon={Sparkles}>
                  {finalResume.languages.map((lang, i) => (
                    <div key={i} className="pb-4 last:border-b-0">
                      <h4 className="font-bold text-black">{lang.language}</h4>
                      <p className="text-gray-700 font-medium">{lang.proficiency}</p>
                    </div>
                  ))}
                </SectionCard>
              )}
            </div>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default OptimizedResumeDisplay;

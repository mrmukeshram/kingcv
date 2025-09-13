/**
 * Content Estimator Utility
 * Estimates content density and provides recommendations for single-page optimization
 */

export interface ContentEstimation {
  estimatedPageCount: number;
  contentDensity: 'too_short' | 'just_right' | 'too_long';
  recommendations: string[];
  sectionBreakdown: {
    section: string;
    wordCount: number;
    bulletPoints: number;
    estimatedLines: number;
  }[];
}

export interface ResumeSection {
  name: string;
  content: any;
  weight: number; // Relative importance for space allocation
}

/**
 * Estimates the page count and content density of a resume
 */
export function estimateContentDensity(resume: any): ContentEstimation {
  const sections: ResumeSection[] = [
    { name: 'Header', content: resume.header, weight: 0.5 },
    { name: 'Professional Summary', content: resume.professionalSummary, weight: 1 },
    { name: 'Core Skills', content: resume.coreSkills, weight: 1.5 },
    { name: 'Work Experience', content: resume.workExperience, weight: 3 },
    { name: 'Projects', content: resume.projects, weight: 2 },
    { name: 'Education', content: resume.education, weight: 1.5 },
    { name: 'Additional Sections', content: resume.additionalSections, weight: 1 },
  ];

  const sectionBreakdown = sections.map(section => {
    const wordCount = estimateSectionWordCount(section);
    const bulletPoints = estimateBulletPoints(section);
    const estimatedLines = estimateLines(section);

    return {
      section: section.name,
      wordCount,
      bulletPoints,
      estimatedLines
    };
  });

  // Calculate total estimated lines
  const totalLines = sectionBreakdown.reduce((sum, section) => sum + section.estimatedLines, 0);

  // Estimate page count (assuming ~50 lines per page for standard resume formatting)
  const estimatedPageCount = Math.max(0.5, totalLines / 50);

  // Determine content density
  let contentDensity: 'too_short' | 'just_right' | 'too_long';
  if (estimatedPageCount < 0.75) {
    contentDensity = 'too_short';
  } else if (estimatedPageCount > 1.2) {
    contentDensity = 'too_long';
  } else {
    contentDensity = 'just_right';
  }

  // Generate recommendations
  const recommendations = generateRecommendations(contentDensity, sectionBreakdown, resume);

  return {
    estimatedPageCount: Math.round(estimatedPageCount * 10) / 10,
    contentDensity,
    recommendations,
    sectionBreakdown
  };
}

/**
 * Estimates word count for a section
 */
function estimateSectionWordCount(section: ResumeSection): number {
  if (!section.content) return 0;

  switch (section.name) {
    case 'Header':
      return (section.content.name?.length || 0) +
             (section.content.title?.length || 0) +
             (section.content.contact?.length || 0);

    case 'Professional Summary':
      return section.content.split(' ').length;

    case 'Core Skills':
      const technicalSkills = section.content.technical?.length || 0;
      const softSkills = section.content.soft?.length || 0;
      return technicalSkills + softSkills;

    case 'Work Experience':
      if (!section.content || !Array.isArray(section.content)) return 0;
      return section.content.reduce((total, exp) => {
        const titleWords = exp.title?.split(' ').length || 0;
        const companyWords = exp.company?.split(' ').length || 0;
        const durationWords = exp.duration?.split(' ').length || 0;
        const achievementWords = exp.achievements?.reduce((sum, achievement) =>
          sum + achievement.split(' ').length, 0) || 0;
        return total + titleWords + companyWords + durationWords + achievementWords;
      }, 0);

    case 'Projects':
      if (!section.content || !Array.isArray(section.content)) return 0;
      return section.content.reduce((total, project) => {
        const titleWords = project.title?.split(' ').length || 0;
        const descWords = project.description?.split(' ').length || 0;
        const techWords = project.technologies?.length || 0;
        return total + titleWords + descWords + techWords;
      }, 0);

    case 'Education':
      if (!section.content || !Array.isArray(section.content)) return 0;
      return section.content.reduce((total, edu) => {
        const degreeWords = edu.degree?.split(' ').length || 0;
        const institutionWords = edu.institution?.split(' ').length || 0;
        const yearWords = edu.year?.split(' ').length || 0;
        const courseworkWords = edu.relevantCoursework?.length || 0;
        return total + degreeWords + institutionWords + yearWords + courseworkWords;
      }, 0);

    case 'Additional Sections':
      if (!section.content || !Array.isArray(section.content)) return 0;
      return section.content.reduce((total, additional) => {
        const titleWords = additional.title?.split(' ').length || 0;
        const contentWords = additional.content?.split(' ').length || 0;
        return total + titleWords + contentWords;
      }, 0);

    default:
      return 0;
  }
}

/**
 * Estimates bullet points for a section
 */
function estimateBulletPoints(section: ResumeSection): number {
  if (!section.content) return 0;

  switch (section.name) {
    case 'Core Skills':
      return (section.content.technical?.length || 0) + (section.content.soft?.length || 0);

    case 'Work Experience':
      if (!section.content || !Array.isArray(section.content)) return 0;
      return section.content.reduce((total, exp) =>
        total + (exp.achievements?.length || 0), 0);

    case 'Projects':
      if (!section.content || !Array.isArray(section.content)) return 0;
      return section.content.length * 2; // Assuming 2 bullet points per project

    case 'Education':
      if (!section.content || !Array.isArray(section.content)) return 0;
      return section.content.reduce((total, edu) =>
        total + (edu.relevantCoursework?.length || 0), 0);

    default:
      return 0;
  }
}

/**
 * Estimates the number of lines a section will occupy
 */
function estimateLines(section: ResumeSection): number {
  const wordCount = estimateSectionWordCount(section);
  const bulletPoints = estimateBulletPoints(section);

  // Base calculation: ~10 words per line, plus extra for bullets and spacing
  let lines = Math.ceil(wordCount / 10);

  // Add extra lines for bullet points (each bullet takes ~1.5 lines)
  lines += Math.ceil(bulletPoints * 1.5);

  // Add section header and spacing
  lines += 2;

  // Minimum lines per section
  return Math.max(lines, 1);
}

/**
 * Generates recommendations based on content analysis
 */
function generateRecommendations(
  density: string,
  sectionBreakdown: ContentEstimation['sectionBreakdown'],
  resume: any
): string[] {
  const recommendations: string[] = [];

  if (density === 'too_long') {
    recommendations.push('Condense bullet points to 1-2 lines each');
    recommendations.push('Combine related skills into single entries');
    recommendations.push('Remove redundant or less relevant information');

    // Find sections that can be condensed
    const longSections = sectionBreakdown.filter(s => s.estimatedLines > 15);
    if (longSections.length > 0) {
      recommendations.push(`Focus on condensing: ${longSections.map(s => s.section).join(', ')}`);
    }

  } else if (density === 'too_short') {
    recommendations.push('Add more technical details and quantifiable results');
    recommendations.push('Include relevant coursework and achievements');
    recommendations.push('Add certifications or professional development section');

    // Check what sections are missing or sparse
    const sparseSections = sectionBreakdown.filter(s => s.estimatedLines < 3);
    if (sparseSections.length > 0) {
      recommendations.push(`Expand sections: ${sparseSections.map(s => s.section).join(', ')}`);
    }

    // Specific recommendations based on resume type
    if (!resume.projects || resume.projects.length === 0) {
      recommendations.push('Generate 2-3 relevant projects based on skills');
    }
    if (!resume.additionalSections || resume.additionalSections.length === 0) {
      recommendations.push('Add certifications, awards, or professional development');
    }

  } else {
    recommendations.push('Content is well-balanced for single page');
    recommendations.push('Make minor adjustments for optimal visual spacing');
  }

  return recommendations;
}

/**
 * Analyzes resume pattern based on content
 */
export function analyzeResumePattern(resume: any): {
  pattern: string;
  confidence: string;
  sectionsPresent: string[];
  sectionsMissing: string[];
} {
  const sectionsPresent: string[] = [];
  const sectionsMissing: string[] = [];

  // Check each section
  if (resume.header) sectionsPresent.push('header');
  else sectionsMissing.push('header');

  if (resume.professionalSummary) sectionsPresent.push('professionalSummary');
  else sectionsMissing.push('professionalSummary');

  if (resume.coreSkills) sectionsPresent.push('coreSkills');
  else sectionsMissing.push('coreSkills');

  if (resume.workExperience && resume.workExperience.length > 0) sectionsPresent.push('workExperience');
  else sectionsMissing.push('workExperience');

  if (resume.projects && resume.projects.length > 0) sectionsPresent.push('projects');
  else sectionsMissing.push('projects');

  if (resume.education && resume.education.length > 0) sectionsPresent.push('education');
  else sectionsMissing.push('education');

  if (resume.additionalSections && resume.additionalSections.length > 0) sectionsPresent.push('additionalSections');
  else sectionsMissing.push('additionalSections');

  // Determine pattern
  let pattern = 'Unknown';
  let confidence = 'medium';

  if (sectionsPresent.includes('workExperience') && sectionsPresent.includes('projects')) {
    pattern = 'Pattern A: Experienced Professional';
    confidence = 'high';
  } else if (sectionsPresent.includes('workExperience') && !sectionsPresent.includes('projects')) {
    pattern = 'Pattern B: Career Changer';
    confidence = 'high';
  } else if (sectionsPresent.includes('education') && sectionsPresent.includes('projects') && !sectionsPresent.includes('workExperience')) {
    pattern = 'Pattern C: Recent Graduate';
    confidence = 'high';
  } else if (sectionsPresent.includes('education') && !sectionsPresent.includes('projects') && !sectionsPresent.includes('workExperience')) {
    pattern = 'Pattern D: Entry-Level';
    confidence = 'high';
  } else if (!sectionsPresent.includes('workExperience') && sectionsPresent.includes('projects')) {
    pattern = 'Pattern E: Skill-Based Professional';
    confidence = 'high';
  }

  return {
    pattern,
    confidence,
    sectionsPresent,
    sectionsMissing
  };
}

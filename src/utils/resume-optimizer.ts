import { OptimizedResume, ResumeAnalysis } from '../types/analysis';

/**
 * Utility functions for resume optimization and validation
 */

export class ResumeOptimizer {
  /**
   * Analyzes resume comprehensively for dynamic processing
   */
  static analyzeResume(resumeText: string): ResumeAnalysis {
    const text = resumeText.toLowerCase();
    const wordCount = resumeText.trim().split(/\s+/).length;

    // Advanced section detection
    const sections = {
      hasWorkExperience: this.detectWorkExperience(text),
      hasProjects: this.detectProjects(text),
      hasSkills: this.detectSkills(text),
      hasCertifications: this.detectCertifications(text),
      hasEducation: this.detectEducation(text),
      hasAwards: this.detectAwards(text),
      hasVolunteer: this.detectVolunteer(text),
      hasLanguages: this.detectLanguages(text),
      hasPublications: this.detectPublications(text),
    };

    const sectionCount = Object.values(sections).filter(Boolean).length;
    const experienceLevel = this.extractExperienceLevel(text);
    const seniorityLevel = this.calculateSeniorityLevel(text);

    // Intelligent type classification
    const type = this.classifyResumeType(wordCount, sectionCount, sections, experienceLevel, seniorityLevel);

    return {
      type,
      wordCount,
      sections: sectionCount,
      hasExperience: sections.hasWorkExperience,
      hasProjects: sections.hasProjects,
      experienceLevel,
      seniorityLevel,
      sectionsPresent: sections,
      contentRichness: this.calculateContentRichness(sections, wordCount, experienceLevel)
    };
  }

  private static detectWorkExperience(text: string): boolean {
    const workKeywords = /experience|employment|work history|professional experience|career|position|role|job/;
    const datePattern = /\d{4}|\d{1,2}\/\d{4}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/;
    return workKeywords.test(text) && datePattern.test(text);
  }

  private static detectProjects(text: string): boolean {
    return /project|portfolio|application|system|developed|built|created|designed|implemented/.test(text);
  }

  private static detectSkills(text: string): boolean {
    return /skill|technology|programming|software|tool|technical|proficient|familiar/.test(text);
  }

  private static detectCertifications(text: string): boolean {
    return /certif|license|credential|course|training|coursera|udemy|aws|google|microsoft/.test(text);
  }

  private static detectEducation(text: string): boolean {
    return /education|degree|university|college|school|bachelor|master|phd|diploma|gpa/.test(text);
  }

  private static detectAwards(text: string): boolean {
    return /award|honor|recognition|achievement|dean|scholarship|prize|medal|winner/.test(text);
  }

  private static detectVolunteer(text: string): boolean {
    return /volunteer|community|nonprofit|charity|social work|ngo|outreach/.test(text);
  }

  private static detectLanguages(text: string): boolean {
    return /language|fluent|bilingual|spanish|french|chinese|hindi|native|conversational/.test(text);
  }

  private static detectPublications(text: string): boolean {
    return /publication|research|paper|journal|conference|published|author|thesis/.test(text);
  }

  private static extractExperienceLevel(text: string): number {
    const matches = text.match(/(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/);
    return matches ? parseInt(matches[1]) : 0;
  }

  private static calculateSeniorityLevel(text: string): number {
    const seniorityTerms = text.match(/(senior|lead|principal|manager|director|vp|chief|head)/g);
    return seniorityTerms?.length || 0;
  }

  private static classifyResumeType(
    wordCount: number,
    sectionCount: number,
    sections: any,
    experienceLevel: number,
    seniorityLevel: number
  ): 'minimal' | 'moderate' | 'maximal' {
    // Minimal indicators
    if (wordCount < 200 ||
        sectionCount <= 3 ||
        (!sections.hasWorkExperience && !sections.hasProjects && experienceLevel === 0)) {
      return 'minimal';
    }

    // Maximal indicators
    if (wordCount > 700 ||
        sectionCount >= 7 ||
        seniorityLevel >= 3 ||
        experienceLevel >= 8) {
      return 'maximal';
    }

    return 'moderate';
  }

  private static calculateContentRichness(sections: any, wordCount: number, experienceLevel: number): number {
    let richness = 0;
    richness += Object.values(sections).filter(Boolean).length * 10;
    richness += Math.min(wordCount / 10, 50);
    richness += Math.min(experienceLevel * 5, 30);
    return Math.round(richness);
  }

  /**
   * Validates single-page compliance with detailed feedback
   */
  static validateSinglePageCompliance(resume: OptimizedResume): {
    isCompliant: boolean;
    issues: string[];
    recommendations: string[];
    contentDensity: number;
    pageUtilization: string;
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const density = this.estimateContentDensity(resume);

    // Aggressive density requirements for single-page optimization
    let pageUtilization = '';
    if (density < 75) {
      issues.push("Content too sparse for single page - must achieve 85-95% density");
      recommendations.push("DRAMATICALLY expand content: Add comprehensive project descriptions, detailed work achievements with metrics, extensive technical skills, certifications, volunteer work, awards, and technical skills breakdown");
      pageUtilization = 'Critically Under-utilized';
    } else if (density < 85) {
      issues.push("Content density insufficient - requires more expansion");
      recommendations.push("Significantly enhance sections: Increase project detail, add performance metrics, expand technical skills to 12-15 items, add relevant coursework, include leadership roles and extracurricular activities");
      pageUtilization = 'Under-utilized';
    } else if (density > 130) {
      issues.push("Content too dense - may exceed single page");
      recommendations.push("Condense work experience bullets and project descriptions while maintaining key achievements");
      pageUtilization = 'Over-filled';
    } else if (density < 95) {
      recommendations.push("Add a few more details to reach optimal 85-95% density: Include additional achievements, expand technologies list, add more relevant keywords");
      pageUtilization = 'Near Optimal';
    } else {
      pageUtilization = 'Optimal';
    }

    // Required sections validation
    if (!resume.header?.name) issues.push("Missing candidate name");
    if (!resume.header?.title) issues.push("Missing professional title");
    if (!resume.header?.contact) issues.push("Missing contact information");
    if (!resume.professionalSummary) issues.push("Missing professional summary");
    if (!resume.coreSkills?.technical?.length && !resume.coreSkills?.soft?.length) {
      issues.push("Missing core skills section");
    }
    if (!resume.education?.length) issues.push("Missing education information");

    // Quality recommendations
    if (resume.professionalSummary && resume.professionalSummary.length < 120) {
      recommendations.push("Expand professional summary (aim for 3-4 lines)");
    }

    const totalSkills = (resume.coreSkills?.technical?.length || 0) + (resume.coreSkills?.soft?.length || 0);
    if (totalSkills < 10) {
      recommendations.push("Add more relevant skills to strengthen profile");
    }

    // Section balance validation
    const presentSections = this.countPresentSections(resume);
    if (presentSections < 5) {
      recommendations.push("Add more sections to utilize full page space effectively");
    }

    return {
      isCompliant: issues.length === 0 && density >= 60 && density <= 130,
      issues,
      recommendations,
      contentDensity: density,
      pageUtilization
    };
  }

  /**
   * Estimates content density for single-page optimization - AGGRESSIVE SCORING
   */
  static estimateContentDensity(resume: OptimizedResume): number {
    let score = 0;

    // Header and basic info (35-45 points)
    score += 15; // Header contact and name
    score += Math.min((resume.professionalSummary?.length || 0) / 10, 25); // Professional summary - more generous
    score += (resume.education?.length || 0) * 8; // Education entries - increased

    // Skills sections - Very aggressive scoring for technical skills (40-60 points)
    score += Math.min((resume.coreSkills?.technical?.length || 0) * 2.5, 30); // Technical skills - much more generous
    score += Math.min((resume.coreSkills?.soft?.length || 0) * 2, 15); // Soft skills - increased

    // Work experience - Heavily emphasize detail (40-70 points)
    if (resume.workExperience?.length) {
      score += resume.workExperience.reduce((sum, exp) => {
        const achievementsCount = Math.min(exp.achievements?.length || 0, 5);
        const achievementDetail = (exp.achievements || []).reduce((detail, ach) => {
          const length = ach.length;
          if (length > 100) return detail + 8; // Very detailed achievement
          if (length > 70) return detail + 5; // Detailed achievement
          if (length > 35) return detail + 3; // Good achievement
          return detail + 1; // Basic achievement
        }, 0);
        return sum + achievementsCount * 5 + Math.min(achievementDetail, 20);
      }, 0);
    }

    // Projects with detailed descriptions (30-60 points)
    if (resume.projects?.length) {
      score += resume.projects.reduce((sum, proj) => {
        const basePoints = 8;
        const descriptionLength = proj.description?.length || 0;
        const descriptionBonus = descriptionLength > 150 ? 12 : descriptionLength > 100 ? 8 : descriptionLength > 50 ? 4 : 2;
        const techCount = (proj.technologies || []).length;
        const techBonus = techCount * 2; // 2 points per technology
        const durationBonus = proj.duration ? 2 : 0; // Bonus for having duration
        const metricsBonus = proj.metrics ? 2 : 0; // Bonus for having metrics
        return sum + basePoints + descriptionBonus + techBonus + durationBonus + metricsBonus;
      }, 0);
    }

    // Additional comprehensive sections - Highly rewarded (50-90 points)
    score += Math.min((resume.certifications?.length || 0) * 5, 30); // More for each certification
    score += Math.min((resume.awardsAndHonors?.length || 0) * 6, 24); // More for each award
    score += Math.min((resume.languages?.length || 0) * 4, 16); // More for each language
    score += Math.min((resume.volunteerExperience?.length || 0) * 8, 32); // More for each volunteer role
    score += Math.min((resume.publicationsAndResearch?.length || 0) * 6, 20); // More for each publication

    // Technical skills breakdown - Massive bonus for categorization
    if (resume.technicalSkills) {
      const techLanguages = Math.min((resume.technicalSkills.programmingLanguages?.length || 0) * 2.5, 15);
      const frameworks = Math.min((resume.technicalSkills.frameworks?.length || 0) * 2.5, 12);
      const tools = Math.min((resume.technicalSkills.tools?.length || 0) * 2, 8);
      const databases = Math.min((resume.technicalSkills.databases?.length || 0) * 2.5, 8);
      const platforms = Math.min((resume.technicalSkills.platforms?.length || 0) * 2, 6);
      score += techLanguages + frameworks + tools + databases + platforms + 12; // +12 for having breakdowns
    }

    // Additional sections - Highly rewarded for detailed content
    if (resume.additionalSections?.length) {
      score += resume.additionalSections.reduce((sum, section) => {
        const contentLength = (section.content || []).join(' ').length;
        const detailBonus = contentLength > 200 ? 10 : contentLength > 100 ? 6 : 3;
        return sum + detailBonus;
      }, 0);
    }

    // Word count bonus - Much more generous
    const estimatedWordCount = this.estimateResumeWordCount(resume);
    if (estimatedWordCount > 700) score += 25; // Excellent density
    else if (estimatedWordCount > 600) score += 20; // Great density
    else if (estimatedWordCount > 500) score += 15; // Good density
    else if (estimatedWordCount > 400) score += 10; // Fair density
    else if (estimatedWordCount > 300) score += 5; // Minimal density

    // Section count multiplier - Highly rewarded for comprehensive resumes
    const sectionCount = this.countPresentSections(resume);
    if (sectionCount >= 10) score += 30; // Excellent coverage
    else if (sectionCount >= 8) score += 20; // Great coverage
    else if (sectionCount >= 6) score += 15; // Good coverage
    else if (sectionCount >= 4) score += 10; // Fair coverage
    else if (sectionCount >= 2) score += 5; // Basic coverage

    return Math.round(score);
  }

  /**
   * Estimates total word count of resume
   */
  private static estimateResumeWordCount(resume: OptimizedResume): number {
    let wordCount = 0;

    // Header content
    if (resume.header) {
      wordCount += (resume.header.name || '').split(' ').length;
      wordCount += (resume.header.title || '').split(' ').length;
    }

    // Professional summary
    if (resume.professionalSummary) {
      wordCount += resume.professionalSummary.split(' ').length;
    }

    // Skills
    wordCount += Math.min((resume.coreSkills?.technical?.length || 0) * 1.5, 50); // Assume ~1.5 words per skill
    wordCount += Math.min((resume.coreSkills?.soft?.length || 0) * 1.5, 30);

    // Work experience
    if (resume.workExperience) {
      wordCount += resume.workExperience.reduce((sum, exp) => {
        return sum + 8 + (exp.achievements?.reduce((achSum, ach) =>
          achSum + ach.split(' ').length, 0) || 0);
      }, 0);
    }

    // Projects
    if (resume.projects) {
      wordCount += resume.projects.reduce((sum, proj) =>
        sum + 15 + proj.description.split(' ').length + (proj.technologies || []).length * 2, 0);
    }

    // Education
    if (resume.education) {
      wordCount += resume.education.length * 12;
    }

    // Additional sections
    if (resume.certifications) wordCount += resume.certifications.length * 8;
    if (resume.awardsAndHonors) wordCount += resume.awardsAndHonors.length * 6;
    if (resume.languages) wordCount += resume.languages.length * 4;
    if (resume.volunteerExperience) wordCount += resume.volunteerExperience.length * 12;
    if (resume.publicationsAndResearch) wordCount += resume.publicationsAndResearch.length * 15;

    return Math.round(wordCount);
  }

  /**
   * Counts present sections in resume
   */
  private static countPresentSections(resume: OptimizedResume): number {
    let count = 0;

    // Always present
    if (resume.header) count++;
    if (resume.professionalSummary) count++;
    if (resume.coreSkills) count++;
    if (resume.education?.length) count++;

    // Optional sections
    if (resume.workExperience?.length) count++;
    if (resume.projects?.length) count++;
    if (resume.certifications?.length) count++;
    if (resume.technicalSkills) count++;
    if (resume.awardsAndHonors?.length) count++;
    if (resume.languages?.length) count++;
    if (resume.volunteerExperience?.length) count++;
    if (resume.publicationsAndResearch?.length) count++;
    if (resume.additionalSections?.length) count++;

    return count;
  }

  /**
   * Provides optimization suggestions based on resume analysis
   */
  static getOptimizationSuggestions(analysis: ResumeAnalysis): string[] {
    const suggestions: string[] = [];

    switch (analysis.type) {
      case 'minimal':
        suggestions.push("🔧 EXPANSION STRATEGY:");
        suggestions.push("• Add relevant coursework and academic projects");
        suggestions.push("• Include certifications you're pursuing");
        suggestions.push("• Expand technical and soft skills sections");
        suggestions.push("• Add volunteer work and extracurricular activities");
        suggestions.push("• Include awards, honors, or academic achievements");
        break;

      case 'moderate':
        suggestions.push("⚖️ OPTIMIZATION STRATEGY:");
        suggestions.push("• Enhance existing content with job keywords");
        suggestions.push("• Add quantifiable metrics to achievements");
        suggestions.push("• Balance section lengths for optimal spacing");
        suggestions.push("• Include 1-2 additional relevant sections");
        break;

      case 'maximal':
        suggestions.push("✂️ CONDENSATION STRATEGY:");
        suggestions.push("• Focus on last 10-15 years of experience");
        suggestions.push("• Limit to 3-4 most relevant positions");
        suggestions.push("• Summarize older experience into one line");
        suggestions.push("• Prioritize achievements with measurable impact");
        suggestions.push("• Consolidate similar skills and technologies");
        break;
    }

    return suggestions;
  }
}

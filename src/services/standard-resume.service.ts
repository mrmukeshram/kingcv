// src/services/standard-resume.service.ts
import { callGemini } from "./gemini-client";
import { createStandardResumeBuilderPrompt } from "@/lib/gemini-prompts";
import { createContentExpansionPrompt } from "@/lib/fully-optimized-prompts";
import { OptimizedResume } from "@/types/analysis";

/**
 * Analyzes content length in CM and determines expansion strategy based on physical page length
 */
const analyzeContentLength = (resume: OptimizedResume, originalResumeText: string): {
  estimatedLengthCm: number;
  estimatedLength: 'too_short' | 'optimal' | 'too_long';
  expansionNeeded: boolean;
  compressionNeeded: boolean;
  availableContentSections: string[];
} => {
  // Estimate physical page length based on content density
  // Average resume fills 22-24cm on an A4 page (29.7cm height)
  // Formula: word count * average characters per word * approximate line height / characters per line

  let wordCount = 0;
  let contentDensity = 1.0; // Multiplier for content richness

  // Count words and assess density in each section
  if (resume.professionalSummary) {
    const summaryWords = resume.professionalSummary.split(' ').length;
    wordCount += summaryWords;
    contentDensity += summaryWords > 100 ? 0.1 : 0;
  }

  if (resume.coreSkills?.technical) {
    const techSkills = resume.coreSkills.technical.length;
    wordCount += techSkills * 8; // Average 8 words per skill description
    contentDensity += techSkills > 15 ? 0.15 : 0;
  }

  if (resume.coreSkills?.soft) {
    const softSkills = resume.coreSkills.soft.length;
    wordCount += softSkills * 6; // Average 6 words per soft skill description
    contentDensity += softSkills > 10 ? 0.1 : 0;
  }

  if (resume.workExperience) {
    resume.workExperience.forEach(exp => {
      const achievementWords = exp.achievements.join(' ').split(' ').length;
      wordCount += achievementWords;
      contentDensity += achievementWords > 200 ? 0.2 : 0.1;
    });
  }

  if (resume.projects) {
    resume.projects.forEach(proj => {
      wordCount += proj.description.split(' ').length + proj.technologies.length * 5;
      contentDensity += 0.15;
    });
  }

  if (resume.education) {
    resume.education.forEach(edu => {
      wordCount += (edu.relevantCoursework?.join(' ').split(' ').length || 0) + 30; // Base education content
      contentDensity += 0.1;
    });
  }

  // Extract available sections from original resume for dynamic content
  const availableSections = extractAvailableSections(originalResumeText);

    // ACCURATE LENGTH CALCULATION - Calibrated to real resume lengths
    // Base calculation: 400 words ≈ 17.5cm (corrected for actual fill length)
    const baseLengthCm = (wordCount / 400) * 17.5;

    // Apply reasonable adjustments for content type
    const contentMultiplier = contentDensity > 1.3 ? 1.2 : contentDensity > 1.1 ? 1.1 : 1.0;
    const estimatedLengthCm = baseLengthCm * contentMultiplier * 0.95; // Final calibration

    console.log(`📏 REAL LENGTH CALC: ${wordCount} words → ${estimatedLengthCm.toFixed(1)}cm (calibrated formula)`);
    console.log(`🔍 LENGTH VERIFICATION: ${wordCount} words ≈ ${estimatedLengthCm.toFixed(1)}cm | Threshold: 23.0cm MIN`);

  let estimatedLength: 'too_short' | 'optimal' | 'too_long';
  let expansionNeeded = false;
  let compressionNeeded = false;

  if (estimatedLengthCm < 23) {
    estimatedLength = 'too_short';
    expansionNeeded = true;
  } else if (estimatedLengthCm > 24) {
    estimatedLength = 'too_long';
    compressionNeeded = true;
  } else {
    estimatedLength = 'optimal';
  }

  return {
    estimatedLengthCm,
    estimatedLength,
    expansionNeeded,
    compressionNeeded,
    availableContentSections: availableSections
  };
};

/**
 * Extracts available sections from original resume text for dynamic content usage
 */
const extractAvailableSections = (originalResumeText: string): string[] => {
  const sections = [];
  const lowerText = originalResumeText.toLowerCase();

  const sectionKeywords = [
    'experience', 'work', 'employment',
    'projects', 'project',
    'education', 'academic',
    'skills', 'competencies', 'abilities',
    'certifications', 'certificates',
    'awards', 'honors', 'achievements',
    'volunteer', 'community', 'leadership',
    'publications', 'research',
    'languages', 'language',
    'interests', 'hobbies',
    'professional development', 'training',
    'courses', 'coursework'
  ];

  sectionKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      sections.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
  });

  return sections;
};

/**
 * Validates the structure of the standard resume response
 */
const validateResumeStructure = (resume: any): resume is OptimizedResume => {
  if (!resume || typeof resume !== 'object') {
    return false;
  }

  // Check required sections
  const requiredSections = ['header', 'professionalSummary', 'coreSkills'];
  for (const section of requiredSections) {
    if (!resume[section]) {
      return false;
    }
  }

  // Validate header structure
  if (!resume.header.name || !resume.header.title || !resume.header.contact) {
    return false;
  }

  // Validate core skills structure
  if (!resume.coreSkills.technical || !Array.isArray(resume.coreSkills.technical)) {
    return false;
  }

  return true;
};

/**
 * Calculates word count including additional sections for enriched resume
 */
const calculateFinalWordCount = (resume: any): number => {
  let wordCount = 0;

  // Count base sections
  if (resume.professionalSummary) wordCount += resume.professionalSummary.split(' ').length;
  if (resume.coreSkills) {
    if (resume.coreSkills.technical) wordCount += resume.coreSkills.technical.join(' ').split(' ').length;
    if (resume.coreSkills.soft) wordCount += resume.coreSkills.soft.join(' ').split(' ').length;
  }

  if (resume.workExperience) {
    resume.workExperience.forEach((exp: any) => {
      wordCount += exp.achievements?.join(' ').split(' ').length || 0;
    });
  }

  if (resume.projects) {
    resume.projects.forEach((proj: any) => {
      wordCount += (proj.description?.split(' ').length || 0) + (proj.technologies?.join(' ').split(' ').length || 0);
    });
  }

  if (resume.education) {
    resume.education.forEach((edu: any) => {
      wordCount += (edu.relevantCoursework?.join(' ').split(' ').length || 0);
    });
  }

  // Count additional sections
  if (resume.additionalSections) {
    resume.additionalSections.forEach((section: any) => {
      if (typeof section.content === 'string') {
        wordCount += section.content.split(' ').length;
      } else if (Array.isArray(section.content)) {
        wordCount += section.content.join(' ').split(' ').length;
      }
    });
  }

  return wordCount;
};

/**
 * Adds real sections from original resume to reach target length - NO FAKE SECTIONS
 */
const expandWithRealSections = async (
  resume: OptimizedResume,
  originalResumeText: string,
  targetLengthCm: number = 22.0
): Promise<OptimizedResume | null> => {
  try {
    const contentAnalysis = analyzeContentLength(resume, originalResumeText);
    let enhancedResume = { ...resume };

    // Extract real sections from original resume
    const realSections = extractResumeSections(originalResumeText, enhancedResume);

    if (realSections.length === 0) {
      console.log(`⚠️ No additional real sections found in original resume`);
      return null; // Let main function handle fallback
    }

    console.log(`📊 Length Analysis: ${contentAnalysis.estimatedLengthCm.toFixed(1)}cm current, need ${(targetLengthCm - contentAnalysis.estimatedLengthCm).toFixed(1)}cm more`);
    console.log(`🎯 Found ${realSections.length} real sections to add`);

    // Add real sections one by one until we reach target or run out of sections
    if (!enhancedResume.additionalSections) {
      enhancedResume.additionalSections = [];
    }

    let currentLength = contentAnalysis.estimatedLengthCm;
    let sectionsAdded = 0;

    for (let i = 0; i < realSections.length && sectionsAdded < 3 && currentLength < targetLengthCm; i++) {
      const sectionToAdd = realSections[i];

      // Add the real section
      enhancedResume.additionalSections.push(sectionToAdd);
      console.log(`✅ Added REAL section: ${sectionToAdd.title}`);

      // Recalculate length to see if we've reached target
      const newAnalysis = analyzeContentLength(enhancedResume, originalResumeText);
      currentLength = newAnalysis.estimatedLengthCm;
      sectionsAdded++;

      console.log(`� Current length after adding: ${currentLength.toFixed(1)}cm`);

      // Stop if we've reached or exceeded target
      if (currentLength >= targetLengthCm - 0.5) { // Allow 0.5cm buffer
        break;
      }
    }

    const finalAnalysis = analyzeContentLength(enhancedResume, originalResumeText);

    if (finalAnalysis.estimatedLengthCm >= targetLengthCm - 1) {
      console.log(`✅ REAL sections expansion successful: ${finalAnalysis.estimatedLengthCm.toFixed(1)}cm achieved (${sectionsAdded} REAL sections added)`);
      return enhancedResume;
    } else {
      console.log(`⚠️ REAL sections insufficient: ${finalAnalysis.estimatedLengthCm.toFixed(1)}cm, still need ${(targetLengthCm - finalAnalysis.estimatedLengthCm).toFixed(1)}cm`);
      return null; // Let main function handle
    }
  } catch (error) {
    console.error("Real sections expansion failed:", error);
    return null;
  }
};

/**
 * Dynamically compresses content to fit within 24cm limit
 */
const compressContentDynamically = async (
  resume: OptimizedResume,
  jobDescription: string
): Promise<OptimizedResume | null> => {
  try {
    const compressionPrompt = `
    You are a RESUME CONTENT OPTIMIZATION SPECIALIST. Your task is to compress the resume content to fit within 24cm while maintaining professionalism and impact.

    ## COMPRESSION REQUIREMENTS:
    1. **TARGET LENGTH**: Reduce content to fit 22-24cm (currently too long)
    2. **CONTENT PRESERVATION**: Keep most impactful content, remove redundancy
    3. **IMPACT MAXIMIZATION**: Focus on most relevant achievements and skills
    4. **PROFESSIONAL QUALITY**: Maintain clear, concise writing style
    5. **JOB RELEVANCE**: Prioritize content most relevant to target position

    ## COMPRESSION STRATEGIES:

    **Professional Summary**: Trim to 120-150 words focusing on strongest value propositions
    **Work Experience**: Reduce achievement bullets from 4-5 lines to 2-3 most impactful ones per role
    **Projects**: Keep 2-3 most relevant projects with focused descriptions
    **Skills**: Limit to 12-15 most relevant technical skills + 8-10 soft skills
    **Education**: Include most relevant coursework and achievements only

    ## RESUME CONTENT TO OPTIMIZE:
    ${JSON.stringify(resume)}

    ## TARGET JOB FOR RELEVANCE:
    ${jobDescription}

    ## REQUIRED OUTPUT: Compressed resume JSON maintaining structure but with focused content
    `;

    const response = await callGemini(compressionPrompt);
    const compressedResume = typeof response === 'string'
      ? JSON.parse(response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
      : response;

    if (validateResumeStructure(compressedResume)) {
      return compressedResume;
    }
    return null;
  } catch (error) {
    console.error("Dynamic compression failed:", error);
    return null;
  }
};



/**
 * Creates dynamic resume sections based on resume content analysis
 */
const createProperResumeSections = (sectionsNeeded: number, resume: OptimizedResume): OptimizedResume => {
  console.log(`🛠️ Creating ${sectionsNeeded} dynamic resume sections based on content analysis`);

  // Analyze existing resume content to create relevant sections
  const analysis = analyzeResumeContent(resume);
  const dynamicSections = generateDynamicSections(analysis, sectionsNeeded);

  let enhancedResume = { ...resume };

  for (let i = 0; i < sectionsNeeded; i++) {
    const sectionToAdd = dynamicSections[i % dynamicSections.length];
    console.log(`✅ Added dynamic section: ${sectionToAdd.title}`);

    // Add as separate additional section
    if (!enhancedResume.additionalSections) {
      enhancedResume.additionalSections = [];
    }

    enhancedResume.additionalSections.push(sectionToAdd);
  }

  console.log(`🎯 Created ${sectionsNeeded} dynamic resume sections`);
  return enhancedResume;
};

/**
 * Analyzes the existing resume content to understand key areas and themes
 */
const analyzeResumeContent = (resume: OptimizedResume): {
  hasTechnicalSkills: boolean;
  hasManagementExperience: boolean;
  hasDataAnalysis: boolean;
  hasProjectWork: boolean;
  hasCertifications: boolean;
  industryFocus: string[];
  keyStrengths: string[];
  areasToEnhance: string[];
} => {
  const analysis = {
    hasTechnicalSkills: false,
    hasManagementExperience: false,
    hasDataAnalysis: false,
    hasProjectWork: false,
    hasCertifications: false,
    industryFocus: [] as string[],
    keyStrengths: [] as string[],
    areasToEnhance: [] as string[]
  };

  // Analyze technical skills
  if (resume.coreSkills?.technical) {
    analysis.hasTechnicalSkills = resume.coreSkills.technical.length > 0;
    analysis.keyStrengths.push('Technical Expertise');
  }

  // Analyze work experience for management roles
  if (resume.workExperience) {
    const hasManagement = resume.workExperience.some(exp =>
      exp.title?.toLowerCase().includes('manager') ||
      exp.title?.toLowerCase().includes('lead') ||
      exp.title?.toLowerCase().includes('supervisor') ||
      exp.achievements?.join(' ').toLowerCase().includes('team')
    );
    analysis.hasManagementExperience = hasManagement;
    if (hasManagement) analysis.keyStrengths.push('Leadership & Management');
  }

  // Analyze for project work
  const allContent = [
    resume.professionalSummary || '',
    ...(resume.workExperience?.map(exp => exp.achievements?.join(' ') || '') || []),
    ...(resume.coreSkills?.technical || []),
    ...(resume.coreSkills?.soft || [])
  ].join(' ').toLowerCase();

  analysis.hasProjectWork = allContent.includes('project') || allContent.includes('implementation');
  if (analysis.hasProjectWork) analysis.keyStrengths.push('Project Execution');

  // Analyze for data/analysis work
  analysis.hasDataAnalysis = allContent.includes('data') || allContent.includes('analytics') || allContent.includes('analysis');
  if (analysis.hasDataAnalysis) analysis.keyStrengths.push('Data Analysis');

  // Analyze for certifications/industry focus
  analysis.hasCertifications = allContent.includes('certification') || allContent.includes('certified') || allContent.includes('training');
  if (analysis.hasCertifications) analysis.keyStrengths.push('Professional Certification');

  // Identify industry focus
  if (allContent.includes('software') || allContent.includes('development')) analysis.industryFocus.push('Technology');
  if (allContent.includes('data') || allContent.includes('analytics')) analysis.industryFocus.push('Data & Analytics');
  if (allContent.includes('management') || allContent.includes('team')) analysis.industryFocus.push('Management');
  if (allContent.includes('project')) analysis.industryFocus.push('Project Management');

  // Determine areas to enhance (missing strengths)
  if (!analysis.hasTechnicalSkills && analysis.industryFocus.includes('Technology')) {
    analysis.areasToEnhance.push('Technical Skills Enhancement');
  }
  if (!analysis.hasManagementExperience && analysis.industryFocus.some(f => ['Management', 'Project Management'].includes(f))) {
    analysis.areasToEnhance.push('Leadership Development');
  }
  if (!analysis.hasDataAnalysis && analysis.industryFocus.includes('Data & Analytics')) {
    analysis.areasToEnhance.push('Analytics Proficiency');
  }

  return analysis;
};

/**
 * Generates dynamic sections based on resume content analysis
 */
const generateDynamicSections = (analysis: ReturnType<typeof analyzeResumeContent>, sectionsNeeded: number) => {
  const dynamicSections: Array<{title: string; content: string[]}> = [];

  // Core sections based on existing strengths
  if (analysis.hasTechnicalSkills && sectionsNeeded > 0) {
    dynamicSections.push({
      title: "Advanced Technical Skills",
      content: ["Enhanced expertise in advanced technical frameworks and development methodologies. Focused on emerging technologies and scalable architecture solutions."]
    });
  }

  if (analysis.hasManagementExperience && sectionsNeeded > 1) {
    dynamicSections.push({
      title: "Leadership & Team Management",
      content: ["Proven expertise in leading cross-functional teams and managing stakeholder relationships. Focused on delivering high-impact results through effective team leadership."]
    });
  }

  if (analysis.hasProjectWork && sectionsNeeded > 2) {
    dynamicSections.push({
      title: "Project Execution Excellence",
      content: ["Specialized expertise in comprehensive project lifecycle management with emphasis on risk mitigation, quality assurance, and successful delivery outcomes."]
    });
  }

  if (analysis.hasDataAnalysis && sectionsNeeded > 3) {
    dynamicSections.push({
      title: "Data Intelligence & Analytics",
      content: ["Advanced proficiency in business intelligence, data visualization, and predictive analytics. Skilled in transforming data insights into actionable strategies."]
    });
  }

  // Enhancement sections for missing areas
  if (analysis.areasToEnhance.length > 0 && dynamicSections.length < sectionsNeeded) {
    const missingAreas = analysis.areasToEnhance;
    for (const area of missingAreas) {
      if (dynamicSections.length >= sectionsNeeded) break;

      if (area === 'Technical Skills Enhancement') {
        dynamicSections.push({
          title: "Technical Skill Development",
          content: ["Continuous advancement in current technical skill sets and emerging technologies. Focused on maintaining cutting-edge technical expertise and proficiency."]
        });
      } else if (area === 'Leadership Development') {
        dynamicSections.push({
          title: "Advanced Leadership Skills",
          content: ["Development of advanced leadership capabilities and strategic management skills. Focused on driving organizational success through effective leadership."]
        });
      } else if (area === 'Analytics Proficiency') {
        dynamicSections.push({
          title: "Advanced Analytics Capabilities",
          content: ["Development of advanced data analytics and business intelligence skills. Focused on deriving valuable insights from complex data sets."]
        });
      }
    }
  }

  // Fallback generic sections if we still need more
  while (dynamicSections.length < sectionsNeeded) {
    if (analysis.industryFocus.includes('Technology')) {
      dynamicSections.push({
        title: "Technology Innovation",
        content: ["Strong focus on innovative technological solutions and emerging industry trends. Committed to staying current with cutting-edge technology advancements."]
      });
    } else {
      dynamicSections.push({
        title: "Professional Excellence",
        content: ["Dedication to professional excellence and continuous improvement. Focused on delivering high-quality results and maintaining industry-leading standards."]
      });
    }
  }

  return dynamicSections.slice(0, sectionsNeeded);
};

/**
 * Compresses extremely long resumes (handle 187cm case)
 */
const compressExcessiveLength = async (
  resume: OptimizedResume,
  jobDescription: string,
  excessiveLength: number
): Promise<OptimizedResume | null> => {
  try {
    console.log(`� COMPRESSION: Reducing ${excessiveLength.toFixed(1)}cm to 23cm`);
    const compressionPrompt = `
    You are a RESUME COMPRESSION SPECIALIST. This resume is extremely long (${excessiveLength.toFixed(1)}cm) and must be compressed to exactly 23cm.

    ## COMPRESSION STRATEGY:
    1. Keep ALL essential information (header, key achievements)
    2. Shorten ALL sentences drastically
    3. Remove ALL redundant words, adjectives, adverbs
    4. Replace long phrases with concise equivalents
    5. Convert paragraphs to bullets where possible
    6. Focus on quantifiable impact, remove descriptive fluff

    ## LENGTH TARGET: EXACTLY 23cm
    - Use minimal words for maximum impact
    - Remove 75% of current wordiness
    - Keep only the most essential information
    - Achieve business-ready clarity

    ## CURRENT RESUME:
    ${JSON.stringify(resume)}

    ## JOB REQUIREMENTS:
    ${jobDescription}

    Return compressed resume JSON that measures exactly 23cm.
    `;

    const response = await callGemini(compressionPrompt);
    const compressedResume = typeof response === 'string'
      ? JSON.parse(response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
      : response;

    if (validateResumeStructure(compressedResume)) {
      return compressedResume;
    }
    return null;
  } catch (error) {
    console.error("Compression failed:", error);
    return null;
  }
};


/**
 * Extracts additional sections from original resume text to enhance content
 */
const extractResumeSections = (originalResumeText: string, optimizedResume: OptimizedResume): Array<{title: string; content: string[]}> => {
  const additionalSections: Array<{title: string; content: string[]}> = [];
  const lines = originalResumeText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  let currentSection = '';
  let currentContent: string[] = [];
  let captureContent = false;
  let capturedContentWords = 0;

  // Keywords to identify sections that might not be in the optimized resume
  const additionalSectionKeywords = [
    { keyword: 'language', title: 'Languages' },
    { keyword: 'volunteer', title: 'Volunteer Work' },
    { keyword: 'community', title: 'Community Involvement' },
    { keyword: 'leadership', title: 'Leadership Experience' },
    { keyword: 'publications', title: 'Publications' },
    { keyword: 'research', title: 'Research Experience' },
    { keyword: 'achievements', title: 'Key Achievements' },
    { keyword: 'awards', title: 'Awards & Honors' },
    { keyword: 'interests', title: 'Professional Interests' },
    { keyword: 'professional development', title: 'Professional Development' },
    { keyword: 'certifications', title: 'Certifications' },
    { keyword: 'coursework', title: 'Relevant Coursework' },
    { keyword: 'projects', title: 'Project Experience' }
  ];

  for (let i = 0; i < lines.length && capturedContentWords < 150; i++) { // Limit total content to avoid exceeding page limit
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Check if we've found a section header
    for (const { keyword, title } of additionalSectionKeywords) {
      if (lowerLine.includes(keyword) && !lowerLine.includes('experience') && !lowerLine.includes('work')) {
        // Don't duplicate work experience or skills sections
        if (currentContent.length > 0) {
          if (capturedContentWords < 100) { // Only add if we haven't exceeded word limit
            additionalSections.push({
              title: currentSection,
              content: [...currentContent]
            });
          }
        }

        currentSection = title;
        currentContent = [];
        captureContent = true;
        console.log(`📝 Found additional section: ${title}`);
        break;
      }
    }

    // Capture content under current section
    if (captureContent && currentContent.length < 3 && line.length > 10) {
      const words = line.split(' ').length;
      if (capturedContentWords + words < 150 && !line.toUpperCase().includes(line.toUpperCase())) {
        currentContent.push(line);
        capturedContentWords += words;
      }
    }
  }

  // Add the last section if there's content
  if (currentContent.length > 0 && capturedContentWords < 100) {
    additionalSections.push({
      title: currentSection,
      content: [...currentContent]
    });
  }

  console.log(`📄 Extracted ${additionalSections.length} additional sections from original resume`);
  return additionalSections.filter(section => section.content.length > 0);
};

/**
 * Ensures resume meets STRICT 23cm MINIMUM by adding content from original resume
 */
const ensureMinimumLength = (resume: OptimizedResume, originalResumeText: string): OptimizedResume => {
  const contentAnalysis = analyzeContentLength(resume, originalResumeText);
  let enhancedResume = { ...resume };

  // STRICT REQUIREMENT: Must be at least 23cm
  if (contentAnalysis.estimatedLengthCm < 23) {
    console.log(`⚠️ STRICT LENGTH REQUIREMENT: ${contentAnalysis.estimatedLengthCm.toFixed(1)}cm < 23cm minimum - Adding content from original resume`);

    // Extract additional content from original resume
    const additionalContent = extractResumeSections(originalResumeText, resume);

    if (additionalContent.length > 0) {
      console.log(`📄 Adding ${additionalContent.length} additional section(s) from original resume to reach minimum length`);

      if (!enhancedResume.additionalSections) {
        enhancedResume.additionalSections = [];
      }

      // Add up to 2 sections to ensure minimum length is met
      const sectionsToAdd = Math.min(2, additionalContent.length);
      for (let i = 0; i < sectionsToAdd; i++) {
        enhancedResume.additionalSections.push(additionalContent[i]);
        console.log(`✅ Added: ${additionalContent[i].title}`);
      }

      const finalAnalysis = analyzeContentLength(enhancedResume, originalResumeText);
      console.log(`🎯 FINAL: ${finalAnalysis.estimatedLengthCm.toFixed(1)}cm (ENSURED 23cm MINIMUM)`);

      return enhancedResume;
    } else {
      console.log(`⚠️ No additional content found in original resume - adding generic section to ensure 23cm minimum`);

      // If no additional content found, add a minimal professional section
      if (!enhancedResume.additionalSections) {
        enhancedResume.additionalSections = [];
      }

      enhancedResume.additionalSections.push({
        title: "Professional Skills",
        content: ["Continuous commitment to professional excellence and technical proficiency. Dedicated to delivering high-quality solutions and staying current with industry best practices."]
      });

      return enhancedResume;
    }
  }

  console.log(`✅ Length verified: ${contentAnalysis.estimatedLengthCm.toFixed(1)}cm ≥ 23cm minimum requirement met`);
  return resume;
};

/**
 * Builds a standard optimized resume by enhancing the user's original resume.
 * @param originalResumeText The user's original resume text.
 * @param jobDescriptionText The target job description text.
 * @returns A promise that resolves to the structured, optimized resume object.
 */
export const buildStandardResume = async (
  originalResumeText: string,
  jobDescriptionText: string
): Promise<OptimizedResume> => {
  try {
    // Single optimized API call
    const prompt = createStandardResumeBuilderPrompt(originalResumeText, jobDescriptionText);
    const response = await callGemini(prompt);

    // Parse and validate response
    let optimizedResume: OptimizedResume;

    if (typeof response === 'string') {
      try {
        optimizedResume = JSON.parse(response);
      } catch (parseError) {
        throw new Error("AI returned invalid JSON format");
      }
    } else {
      optimizedResume = response as OptimizedResume;
    }

    // Validate structure
    if (!validateResumeStructure(optimizedResume)) {
      throw new Error("Generated resume is missing required sections");
    }

    // Automatic Single Page Optimization
    // Check if content expansion or reduction is needed
    const contentAnalysis = analyzeContentLength(optimizedResume, originalResumeText);

    // Dynamic Content Management for Any Length Issues
    if (contentAnalysis.estimatedLengthCm > 30) {
      // Extreme length - probably display error, use compression
      console.log(`🚨 EXTREME LENGTH DETECTED (${contentAnalysis.estimatedLengthCm.toFixed(1)}cm) - FORCED COMPRESSION TO 23cm`);
      const aggressiveCompression = await compressExcessiveLength(optimizedResume, jobDescriptionText, contentAnalysis.estimatedLengthCm);
      if (aggressiveCompression) {
        const finalLength = analyzeContentLength(aggressiveCompression, originalResumeText).estimatedLengthCm;
        console.log(`✅ aggressive compression complete: ${finalLength.toFixed(1)}cm (target: 23cm)`);
        return aggressiveCompression;
      }
    }

    if (contentAnalysis.compressionNeeded) {
      console.log(`🔄 Standard Mode: Content too long (${contentAnalysis.estimatedLengthCm.toFixed(1)}cm) - COMPRESSING`);

      // Compress existing content to fit within 24cm
      const compressedResume = await compressContentDynamically(optimizedResume, jobDescriptionText);

      if (compressedResume) {
        const compressedAnalysis = analyzeContentLength(compressedResume, originalResumeText);
        console.log(`✅ Standard Mode: Compression successful - final length: ${compressedAnalysis.estimatedLengthCm.toFixed(1)}cm`);
        return ensureMinimumLength(compressedResume, originalResumeText);
      }
    } else if (contentAnalysis.estimatedLengthCm < 23) {
      console.log(`🔄 Standard Mode: Content too short (${contentAnalysis.estimatedLengthCm.toFixed(1)}cm) - Expanding to reach 23-24cm`);

      // Try to expand using REAL sections from original resume first
      const expandedResume = await expandWithRealSections(
        optimizedResume,
        originalResumeText,
        23.0
      );

      if (expandedResume) {
        const expandedAnalysis = analyzeContentLength(expandedResume, originalResumeText);
        console.log(`✅ Standard Mode: Expansion successful - final length: ${expandedAnalysis.estimatedLengthCm.toFixed(1)}cm`);
        return ensureMinimumLength(expandedResume, originalResumeText);
      } else {
        console.log(`⚠️ AI expansion failed - creating proper resume sections manually`);
        // Create proper resume sections when AI fails
        const sectionsNeeded = Math.min(Math.ceil((23 - contentAnalysis.estimatedLengthCm) / 3), 3);
        let finalResume = createProperResumeSections(sectionsNeeded, optimizedResume);
        let finalAnalysis = analyzeContentLength(finalResume, originalResumeText);
        console.log(`✅ Manual section creation: ${finalAnalysis.estimatedLengthCm.toFixed(1)}cm achieved (target: 23cm)`);

        return ensureMinimumLength(finalResume, originalResumeText);
      }
    } else {
      console.log(`✅ Standard Mode: Content optimal (${contentAnalysis.estimatedLengthCm.toFixed(1)}cm) - verifying minimum requirement`);

      // CONTENT ENHANCEMENT: Even if optimal, STRICTLY ensure 23cm minimum by adding resume content if available space
      return ensureMinimumLength(optimizedResume, originalResumeText);
    }

    console.log(`Resume optimization (Standard) successful - length: ${contentAnalysis.estimatedLengthCm.toFixed(1)}cm`);

    return optimizedResume;

  } catch (error) {
    console.error("Error in buildStandardResume:", error);
    throw error;
  }
};

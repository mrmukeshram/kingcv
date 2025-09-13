// Export error class for external error handling
export { ResumeOptimizationError };

// Export configuration type for external use
export type { ResumeOptimizationConfig };// src/services/fully-optimized-resume.service.ts
import { callGemini } from "./gemini-client";
import { OptimizedResume } from "@/types/analysis";
import { createContentExpansionPrompt } from "@/lib/fully-optimized-prompts";

// Configuration for resume optimization
interface ResumeOptimizationConfig {
  maxRetries: number;
  tokenLimit: number;
  enableFallback: boolean;
}

const DEFAULT_CONFIG: ResumeOptimizationConfig = {
  maxRetries: 2,
  tokenLimit: 4000,
  enableFallback: true,
};

// Enhanced error types for better error handling
class ResumeOptimizationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = "ResumeOptimizationError";
  }
}

/**
 * Validates input parameters for resume optimization
 */
const validateInputs = (originalResume: string, jobDescription: string): void => {
  if (!originalResume?.trim()) {
    throw new ResumeOptimizationError(
      "Resume content is required and cannot be empty",
      "INVALID_RESUME",
      false
    );
  }

  if (!jobDescription?.trim()) {
    throw new ResumeOptimizationError(
      "Job description is required and cannot be empty",
      "INVALID_JOB_DESC",
      false
    );
  }

  // Check for reasonable length limits
  if (originalResume.length > 10000) {
    throw new ResumeOptimizationError(
      "Resume content is too long. Please shorten to under 10,000 characters",
      "RESUME_TOO_LONG",
      false
    );
  }

  if (jobDescription.length > 10000) {
    throw new ResumeOptimizationError(
      "Job description is too long. Please shorten to under 10,000 characters",
      "JOB_DESC_TOO_LONG",
      false
    );
  }
};

/**
 * Creates a comprehensive single-prompt for resume optimization
 */
const createOptimizedResumePrompt = (originalResume: string, jobDescription: string): string => {
  return `You are an expert ATS resume optimizer. Analyze the original resume and job description to create a perfectly optimized, single-page resume.

## ANALYSIS PHASE:
First, quickly analyze the resume pattern:
- **Entry Level**: Education + minimal/no work experience + few/no projects
- **Career Changer**: Experience in different field + needs repositioning
- **Experienced**: Multiple relevant roles + established career
- **Recent Graduate**: Education + some projects + internships/part-time work
- **Skills-Focused**: Strong technical skills + projects + limited traditional experience

## OPTIMIZATION RULES:

### 1. CONTENT STRATEGY BY PATTERN:
**Entry Level/Recent Graduate:**
- Expand education with relevant coursework from job requirements
- Generate 3-4 relevant projects using job-specific technologies
- Add certifications/courses related to job skills
- Include academic achievements if space allows

**Career Changer:**
- Reframe existing experience to highlight transferable skills
- Generate 2-3 projects demonstrating job-relevant skills
- Add professional development section showing commitment to new field

**Experienced Professional:**
- Optimize existing experience with job-relevant keywords
- Quantify achievements with metrics
- Add 1-2 projects if space allows or if gaps exist

**Skills-Focused:**
- Expand projects section significantly (4-5 projects)
- Add portfolio/GitHub links
- Include relevant certifications

### 2. SINGLE-PAGE OPTIMIZATION:
- **Target Length**: 600-800 words total
- **Bullet Points**: 2-3 lines each, maximum 4 bullets per role
- **Projects**: 2-3 lines each with key technologies
- **Skills**: Group related technologies (e.g., "React/Next.js/TypeScript")
- **Education**: Include only if recent graduate or career changer

### 3. ATS OPTIMIZATION:
- Extract key skills/technologies from job description
- Include exact keyword matches from job posting
- Use standard section headers
- Include quantifiable achievements where possible

### 4. PROJECT GENERATION RULES:
When generating projects (for patterns that need them):
- Use specific technologies mentioned in job description
- Create realistic project scenarios relevant to the target role
- Include measurable outcomes (users served, performance improvements, etc.)
- Ensure projects demonstrate job-required competencies

## INPUT DATA:
**Original Resume:**
${originalResume}

**Target Job Description:**
${jobDescription}

## CRITICAL INSTRUCTIONS:
1. **PRESERVE INTEGRITY**: Never fabricate work experience that doesn't exist
2. **ENHANCE EXISTING**: Optimize what's already there before generating new content
3. **SMART DECISIONS**: Only include workExperience array if it exists in original resume
4. **KEYWORD DENSITY**: Ensure high keyword match with job description
5. **SINGLE PAGE**: Content must fit on one page (estimate 600-800 words)

## REQUIRED OUTPUT FORMAT:
Return ONLY a valid JSON object with this exact structure:

\`\`\`json
{
  "header": {
    "name": "Full Name",
    "title": "Professional Title Matching Job",
    "contact": "Email | Phone | LinkedIn | Location"
  },
  "professionalSummary": "2-3 sentences highlighting relevant experience and skills with job keywords",
  "coreSkills": {
    "technical": ["skill1", "skill2", "skill3"],
    "soft": ["skill1", "skill2", "skill3"]
  },
  "workExperience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start Date - End Date",
      "achievements": [
        "Achievement with quantifiable result",
        "Achievement using job-relevant keywords"
      ]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Brief description with technologies and outcome",
      "technologies": ["tech1", "tech2", "tech3"]
    }
  ],
  "education": [
    {
      "degree": "Degree Type and Major",
      "institution": "Institution Name",
      "year": "Graduation Year",
      "relevantCoursework": ["course1", "course2"]
    }
  ],
  "additionalSections": [
    {
      "title": "Certifications",
      "content": "Certification Name - Issuing Organization (Year)"
    }
  ]
}
\`\`\`

IMPORTANT: 
- Include workExperience array ONLY if work experience exists in original resume
- If no work experience in original, exclude the workExperience array entirely
- Focus on expanding other sections (projects, education, skills) for entry-level candidates
- All generated content must be realistic and relevant to the job description`;
};

/**
 * Validates the structure of the optimized resume response
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
 * Creates a basic fallback resume when AI optimization fails
 */
const createFallbackResume = (originalResume: string, jobDescription: string): OptimizedResume => {
  // Extract basic information from original resume
  const lines = originalResume.split('\n').filter(line => line.trim());
  const name = lines[0] || "Professional Name";
  
  // Extract skills mentioned in job description
  const skillKeywords = jobDescription.toLowerCase().match(/\b(javascript|python|react|node|sql|aws|docker|kubernetes|git|agile|scrum)\b/g) || [];
  const uniqueSkills = [...new Set(skillKeywords)];

  return {
    header: {
      name: name,
      title: "Software Developer", // Generic title
      contact: "email@example.com | phone | location"
    },
    professionalSummary: "Motivated professional with experience in software development and relevant technical skills seeking new opportunities in technology.",
    coreSkills: {
      technical: uniqueSkills.slice(0, 8),
      soft: ["Problem Solving", "Team Collaboration", "Communication", "Adaptability"]
    },
    projects: [
      {
        title: "Relevant Technical Project",
        description: "Developed application using modern technologies",
        technologies: uniqueSkills.slice(0, 3)
      }
    ],
    education: [
      {
        degree: "Bachelor's Degree",
        institution: "University",
        year: "Recent",
        relevantCoursework: ["Computer Science", "Software Engineering"]
      }
    ],
    additionalSections: []
  };
};

/**
 * Builds a fully optimized, single-page resume using intelligent single-call optimization
 * @param originalResumeText The user's original resume text
 * @param jobDescriptionText The target job description text
 * @param config Optional configuration for optimization behavior
 * @returns A promise that resolves to the final optimized resume object
 */
export const buildFullyOptimizedResume = async (
  originalResumeText: string,
  jobDescriptionText: string,
  config: Partial<ResumeOptimizationConfig> = {}
): Promise<OptimizedResume> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Validate inputs
  validateInputs(originalResumeText, jobDescriptionText);

  let lastError: Error | null = null;

  // Retry logic with exponential backoff
  for (let attempt = 0; attempt < finalConfig.maxRetries; attempt++) {
    try {
      // Single optimized API call
      const prompt = createOptimizedResumePrompt(originalResumeText, jobDescriptionText);
      const response = await callGemini(prompt);

      // Parse and validate response
      let optimizedResume: OptimizedResume;
      
      if (typeof response === 'string') {
        try {
          optimizedResume = JSON.parse(response);
        } catch (parseError) {
          throw new ResumeOptimizationError(
            "AI returned invalid JSON format",
            "PARSE_ERROR",
            true
          );
        }
      } else {
        optimizedResume = response as OptimizedResume;
      }

      // Validate structure
      if (!validateResumeStructure(optimizedResume)) {
        throw new ResumeOptimizationError(
          "Generated resume is missing required sections",
          "INVALID_STRUCTURE",
          true
        );
      }

      // Success - return optimized resume
      console.log(`Resume optimization successful on attempt ${attempt + 1}`);
      return optimizedResume;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Log attempt failure
      console.warn(`Resume optimization attempt ${attempt + 1} failed:`, lastError.message);

      // If this is a retryable error and we have attempts left, continue
      if (error instanceof ResumeOptimizationError && error.retryable && attempt < finalConfig.maxRetries - 1) {
        // Exponential backoff delay
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // If non-retryable error, break immediately
      if (error instanceof ResumeOptimizationError && !error.retryable) {
        break;
      }
    }
  }

  // All retries failed - use fallback if enabled
  if (finalConfig.enableFallback) {
    console.warn("All optimization attempts failed, using fallback resume");
    try {
      return createFallbackResume(originalResumeText, jobDescriptionText);
    } catch (fallbackError) {
      throw new ResumeOptimizationError(
        "Both optimization and fallback failed",
        "TOTAL_FAILURE",
        false
      );
    }
  }

  // No fallback - throw the last error
  throw new ResumeOptimizationError(
    `Resume optimization failed after ${finalConfig.maxRetries} attempts: ${lastError?.message}`,
    "MAX_RETRIES_EXCEEDED",
    false
  );
};

/**
 * Analyzes content length and determines expansion strategy
 */
const analyzeContentLength = (resume: OptimizedResume): {
  estimatedLength: 'too_short' | 'optimal' | 'too_long';
  wordCount: number;
  expansionNeeded: boolean;
  recommendedSections: string[];
} => {
  // Calculate approximate word count
  let wordCount = 0;
  
  // Count words in each section
  wordCount += resume.professionalSummary.split(' ').length;
  wordCount += resume.coreSkills.technical.join(' ').split(' ').length;
  wordCount += resume.coreSkills.soft.join(' ').split(' ').length;
  
  if (resume.workExperience) {
    resume.workExperience.forEach(exp => {
      wordCount += exp.achievements.join(' ').split(' ').length;
    });
  }
  
  if (resume.projects) {
    resume.projects.forEach(proj => {
      wordCount += proj.description.split(' ').length;
      wordCount += proj.technologies.join(' ').split(' ').length;
    });
  }
  
  if (resume.education) {
    resume.education.forEach(edu => {
      wordCount += (edu.relevantCoursework?.join(' ') || '').split(' ').length;
    });
  }

  // Determine if expansion is needed
  let estimatedLength: 'too_short' | 'optimal' | 'too_long';
  let expansionNeeded = false;
  let recommendedSections: string[] = [];

  if (wordCount < 700) {
    estimatedLength = 'too_short';
    expansionNeeded = true;
    recommendedSections = [
      'Professional Development',
      'Technical Proficiencies', 
      'Achievements & Awards',
      'Leadership Experience',
      'Volunteer Experience',
      'Relevant Coursework'
    ];
  } else if (wordCount > 1200) {
    estimatedLength = 'too_long';
  } else {
    estimatedLength = 'optimal';
  }

  return { estimatedLength, wordCount, expansionNeeded, recommendedSections };
};
interface QuickAnalysisResult {
  pattern: string;
  missingSkills: string[];
  recommendations: string[];
  estimatedOptimizationTime: number;
}

/**
 * Analyzes resume content to provide insights without full optimization
 * Useful for providing quick feedback to users
 */
export const analyzeResumeQuick = async (
  originalResumeText: string,
  jobDescriptionText: string
): Promise<QuickAnalysisResult> => {
  validateInputs(originalResumeText, jobDescriptionText);

  const analysisPrompt = `Quickly analyze this resume against the job description and provide insights:

Original Resume: ${originalResumeText}
Job Description: ${jobDescriptionText}

Return JSON with:
{
  "pattern": "entry_level|career_changer|experienced|recent_graduate|skills_focused",
  "missingSkills": ["skill1", "skill2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "estimatedOptimizationTime": 10
}`;

  try {
    const response = await callGemini(analysisPrompt);
    const result = typeof response === 'string' ? JSON.parse(response) : response;
    
    // Validate response structure
    if (!result.pattern || !Array.isArray(result.missingSkills) || !Array.isArray(result.recommendations)) {
      throw new Error("Invalid analysis response structure");
    }
    
    return result as QuickAnalysisResult;
  } catch (error) {
    // Return basic analysis if AI call fails
    return {
      pattern: "unknown",
      missingSkills: ["Technical skills from job description"],
      recommendations: ["Review job requirements", "Add relevant projects"],
      estimatedOptimizationTime: 15
    };
  }
};

/**
 * Batch processes multiple resumes for the same job description
 * Useful for bulk optimization scenarios
 */
export const buildOptimizedResumesBatch = async (
  resumes: Array<{ id: string; content: string }>,
  jobDescriptionText: string,
  config: Partial<ResumeOptimizationConfig> = {}
): Promise<Array<{ id: string; resume: OptimizedResume | null; error?: string }>> => {
  const results = await Promise.allSettled(
    resumes.map(async ({ id, content }) => {
      try {
        const optimizedResume = await buildOptimizedResume(content, jobDescriptionText, config);
        return { id, resume: optimizedResume };
      } catch (error) {
        return { 
          id, 
          resume: null, 
          error: error instanceof Error ? error.message : String(error) 
        };
      }
    })
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        id: resumes[index].id,
        resume: null,
        error: result.reason?.message || "Unknown error occurred"
      };
    }
  });
};

/**
 * Estimates the optimization complexity and time
 */
export const estimateOptimizationComplexity = (originalResume: string): {
  complexity: 'low' | 'medium' | 'high';
  estimatedTime: number;
  requiredActions: string[];
} => {
  const wordCount = originalResume.split(/\s+/).length;
  const hasExperience = /experience|work|job|position/i.test(originalResume);
  const hasProjects = /project|portfolio|github|demo/i.test(originalResume);
  const hasEducation = /education|degree|university|college/i.test(originalResume);

  let complexity: 'low' | 'medium' | 'high' = 'medium';
  let estimatedTime = 10;
  const requiredActions: string[] = [];

  // Determine complexity based on existing content
  if (hasExperience && hasProjects && wordCount > 300) {
    complexity = 'low';
    estimatedTime = 5;
    requiredActions.push('Keyword optimization', 'ATS formatting');
  } else if (hasExperience || hasProjects) {
    complexity = 'medium';
    estimatedTime = 10;
    requiredActions.push('Content enhancement', 'Section generation', 'ATS optimization');
  } else {
    complexity = 'high';
    estimatedTime = 15;
    requiredActions.push('Project generation', 'Skill expansion', 'Content creation', 'ATS optimization');
  }

  return { complexity, estimatedTime, requiredActions };
};

/**
 * Main function: Builds a fully optimized, single-page resume
 * Uses a single AI call with comprehensive prompt engineering
 */
export const buildOptimizedResume = async (
  originalResumeText: string,
  jobDescriptionText: string,
  config: Partial<ResumeOptimizationConfig> = {}
): Promise<OptimizedResume> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Validate inputs first
  validateInputs(originalResumeText, jobDescriptionText);

  let lastError: Error | null = null;

  // Retry logic with intelligent error handling
  for (let attempt = 0; attempt < finalConfig.maxRetries; attempt++) {
    try {
      // Create comprehensive single prompt
      const optimizedPrompt = createOptimizedResumePrompt(originalResumeText, jobDescriptionText);
      
      // Make single AI call
      const response = await callGemini(optimizedPrompt);

      // Parse and validate response
      let optimizedResume: OptimizedResume;
      
      if (typeof response === 'string') {
        // Clean response string (remove markdown formatting if present)
        const cleanResponse = response
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
          
        try {
          optimizedResume = JSON.parse(cleanResponse);
        } catch (parseError) {
          throw new ResumeOptimizationError(
            "AI returned invalid JSON format",
            "PARSE_ERROR",
            true
          );
        }
      } else {
        optimizedResume = response as OptimizedResume;
      }

      // Validate required structure
      if (!validateResumeStructure(optimizedResume)) {
        throw new ResumeOptimizationError(
          "Generated resume is missing required sections",
          "INVALID_STRUCTURE",
          true
        );
      }

      // Additional quality checks
      if (!optimizedResume.professionalSummary || optimizedResume.professionalSummary.length < 50) {
        throw new ResumeOptimizationError(
          "Generated professional summary is too short",
          "QUALITY_CHECK_FAILED",
          true
        );
      }

      if (!optimizedResume.coreSkills.technical.length) {
        throw new ResumeOptimizationError(
          "No technical skills generated",
          "MISSING_SKILLS",
          true
        );
      }

      console.log(`Resume optimization successful on attempt ${attempt + 1}`);
      return optimizedResume;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      console.warn(`Resume optimization attempt ${attempt + 1} failed:`, lastError.message);

      // Handle different error types
      if (error instanceof ResumeOptimizationError) {
        // If non-retryable error, break immediately
        if (!error.retryable) {
          break;
        }
      } else {
        // Handle network or other errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
          lastError = new ResumeOptimizationError(
            "Network error - please check your connection and try again",
            "NETWORK_ERROR",
            true
          );
        }
      }

      // If we have attempts left and error is retryable, continue with backoff
      if (attempt < finalConfig.maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  // All retries failed - use fallback if enabled
  if (finalConfig.enableFallback) {
    console.warn("All optimization attempts failed, using fallback resume");
    try {
      return createFallbackResume(originalResumeText, jobDescriptionText);
    } catch (fallbackError) {
      throw new ResumeOptimizationError(
        "Both optimization and fallback failed. Please try again later",
        "TOTAL_FAILURE",
        false
      );
    }
  }

  // No fallback - throw specific error based on last failure
  if (lastError instanceof ResumeOptimizationError) {
    throw lastError;
  }

  throw new ResumeOptimizationError(
    `Resume optimization failed after ${finalConfig.maxRetries} attempts: ${lastError?.message || "Unknown error"}`,
    "MAX_RETRIES_EXCEEDED",
    false
  );
};

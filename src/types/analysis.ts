export interface AnalysisResult {
  matchScore: {
    total: number;
    hardSkills: number;
    softSkills: number;
    roleAlignment: number;
    atsCompatibility: number;
  };
  missingKeywords: string[];
  actionPlan: string[];
  recruiterLens: {
    positives: string[];
    redFlags: string[];
    shortlistProbability: number;
    verdict: string;
  };
  atsVerdict: {
    willAutoReject: boolean;
    reason: string;
  };
  rewriteSuggestions: {
    headline: string;
    summary: string;
    experienceBullet: string;
  };
  coverLetter: string;
}

export interface OptimizedResume {
  header: {
    name: string;
    title: string;
    contact: string;
    portfolio?: string;
  };
  professionalSummary: string;
  coreSkills: {
    technical: string[];
    soft: string[];
  };
  workExperience?: Array<{
    title: string;
    company: string;
    duration: string;
    location?: string;
    achievements: string[];
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    duration?: string;
    metrics?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    year: string;
    gpa?: string;
    relevantCoursework?: string[];
    achievements?: string[];
    activities?: string[];
  }>;
  certifications?: Array<{
    name: string;
    issuingOrganization: string;
    year: string;
    credentialId?: string;
    status?: string;
  }>;
  technicalSkills?: {
    programmingLanguages?: string[];
    frameworks?: string[];
    tools?: string[];
    databases?: string[];
    platforms?: string[];
  };
  awardsAndHonors?: Array<{
    name: string;
    organization: string;
    year: string;
    description?: string;
    impact?: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
    certification?: string;
  }>;
  volunteerExperience?: Array<{
    role: string;
    organization: string;
    duration: string;
    impact: string;
    relevantSkills?: string[];
  }>;
  publicationsAndResearch?: Array<{
    title: string;
    venue: string;
    year: string;
    role?: string;
  }>;
  additionalSections?: Array<{
    title: string;
    content: string[];
  }>;
}

// Resume analysis result interface
export interface ResumeAnalysis {
  type: 'minimal' | 'moderate' | 'maximal';
  wordCount: number;
  sections: number;
  hasExperience: boolean;
  hasProjects: boolean;
  experienceLevel: number;
  seniorityLevel: number;
  sectionsPresent: Record<string, boolean>;
  contentRichness: number;
}

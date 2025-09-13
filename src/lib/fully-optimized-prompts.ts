// src/lib/fully-optimized-prompts.ts

/**
 * Creates a comprehensive single-prompt for resume optimization
 * Replaces the previous 3-step process with one intelligent call
 */
export const createOptimizedResumePrompt = (originalResume: string, jobDescription: string): string => {
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

### 2. DYNAMIC SINGLE-PAGE OPTIMIZATION:
**CRITICAL**: Always fill the complete single page (A4 size = ~28-30 lines of content)

**IF CONTENT IS TOO SHORT (<25 lines estimated):**
- **Expand Projects**: Add detailed technical implementations, challenges overcome, results achieved
- **Add More Projects**: Generate additional relevant projects using job skills
- **Expand Education**: Add relevant coursework, academic projects, thesis details, GPA if good
- **Add New Sections**:
  - "Technical Proficiencies" (detailed breakdown of skills)
  - "Professional Development" (courses, workshops, self-learning)
  - "Achievements & Awards" (academic, professional, personal)
  - "Volunteer Experience" (if relevant to job skills)
  - "Publications/Portfolio" (if applicable)
  - "Languages" (if multilingual)
  - "Leadership Experience" (team lead, mentoring, organizing)
- **Enhance Bullet Points**: Expand from 1-2 lines to 2-3 lines with more details
- **Add Quantifiable Metrics**: Include numbers, percentages, timeframes

**TARGET SPECIFICATIONS:**
- **Total Content**: 900-1100 words (full single page)
- **Estimated Lines**: 28-30 lines of actual content
- **Bullet Points**: 2-4 lines each (longer for short resumes)
- **Projects**: 3-4 lines each with comprehensive details
- **Skills**: Expand into subcategories if needed

### 3. ATS OPTIMIZATION:
- Extract key skills/technologies from job description
- Include exact keyword matches from job posting
- Use standard section headers
- Include quantifiable achievements where possible

### 5. DYNAMIC CONTENT EXPANSION STRATEGIES:

**For Entry-Level/Students with minimal content:**
- Generate 4-5 comprehensive academic/personal projects
- Add "Relevant Coursework" with detailed descriptions
- Include "Academic Achievements" section
- Add "Professional Development" (online courses, certifications)
- Create "Technical Skills" breakdown by category
- Add "Extracurricular Activities" if leadership-focused

**For Career Changers with irrelevant experience:**
- Reframe ALL existing experience to show transferable skills
- Generate 3-4 transition projects in target field
- Add "Professional Development" section showing commitment
- Include "Self-Directed Learning" section
- Expand soft skills that transfer between industries
- Add "Industry Transition" narrative in summary

**For Experienced but Short Content:**
- Expand each work experience with more detailed achievements
- Add "Key Accomplishments" section with metrics
- Include "Technical Leadership" examples
- Add "Process Improvements" implemented
- Create "Mentoring & Training" section if applicable
- Include "Industry Recognition" or "Professional Memberships"

**CONTENT EXPANSION TECHNIQUES:**
1. **Project Details**: Add architecture decisions, challenges, solutions, impact
2. **Skill Elaboration**: Break down complex skills into specific technologies
3. **Achievement Quantification**: Add metrics, timeframes, team sizes, budget impacts
4. **Learning Journey**: Show progression and continuous improvement
5. **Collaboration Evidence**: Highlight teamwork, cross-functional projects
6. **Problem-Solving Examples**: Specific challenges overcome
### 6. PROJECT GENERATION RULES:
When generating projects (for patterns that need them):
- Use specific technologies mentioned in job description
- Create realistic project scenarios relevant to the target role
- Include measurable outcomes (users served, performance improvements, etc.)
- Ensure projects demonstrate job-required competencies
- **For Short Resumes**: Make projects more detailed with architecture, challenges, and results

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
5. **DYNAMIC LENGTH**: Always fill complete single page - expand content if too short, condense if too long
6. **CONTENT RICHNESS**: Add relevant sections to reach 900-1100 words total

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
 * Creates a prompt for expanding short resume content to fill complete single page
 * Used when initial optimization results in content that's too short
 */
export const createContentExpansionPrompt = (shortResume: string, jobDescription: string, targetSections: string[]): string => {
  return `This resume is too short and needs expansion to fill a complete single page. Apply dynamic content expansion strategies.

## EXPANSION OBJECTIVES:
- **Target**: 900-1100 words (complete single page)
- **Current Issue**: Resume is significantly under-utilizing available space
- **Goal**: Professional, comprehensive resume that showcases full potential

## DYNAMIC EXPANSION STRATEGIES:

### 1. ENHANCE EXISTING SECTIONS:
**Projects Enhancement:**
- Add technical architecture details (frontend/backend/database)
- Include specific challenges faced and solutions implemented
- Add measurable results (performance improvements, user metrics, cost savings)
- Describe development methodology used (Agile, TDD, etc.)
- Include deployment and testing strategies

**Experience Enhancement:**
- Expand bullet points with more context and impact
- Add collaboration details (team size, stakeholder management)
- Include process improvements and innovations introduced
- Quantify achievements with specific metrics and timeframes
- Describe technologies and methodologies used in detail

**Skills Enhancement:**
- Break technical skills into categories (Frontend, Backend, DevOps, etc.)
- Add proficiency levels and years of experience
- Include specific frameworks and libraries within each technology
- Add soft skills with context of how they were applied

### 2. ADD STRATEGIC SECTIONS:
Based on job requirements, intelligently add these sections:

**Professional Development:**
- Online courses and certifications related to job skills
- Conference attendance and learning initiatives
- Self-directed learning projects and skill acquisition
- Industry-relevant workshops and training

**Technical Proficiencies:**
- Detailed breakdown of technical skills by category
- Tools and technologies with proficiency levels
- Development environments and methodologies
- Version control, CI/CD, and deployment experience

**Achievements & Recognition:**
- Academic honors and scholarships
- Professional awards and recognition
- Performance metrics and KPIs achieved
- Problem-solving successes and innovations

**Leadership & Collaboration:**
- Team leadership experiences (formal or informal)
- Mentoring and training responsibilities
- Cross-functional project coordination
- Community involvement and organizing

### 3. CONTENT DEPTH STRATEGIES:
**Micro-Details That Add Value:**
- Specific metrics (increased efficiency by X%, reduced load time by Y seconds)
- Team collaboration (worked with designers, PMs, QA teams)
- Technical decisions (chose React over Vue because...)
- Learning outcomes (gained expertise in X, improved skills in Y)
- User impact (served X users, improved user experience)

**Smart Content Generation:**
- Infer logical experiences from education and skills
- Create realistic scenarios based on job requirements
- Add relevant industry knowledge and best practices
- Include problem-solving examples and analytical thinking

## INPUT DATA:
**Short Resume to Expand:**
${shortResume}

**Job Description for Context:**
${jobDescription}

**Recommended Sections to Add:**
${targetSections.join(', ')}

## EXPANSION RULES:
1. **Maintain Authenticity**: All additions must be realistic and believable
2. **Job Relevance**: Every addition should relate to job requirements
3. **Progressive Detail**: Start with most important, add supporting details
4. **Balanced Sections**: Don't over-expand one section at expense of others
5. **ATS Optimization**: Ensure keyword density remains high throughout

## REQUIRED OUTPUT:
Return the expanded resume as a comprehensive JSON object that fills a complete single page.

IMPORTANT: The expanded resume should feel substantial and professional, not padded or artificial.`;
};

/**
 * Creates a quick analysis prompt for providing instant feedback
 * Used by analyzeResumeQuick function
 */
export const createQuickAnalysisPrompt = (originalResume: string, jobDescription: string): string => {
  return `Quickly analyze this resume against the job description and provide actionable insights.

## ANALYSIS REQUIREMENTS:
1. **Pattern Identification**: Categorize the resume type
2. **Skill Gap Analysis**: What job-required skills are missing
3. **Improvement Recommendations**: Top 3 actionable suggestions
4. **Time Estimation**: How long optimization might take

## INPUT DATA:
**Original Resume:**
${originalResume}

**Job Description:**
${jobDescription}

## REQUIRED JSON OUTPUT:
\`\`\`json
{
  "pattern": "entry_level|career_changer|experienced|recent_graduate|skills_focused",
  "missingSkills": ["specific skills from job description not found in resume"],
  "recommendations": [
    "Add specific projects demonstrating X skill",
    "Include quantifiable achievements",
    "Highlight transferable skills from Y experience"
  ],
  "estimatedOptimizationTime": 10
}
\`\`\``;
};

/**
 * Creates a lightweight prompt for basic resume enhancement
 * Used as fallback when full optimization fails
 */
export const createBasicOptimizationPrompt = (originalResume: string, jobDescription: string): string => {
  return `Enhance this resume with basic ATS optimization for the given job description.

Focus on:
1. Adding job-relevant keywords
2. Improving existing bullet points
3. Ensuring proper formatting
4. Adding 1-2 relevant projects if missing

Keep the optimization minimal and safe - don't fabricate experience.

## INPUT:
**Resume:** ${originalResume}
**Job Description:** ${jobDescription}

## OUTPUT:
Return optimized resume as JSON object with standard structure.

\`\`\`json
{
  "header": {
    "name": "string",
    "title": "string",
    "contact": "string"
  },
  "professionalSummary": "string",
  "coreSkills": {
    "technical": ["string"],
    "soft": ["string"]
  },
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string",
      "relevantCoursework": ["string"]
    }
  ],
  "additionalSections": [
    {
      "title": "string",
      "content": "string"
    }
  ]
}
\`\`\``;
};

/**
 * Creates a prompt for batch resume processing
 * Optimized for processing multiple resumes for the same job
 */
export const createBatchOptimizationPrompt = (resumes: string[], jobDescription: string): string => {
  const resumeList = resumes.map((resume, index) => `**Resume ${index + 1}:**\n${resume}`).join('\n\n');

  return `Optimize these ${resumes.length} resumes for the same job description.
For each resume, apply appropriate optimization strategy based on its content pattern.

## JOB DESCRIPTION:
${jobDescription}

## RESUMES TO OPTIMIZE:
${resumeList}

## OUTPUT FORMAT:
Return JSON array with optimized resumes:
\`\`\`json
[
  {
    "resumeIndex": 1,
    "optimizedResume": { /* full resume object */ }
  },
  {
    "resumeIndex": 2,
    "optimizedResume": { /* full resume object */ }
  }
]
\`\`\``;
};

/**
 * Creates a prompt for resume quality validation
 * Used to check if generated resume meets quality standards
 */
export const createQualityValidationPrompt = (resumeJson: string, jobDescription: string): string => {
  return `Validate this generated resume against quality standards and job requirements.

## QUALITY CHECKLIST:
1. **ATS Compatibility**: Standard sections, proper formatting
2. **Keyword Density**: Job-relevant skills included
3. **Content Quality**: Quantifiable achievements, action verbs
4. **Length**: Appropriate for single page (600-800 words)
5. **Completeness**: All required sections present

## INPUT:
**Generated Resume:** ${resumeJson}
**Job Requirements:** ${jobDescription}

## OUTPUT:
\`\`\`json
{
  "qualityScore": 85,
  "passes": true,
  "issues": ["Issue 1", "Issue 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "keywordMatch": 78
}
\`\`\``;
};

/**
 * Creates a prompt for extracting skills from job descriptions
 * Useful for skill gap analysis and project generation
 */
export const createSkillExtractionPrompt = (jobDescription: string): string => {
  return `Extract all required and preferred skills from this job description.

## JOB DESCRIPTION:
${jobDescription}

## EXTRACTION RULES:
- Identify both hard and soft skills
- Include programming languages, frameworks, tools
- Note experience levels (junior, senior, etc.)
- Capture domain-specific requirements

## OUTPUT:
\`\`\`json
{
  "requiredSkills": {
    "technical": ["Python", "React", "AWS"],
    "soft": ["Leadership", "Communication"],
    "tools": ["Docker", "Jenkins", "Jira"],
    "experienceLevel": "2-4 years"
  },
  "preferredSkills": {
    "technical": ["GraphQL", "TypeScript"],
    "soft": ["Mentoring"],
    "certifications": ["AWS Solutions Architect"]
  },
  "keyCompetencies": ["Problem solving", "Team collaboration"]
}
\`\`\``;
};

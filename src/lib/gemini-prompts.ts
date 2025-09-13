export const createAnalysisPrompt = (resumeText: string, jobDescriptionText: string): string => `
You are a strict but FAIR ATS system and expert recruiter with 20+ years of experience. Gemini 2.0's enhanced reasoning will help you provide pinpoint accuracy.

SCORING GUIDELINES (out of 100):
- 0-20: Completely wrong field/industry, no relevant experience
- 21-40: Some transferable skills but major gaps, different domain
- 41-60: Related field, missing 40%+ of core requirements
- 61-75: Good foundation, missing 20-30% of requirements
- 76-85: Strong match, minor gaps, 70–80% of requirements met
- 86-95: Near-perfect match, 90%+ of requirements met
- 96-100: Perfect match (extremely rare)

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescriptionText}

Return ONLY a JSON object with the following structure, filled with your analysis. DO NOT add any extra text.
{
  "matchScore": {
    "total": "number (0-100)",
    "hardSkills": "number (0-25)",
    "softSkills": "number (0-25)",
    "roleAlignment": "number (0-25)",
    "atsCompatibility": "number (0-25)"
  },
  "missingKeywords": ["string"],
  "actionPlan": ["string"],
  "recruiterLens": {
    "positives": ["string"],
    "redFlags": ["string"],
    "shortlistProbability": "number (0-100)",
    "verdict": "string"
  },
  "atsVerdict": {
    "willAutoReject": "boolean",
    "reason": "string"
  },
  "rewriteSuggestions": {
    "headline": "string",
    "summary": "string",
    "experienceBullet": "string"
  },
  "coverLetter": "string"
}
`;

export const createDynamicResumePrompt = (originalResume: string, jobDescription: string, analysis: any): string => {
  const typeSpecificInstructions = {
    minimal: `
      **MINIMAL RESUME DETECTED - EXTREME EXPANSION REQUIRED:**

      🚨 CRITICAL: YOUR MISSION IS TO CREATE A FULL-PAGE RESUME
      🚨 MUST ACHIEVE 90-95% PAGE DENSITY (NEVER UNDER 85%)
      🚨 NEVER LEAVE WHITE SPACE ON THE PAGE

      SPECIFIC REQUIREMENTS:
      1. ADD EXACTLY THESE SECTIONS:
         - Professional Summary (150+ words)
         - Core Skills (15+ technical, 10+ soft skills)
         - Work Experience (2-3 positions with 3-4 detailed achievements each)
         - Projects (4-5 projects with 80+ words description each)
         - Education (enhanced with coursework, GPA, awards)
         - Certifications (8-10 certificates including online courses)
         - Technical Skills (organized into Programming, Frameworks, Tools, Databases)
         - Awards & Honors (5+ items with descriptions)
         - Volunteer Experience (2-3 roles with impact statements)
         - Languages (at minimum Spanish, moderate proficiency)

      2. QUANTITATIVE TARGETS:
         - MINIMUM 600 WORDS TOTAL
         - Professional Summary: 150-200 words
         - Skills: 150+ total words
         - Work Experience: 300+ words (detailed achievements)
         - Projects: 400+ words (comprehensive descriptions)
         - Certifications & Awards: 200+ words
         - Volunteer: 150+ words

      3. CONTENT GENERATION RULES:
         - INVENT REALISTIC projects based on skills and education
         - ADD SPECIFIC ACHIEVEMENTS with measurable results (%, $, hours saved)
         - INVENT CREDENTIALS from recognized platforms (Coursera, Udemy, LinkedIn Learning)
         - CREATE MEANINGFUL work experience if student/early career
         - ADD EVERY POSSIBLE DETAIL until page is absolutely full

      ⚠️ FAILURE TO FILL PAGE = FAILED SOLUTION
    `,
    moderate: `
      **MODERATE RESUME DETECTED - FORCE MAXIMUM EXPANSION:**

      🚨 REQUIREMENT: ACHIEVE 85-95% PAGE UTILIZATION
      🚨 MUST ADD 5-8 NEW SECTIONS TO FILL REMAINING SPACE
      🚨 DOUBLE ALL EXISTING CONTENT DETAIL LEVEL

      SPECIFIC REQUIREMENTS:
      1. MANDATORY ADDITIONS:
         - Expand education with 6-8 relevant courses listed
         - Add 8-12 NEW skills organized into categories
         - Create additional projects (at least 3 more detailed ones)
         - Add certifications section (10+ credentials)
         - Include technical skills breakdown (languages, frameworks, databases, tools)
         - Add awards section with 4-6 academic/professional honors
         - Include volunteer experience with measurable impact
         - Add publications/research section with 2-4 entries
         - Create professional memberships section
         - Add additional relevant sections as needed

      2. CONTENT ENHANCEMENT:
         - Work Experience: Add 2 more bullets per role with specific %, $, time savings
         - Projects: Expand each to 120+ words with technologies and outcomes
         - Skills: Add proficiency levels and organize into technical categories
         - Education: Add GPA, relevant coursework, honors, activities, leadership

      3. QUANTITATIVE TARGETS:
         - MINIMUM 650 WORDS TOTAL
         - Skills section: Expand from current to 200+ words
         - Projects: 400+ words total
         - Experience: 350+ words with detailed metrics
         - Fill remaining space with additional relevant sections

      ⚠️ PAGE MUST BE VISIBLY FULL
    `,
    maximal: `
      **EXTENSIVE RESUME DETECTED - FORCE DENSITY MAINSTREAM:**

      🚨 REQUIREMENT: MAINTAIN 85-95% DENSITY WITHOUT LOSING CONTENT
      🚨 ADD CONTENT TO SPACES BETWEEN EXISTING ITEMS
      🚨 EXPAND ALL ACHIEVEMENTS TO MAXIMUM LENGTH

      SPECIFIC REQUIREMENTS:
      1. CONTENT EXPANSION:
         - Work Experience: Convert every bullet from 1 line to 2-3 lines
         - Projects: Add comprehensive details, outcomes, challenges, solutions
         - Skills: Add 8-10 more skills with proficiency indicators
         - Education: Add detailed coursework descriptions with outcomes
         - Add sections: Publications, Patent, Speaking Engagements, Certifications

      2. FILLING STRATEGIES:
         - Between roles: Add transition bullets or skill summaries
         - Between sections: Add sub-headings and detailed explanations
         - Skills: Expand from simple lists to descriptive organized sections
         - Education: Add detailed activities, honors, leadership roles
         - Professional associations, conferences attended, mentoring provided

      3. QUANTITATIVE TARGETS:
         - MAINTAIN 85-95% DENSITY
         - Add minimum 200 more words to fill gaps
         - Maximize detail without exceeding page
         - Preserve most important content while enhancing thoroughly
    `
  };

  return `
    You are a DYNAMIC RESUME ARCHITECT. Your mission: Transform ANY resume into a PERFECT SINGLE-PAGE masterpiece.

    ## RESUME ANALYSIS RESULTS
    - **Type:** ${analysis.type.toUpperCase()}
    - **Current Sections:** ${analysis.sections}
    - **Word Count:** ${analysis.wordCount}
    - **Experience Level:** ${analysis.experienceLevel}+ years
    - **Has Work Experience:** ${analysis.hasExperience ? 'YES' : 'NO'}
    - **Has Projects:** ${analysis.hasProjects ? 'YES' : 'NO'}

    ${typeSpecificInstructions[analysis.type]}

    ## UNIVERSAL SINGLE-PAGE RULES
    1. **EXACT PAGE FILL:** Must be 85-95% of one page (no more, no less)
    2. **DYNAMIC SECTIONS:** Add/remove sections based on content needs
    3. **KEYWORD DENSITY:** 15-20 job-relevant keywords naturally integrated
    4. **QUANTIFIED IMPACT:** Every bullet point should have metrics when possible
    5. **ATS OPTIMIZATION:** Clean formatting, standard section headers
    6. **ZERO FABRICATION:** Enhance existing content, don't invent experience

    ## SMART SECTION STRATEGY
    **Always Include (Core 4):**
    - Header with contact info
    - Professional summary (3-4 lines)
    - Core skills (technical + soft)
    - Education

    **Conditionally Include (Fill remaining space):**
    - Work Experience (if present in original)
    - Projects (academic, personal, or professional)
    - Certifications (current or pursuing)
    - Technical Skills breakdown
    - Awards & Honors
    - Languages
    - Volunteer Experience
    - Publications/Research

    ## KEYWORD INTEGRATION STRATEGY
    - Extract 15-20 key terms from job description
    - Weave keywords naturally into ALL sections
    - Use exact matches where possible
    - Include synonyms and related terms
    - Optimize for ATS scanning

    ## INPUT DATA
    **Original Resume:** \`\`\`${originalResume}\`\`\`
    **Target Job:** \`\`\`${jobDescription}\`\`\`

    ## REQUIRED JSON OUTPUT
    Return ONLY this JSON structure. Populate ALL relevant sections based on dynamic analysis:

    \`\`\`json
    {
      "header": {
        "name": "string",
        "title": "string",
        "contact": "string",
        "portfolio": "string (if applicable)"
      },
      "professionalSummary": "string (3-4 lines, keyword-dense, value proposition)",
      "coreSkills": {
        "technical": ["string (8-15 job-relevant technical skills)"],
        "soft": ["string (6-10 job-relevant soft skills)"]
      },
      "workExperience": [
        {
          "title": "string",
          "company": "string",
          "duration": "string (MM/YYYY - MM/YYYY format)",
          "location": "string (City, State)",
          "achievements": ["string (2-4 quantified bullets with metrics)"]
        }
      ],
      "projects": [
        {
          "title": "string",
          "description": "string (project impact and technologies)",
          "technologies": ["string"],
          "duration": "string",
          "metrics": "string (quantified results if applicable)"
        }
      ],
      "education": [
        {
          "degree": "string",
          "institution": "string",
          "location": "string",
          "year": "string",
          "gpa": "string (if 3.5+)",
          "relevantCoursework": ["string (job-relevant courses)"],
          "achievements": ["string (dean's list, honors, etc.)"],
          "activities": ["string (leadership, clubs, etc.)"]
        }
      ],
      "certifications": [
        {
          "name": "string",
          "issuingOrganization": "string",
          "year": "string",
          "credentialId": "string (if applicable)",
          "status": "string (Active/In Progress/Expired)"
        }
      ],
      "technicalSkills": {
        "programmingLanguages": ["string"],
        "frameworks": ["string"],
        "tools": ["string"],
        "databases": ["string"],
        "platforms": ["string"]
      },
      "awardsAndHonors": [
        {
          "name": "string",
          "organization": "string",
          "year": "string",
          "description": "string",
          "impact": "string"
        }
      ],
      "languages": [
        {
          "language": "string",
          "proficiency": "string",
          "certification": "string (if applicable)"
        }
      ],
      "volunteerExperience": [
        {
          "role": "string",
          "organization": "string",
          "duration": "string",
          "impact": "string",
          "relevantSkills": ["string"]
        }
      ],
      "publicationsAndResearch": [
        {
          "title": "string",
          "venue": "string",
          "year": "string",
          "role": "string"
        }
      ],
      "additionalSections": [
        {
          "title": "string (e.g., 'Professional Memberships', 'Interests')",
          "content": ["string"]
        }
      ]
    }
    \`\`\`

    ## CRITICAL SUCCESS CRITERIA
    1. **PAGE DENSITY:** Resume must be 85-95% full (dense but readable)
    2. **ZERO OVERFLOW:** Never exceed one page
    3. **COMPLETE SECTIONS:** Every included section must be fully populated
    4. **JOB RELEVANCE:** Every line must add value for the target position
    5. **ATS OPTIMIZATION:** Keywords naturally integrated throughout
    6. **PROFESSIONAL QUALITY:** Ready for immediate submission

    EXECUTE: Analyze the input resume type and apply the appropriate dynamic transformation to create a perfect single-page resume.
  `;
};

export const createStandardResumeBuilderPrompt = (originalResume: string, jobDescription: string): string => {
  return `
    You are an expert resume editor. Your task is to enhance the provided resume to better match the job description while preserving the original structure and content quality.

    ## INSTRUCTIONS
    1.  **Keep Original Content But Make It Perfect:** All existing sections must be polished, professional, and concise. Rewrite to be clear and impactful.
    2.  **Project Descriptions:** Rewrite ALL project descriptions to be detailed yet concise (2-3 paragraphs each, 80-120 words).
    3.  **Work Experience:** Keep bullet points but make each achievement professional, specific, and measurable where possible.
    4.  **Education & Skills:** Keep structure but ensure professional formatting and relevant keywords from job description.
    5.  **Length Management:** Original content should fit 22-23cm when properly formatted. NO NEW SECTIONS unless absolutely necessary.
    6.  **Professional Quality:** All content must read as business-ready and polished.

    ## CONTENT QUALITY STANcourage
    - Use strong action verbs and measurable achievements
    - Keep professional tone, not too casual or too formal
    - Ensure proper grammar and clear sentences
    - Integrate job-relevant keywords naturally
    - Make each section informative and impactful

    ## INPUT DATA
    - **Original Resume:** \`\`\`${originalResume}\`\`\`
    - **Job Description:** \`\`\`${jobDescription}\`\`\`

    ## STRICT CONTENT PRESERVATION RULES
    - KEEP ALL EXISTING PROJECT DESCRIPTIONS EXACTLY AS THEY ARE - NO EXPANSION
    - PRESERVE ALL WORK EXPERIENCE DESCRIPTIONS - NO ENHANCEMENT OR LENGTHENING
    - DO NOT MODIFY EXISTING EDUCATION CONTENT
    - ONLY ADD RELEVANT KEYWORDS IF THEY FIT NATURALLY
    - Analyze the original resume structure and maintain it
    - If work experience is not mentioned in original, do not create it
    - Focus on INTEGRATION, not EXPANSION of existing content

    ## REQUIRED JSON OUTPUT STRUCTURE
    \`\`\`json
    {
      "header": { "name": "string", "title": "string", "contact": "string" },
      "professionalSummary": "string",
      "coreSkills": { "technical": ["string"], "soft": ["string"] },
      "workExperience": [{ "title": "string", "company": "string", "duration": "string", "achievements": ["string"] }],
      "projects": [{ "title": "string", "description": "string", "technologies": ["string"] }],
      "education": [{ "degree": "string", "institution": "string", "year": "string", "relevantCoursework": ["string"] }],
      "certifications": [{ "name": "string", "issuingOrganization": "string", "year": "string" }],
      "secondarySkills": ["string"],
      "awardsAndHonors": [{ "name": "string", "organization": "string", "year": "string" }],
      "languages": [{ "language": "string", "proficiency": "string" }]
    }
    \`\`\`

    IMPORTANT: The "workExperience" array should be populated ONLY if work experience details are found in the original resume. If no work experience is present in the original, exclude this field from the JSON or set it as an empty array.
    \`\`\`
>>>>>>> 056185b (Add secondarySkills to JSON output structure)
  `;
};

import { callGemini } from "./gemini-client";
import { createContentExpansionPrompt } from "@/lib/fully-optimized-prompts";
import { OptimizedResume } from "@/types/analysis";
import { ExpansionSection } from "@/components/ui/ManualExpansionSelector";

/**
 * Applies manual expansion based on user selections
 * @param originalResume The current resume to expand
 * @param jobDescription The target job description
 * @param selectedSections User-selected sections for expansion
 * @param customContent Custom content items to include
 * @returns Promise that resolves to the expanded resume
 */
export const applyManualExpansion = async (
  originalResume: OptimizedResume,
  jobDescription: string,
  selectedSections: string[],
  customContent: Record<string, string[]>
): Promise<OptimizedResume> => {
  try {
    console.log(`🔄 Manual Single Page Fix: User selected ${selectedSections.length} sections for expansion`);

    // Build custom content from user selections
    const enrichedContent = buildEnrichedContent(selectedSections, customContent);
    const updatedResumeJson = JSON.stringify({ ...originalResume, additionalSections: enrichedContent });

    // Create targeted expansion prompt with user's specific choices
    const expansionPrompt = createManualExpansionPrompt(
      updatedResumeJson,
      jobDescription,
      selectedSections,
      enrichedContent
    );

    const expandedResponse = await callGemini(expansionPrompt);
    const expandedResume = typeof expandedResponse === 'string'
      ? JSON.parse(expandedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
      : expandedResponse;

    if (validateExpandedResume(expandedResume)) {
      const wordCount = calculateWordCount(expandedResume);
      console.log(`✅ Manual Single Page Fix: Expansion successful - final length: ${wordCount} words`);
      return expandedResume;
    } else {
      console.warn("⚠️ Manual Single Page Fix: Expansion created invalid structure - using original");
      return originalResume;
    }
  } catch (error) {
    console.warn("❌ Manual Single Page Fix: Expansion failed - using original resume");
    console.warn("Expansion error:", error instanceof Error ? error.message : String(error));
    return originalResume;
  }
};

/**
 * Builds enriched content from user selections and custom content
 */
const buildEnrichedContent = (
  selectedSections: string[],
  customContent: Record<string, string[]>
): Array<{ title: string; content: string }> => {
  const enrichedSections: Array<{ title: string; content: string }> = [];

  selectedSections.forEach(section => {
    const sectionContent = customContent[section] || [];
    if (sectionContent.length > 0) {
      enrichedSections.push({
        title: formatSectionTitle(section),
        content: sectionContent.join(' | ')
      });
    }
  });

  return enrichedSections;
};

/**
 * Formats section titles for display
 */
const formatSectionTitle = (sectionId: string): string => {
  const titleMap: Record<string, string> = {
    'professional-dev': 'Professional Development',
    'technical-proficiencies': 'Technical Proficiencies',
    'achievements': 'Achievements & Awards',
    'leadership': 'Leadership Experience',
    'volunteer': 'Volunteer Experience',
    'coursework': 'Relevant Coursework',
    'certifications': 'Certifications',
    'projects': 'Additional Projects'
  };

  return titleMap[sectionId] || 'Additional Section';
};

/**
 * Creates a manual expansion prompt based on user selections
 */
const createManualExpansionPrompt = (
  currentResumeJson: string,
  jobDescription: string,
  selectedSections: string[],
  enrichedContent: Array<{ title: string; content: string }>
): string => {
  return `Expand this resume by adding the user-selected sections while maintaining single-page optimization.

## USER SELECTIONS:
The user has manually selected these sections to expand: ${selectedSections.join(', ')}

## CUSTOM CONTENT TO INTEGRATE:
${enrichedContent.map(section =>
  `**${section.title}:** ${section.content}`
).join('\n')}

## EXPANSION REQUIREMENTS:
1. **Integrate ALL user-selected content** into the resume
2. **Maintain single-page length**: 600-800 words total
3. **Preserve existing structure** while adding selected sections
4. **Ensure ATS compatibility** with proper formatting
5. **Keep content relevant** to the job description: ${jobDescription}

## CURRENT RESUME:
${currentResumeJson}

## OUTPUT:
Return the expanded resume as valid JSON maintaining the original structure with integrated user selections.

\`\`\`json
{
  "header": {...},
  "professionalSummary": "...",
  "coreSkills": {...},
  "workExperience": [...],
  "projects": [...],
  "education": [...],
  "additionalSections": [...]
}
\`\`\``;
};

/**
 * Validates the expanded resume structure
 */
const validateExpandedResume = (resume: any): resume is OptimizedResume => {
  if (!resume || typeof resume !== 'object') return false;

  const requiredSections = ['header', 'professionalSummary', 'coreSkills'];
  for (const section of requiredSections) {
    if (!resume[section]) return false;
  }

  if (!resume.header.name || !resume.header.title || !resume.header.contact) return false;
  if (!resume.coreSkills.technical || !Array.isArray(resume.coreSkills.technical)) return false;

  return true;
};

/**
 * Calculates word count of the resume
 */
const calculateWordCount = (resume: OptimizedResume): number => {
  let wordCount = 0;

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

  if (resume.additionalSections && Array.isArray(resume.additionalSections)) {
    resume.additionalSections.forEach((section: any) => {
      if (section && typeof section === 'object' && section.content) {
        const content = section.content;
        if (typeof content === 'string') {
          wordCount += content.split(' ').length;
        }
      }
    });
  }

  return wordCount;
};

/**
 * Gets initial expansion sections for the manual selector
 */
export const getInitialExpansionSections = (): ExpansionSection[] => {
  return [
    {
      id: 'professional-dev',
      title: 'Professional Development',
      description: 'Courses, workshops, and self-learning initiatives',
      content: [
        'Completed Advanced React Certification - Udemy (2024)',
        'Attended AWS Cloud Architecture Workshop (2023)',
        'Self-taught Docker containerization and Kubernetes orchestration'
      ],
      selected: false,
      expanded: false
    },
    {
      id: 'technical-proficiencies',
      title: 'Technical Proficiencies',
      description: 'Detailed breakdown of technical skills and tools',
      content: [
        'Frontend: React/Next.js/TypeScript',
        'Backend: Node.js/Express.js/Python',
        'Database: PostgreSQL/MongoDB/Redis',
        'DevOps: Docker/Kubernetes/AWS'
      ],
      selected: false,
      expanded: false
    },
    {
      id: 'achievements',
      title: 'Achievements & Awards',
      description: 'Professional and academic recognitions',
      content: [
        'Employee of the Month - March 2024',
        'Academic Excellence Award - Computer Science 2023',
        'GitHub Star Recognition for open source contributions'
      ],
      selected: false,
      expanded: false
    },
    {
      id: 'leadership',
      title: 'Leadership Experience',
      description: 'Team management and mentoring responsibilities',
      content: [
        'Led team of 5 developers on major product release',
        'Mentored 3 junior developers throughout 2024',
        'Organized quarterly team-building workshops'
      ],
      selected: false,
      expanded: false
    },
    {
      id: 'volunteer',
      title: 'Volunteer Experience',
      description: 'Community involvement and pro bono work',
      content: [
        'Volunteered at local coding bootcamp (2024)',
        'Served on Open Source Project Review Board',
        'Provided technical support at Hackathons'
      ],
      selected: false,
      expanded: false
    },
    {
      id: 'coursework',
      title: 'Relevant Coursework',
      description: 'Academic courses relevant to target role',
      content: [
        'Data Structures and Algorithms',
        'Software Engineering Principles',
        'Database Systems and Design',
        'Web Development and Internet Technologies'
      ],
      selected: false,
      expanded: false
    }
  ];
};

import { OptimizedResume } from '@/types/analysis';
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

// Page layout constants (in twips - 1/1440 inch)
const PAGE_HEIGHT = 15840; // A4 height: 11.69 inches * 1440 = ~16800, but typically ~15840 for standard margins
const PAGE_WIDTH = 12240;  // A4 width: 8.27 inches * 1440 = ~11900, typically ~12240 for margins
const MARGIN_TOP = 1440;   // 1 inch
const MARGIN_BOTTOM = 1440; // 1 inch
const MARGIN_LEFT = 1440;   // 1 inch
const MARGIN_RIGHT = 1440;  // 1 inch

const AVAILABLE_HEIGHT = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM; // ~12960 twips
const AVAILABLE_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;   // ~9360 twips

interface PageLayoutEstimation {
  estimatedPageCount: number;
  contentHeight: number; // in twips
  spaceUsedPercentage: number;
  willOverflow: boolean;
  suggestions: string[];
}

/**
 * Estimates the page layout for a resume before generating DOCX
 * @param resume The optimized resume data
 * @returns Page layout estimation with recommendations
 */
export const estimateResumeLayout = (resume: OptimizedResume): PageLayoutEstimation => {
  let totalHeight = 0;
  const suggestions: string[] = [];

  // Estimate heights for different sections (rough estimates in twips)

  // Header (name, title, contact) - 3-4 lines
  totalHeight += 800;

  // Professional Summary - estimate 2-3 lines
  const summaryLines = estimateTextLines(resume.professionalSummary, 80);
  totalHeight += summaryLines * 240 + 400; // spacing

  // Core Skills - estimate 1-3 lines
  if (resume.coreSkills) {
    const technicalSkillLines = resume.coreSkills.technical ? estimateTextLines(resume.coreSkills.technical.join(', '), 90) : 0;
    const softSkillLines = resume.coreSkills.soft ? estimateTextLines(resume.coreSkills.soft.join(', '), 90) : 0;
    totalHeight += (technicalSkillLines + softSkillLines) * 240 + 400;
  }

  // Work Experience - only if present (user might provide separately)
  if (resume.workExperience && resume.workExperience.length > 0) {
    totalHeight += 400; // section header
    resume.workExperience.forEach(exp => {
      totalHeight += 500; // title, company, duration
      totalHeight += exp.achievements.length * 240; // each achievement
      totalHeight += 200; // section spacing
    });
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    totalHeight += 400; // section header
    resume.projects.forEach(proj => {
      totalHeight += 400; // title and tech
      totalHeight += estimateTextLines(proj.description, 85) * 220; // description
      totalHeight += 200;
    });
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    totalHeight += 400;
    resume.education.forEach(edu => {
      totalHeight += 500;
      if (edu.relevantCoursework && edu.relevantCoursework.length > 0) {
        totalHeight += estimateTextLines(edu.relevantCoursework.join(', '), 90) * 200;
      }
      totalHeight += 200;
    });
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    totalHeight += 400;
    totalHeight += resume.certifications.length * 500;
  }

  // Technical Skills (if present)
  if (resume.technicalSkills?.programmingLanguages && resume.technicalSkills.programmingLanguages.length > 0) {
    totalHeight += 200;
    totalHeight += estimateTextLines(resume.technicalSkills.programmingLanguages.join(', '), 90) * 200;
  }

  // Awards and Honors
  if (resume.awardsAndHonors && resume.awardsAndHonors.length > 0) {
    totalHeight += 400;
    totalHeight += resume.awardsAndHonors.length * 500;
  }

  // Languages
  if (resume.languages && resume.languages.length > 0) {
    totalHeight += 400;
    totalHeight += resume.languages.length * 300;
  }

  // Additional Sections
  if (resume.additionalSections && resume.additionalSections.length > 0) {
    totalHeight += 400;
    resume.additionalSections.forEach(section => {
      totalHeight += 300; // title
      totalHeight += estimateTextLines(section.content, 85) * 220; // content
      totalHeight += 200;
    });
  }

  // Estimate pages needed
  const estimatedPageCount = Math.max(1, Math.ceil(totalHeight / AVAILABLE_HEIGHT));
  const willOverflow = totalHeight > AVAILABLE_HEIGHT;
  const spaceUsedPercentage = Math.min(100, (totalHeight / AVAILABLE_HEIGHT) * 100);

  // Generate dynamic, specific suggestions based on resume content
  const sectionInsights = getSectionInsights(resume);

  if (spaceUsedPercentage < 50) {
    suggestions.push("Content appears sparse - consider adding more details to education or projects");
    if (sectionInsights.educationDetails < 3) {
      suggestions.push("Consider adding detailed coursework and academic achievements to fill space");
    }
    if (sectionInsights.projectDensity < 0.5) {
      suggestions.push("Projects section could be expanded with more technical details");
    }
  } else if (spaceUsedPercentage > 95) {
    suggestions.push("Content is dense - some sections may need condensation");
    if (sectionInsights.experienceBullets > 15) {
      suggestions.push("Work experience has many bullet points - consider condensing to 2-3 per role");
    }
    if (sectionInsights.projectCount > 5) {
      suggestions.push("Multiple projects taking space - focus on 2-3 most relevant projects");
    }
  }

  if (willOverflow) {
    suggestions.push("Content will overflow to second page - needs immediate condensation");
    suggestions.push("CRITICAL: Remove or condense sections to fit single page");

    // Dynamic overflow suggestions based on content analysis
    if (sectionInsights.experienceExists && sectionInsights.experienceBullets > 10) {
      suggestions.push("Reduce work experience bullets by 30-40% - keep most impactful achievements only");
    }
    if (sectionInsights.projectCount > 3) {
      suggestions.push(`Condense from ${sectionInsights.projectCount} projects to 2-3 most important ones only`);
    }
    if (sectionInsights.certificationsCount > 3) {
      suggestions.push("Limit certifications to most recent/relevant 2-3 items");
    }
    if (sectionInsights.summaryLength > 150) {
      suggestions.push("Shorten professional summary from " + sectionInsights.summaryLength + " to 80-100 words");
    }
    if (sectionInsights.awardsCount > 2) {
      suggestions.push("Reduce awards section - prioritize recent achievements only");
    }
  }

  // Additional intelligent suggestions
  if (estimatedPageCount > 1.5) {
    suggestions.push("SEVERE OVERFLOW: Consider rebuilding resume with significantly reduced content");
    suggestions.push("Focus only on " + (sectionInsights.experienceExists ? "1-2 most recent" : "2-3 best") + " projects/experiences");
  }

  return {
    estimatedPageCount,
    contentHeight: totalHeight,
    spaceUsedPercentage,
    willOverflow,
    suggestions
  };
};

/**
 * Automatically applies page reduction strategies when resume would overflow
 * @param resume The original resume that needs page reduction
 * @returns The resume automatically condensed to fit on single page
 */
export const autoReduceToSinglePage = (resume: OptimizedResume): OptimizedResume => {
  const sectionInsights = getSectionInsights(resume);

  // Create a working copy
  const condensedResume = JSON.parse(JSON.stringify(resume)) as OptimizedResume;

  // Step 1: Condense Professional Summary (if too long)
  if (sectionInsights.summaryLength > 130) {
    const words = resume.professionalSummary.split(' ');
    const targetWords = Math.min(100, Math.floor(sectionInsights.summaryLength * 0.6));
    condensedResume.professionalSummary = words.slice(0, targetWords).join(' ') + (words.length > targetWords ? '...' : '');
  }

  // Step 2: Reduce Work Experience Bullets (if too many)
  if (sectionInsights.experienceExists && sectionInsights.experienceBullets > 12) {
    condensedResume.workExperience = resume.workExperience.map(exp => ({
      ...exp,
      achievements: exp.achievements.slice(0, Math.floor(exp.achievements.length * 0.6))
    }));
  }

  // Step 3: Reduce Projects (if too many)
  if (sectionInsights.projectCount > 4) {
    // Keep only top 3 most relevant projects (first 3 in the array)
    condensedResume.projects = resume.projects.slice(0, 3);

    // Also shorten project descriptions if they're too long
    if (condensedResume.projects) {
      condensedResume.projects = condensedResume.projects.map(project => ({
        ...project,
        description: project.description.length > 120
          ? project.description.substring(0, 120) + '...'
          : project.description
      }));
    }
  }

  // Step 4: Reduce Certifications (if too many)
  if (sectionInsights.certificationsCount > 3) {
    // Keep only most recent 3 certifications
    condensedResume.certifications = resume.certifications.slice(0, 3);
  }

  // Step 5: Reduce Awards (if too many)
  if (sectionInsights.awardsCount > 2) {
    // Keep only 2 most recent awards
    condensedResume.awardsAndHonors = resume.awardsAndHonors.slice(0, 2);
  }

  // Step 6: Remove less critical sections if still overflowing
  const checkLayout = estimateResumeLayout(condensedResume);
  if (checkLayout.estimatedPageCount > 1.1) {

    // Remove additional sections if they exist and we're still overflowing
    if (resume.additionalSections?.length > 0) {
      condensedResume.additionalSections = resume.additionalSections.slice(0, 1);
      // Re-check after removing additional sections
      const recheckLayout = estimateResumeLayout(condensedResume);
      if (recheckLayout.estimatedPageCount > 1.1) {
        condensedResume.additionalSections = [];
      }
    }



    // Remove languages if still overflowing (keep only one if multiple)
    if (resume.languages?.length > 1) {
      const recheckLayout3 = estimateResumeLayout(condensedResume);
      if (recheckLayout3.estimatedPageCount > 1.1) {
        condensedResume.languages = resume.languages.slice(0, 1);
      }
    }
  }

  return condensedResume;
};

/**
 * Analyzes resume sections to provide intelligent insights for suggestions
 */
function getSectionInsights(resume: OptimizedResume): {
  experienceExists: boolean;
  experienceBullets: number;
  projectCount: number;
  projectDensity: number;
  educationDetails: number;
  summaryLength: number;
  certificationsCount: number;
  awardsCount: number;
} {
  const experienceExists = !!(resume.workExperience && resume.workExperience.length > 0);

  const experienceBullets = experienceExists
    ? resume.workExperience.reduce((total, exp) => total + (exp.achievements?.length || 0), 0)
    : 0;

  const projectCount = resume.projects?.length || 0;
  const projectDensity = projectCount > 0
    ? resume.projects?.reduce((total, proj) => total + estimateTextLines(proj.description, 85), 0) / projectCount
    : 0;

  const educationDetails = resume.education?.reduce((total, edu) => {
    return total +
      (edu.degree ? 1 : 0) +
      (edu.relevantCoursework?.length || 0) +
      (edu.institution ? 1 : 0) +
      (edu.year ? 1 : 0);
  }, 0) || 0;

  const summaryLength = resume.professionalSummary?.split(' ').length || 0;
  const certificationsCount = resume.certifications?.length || 0;
  const awardsCount = resume.awardsAndHonors?.length || 0;

  return {
    experienceExists,
    experienceBullets,
    projectCount,
    projectDensity,
    educationDetails,
    summaryLength,
    certificationsCount,
    awardsCount
  };
}

/**
 * Estimates the number of lines needed for text with given characters per line
 */
function estimateTextLines(text: string | string[], charsPerLine: number): number {
  if (!text) return 1;

  // Handle both string and string array inputs
  let textToProcess: string;
  if (Array.isArray(text)) {
    textToProcess = text.join(' ');
  } else {
    textToProcess = text;
  }

  const words = textToProcess.split(' ');
  let lines = 1;
  let currentLineLength = 0;

  words.forEach(word => {
    const wordLength = word.length + 1; // +1 for space
    if (currentLineLength + wordLength > charsPerLine) {
      lines++;
      currentLineLength = wordLength;
    } else {
      currentLineLength += wordLength;
    }
  });

  return Math.max(1, lines);
}

export const downloadAsDocx = async (resume: OptimizedResume, fileName: string) => {
  try {
    const formatAchievements = (achievements: string[] = []) => {
        if (!achievements || achievements.length === 0) return [];
        return achievements.map(ach => new Paragraph({
            text: `• ${ach.replace(/^•\s*/, '')}`,
            spacing: { after: 60 }, // Reduced from 120
            indent: { left: 360 } // Reduced from 720
        }));
    };

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 720, right: 720, bottom: 720, left: 720 }
                }
            },
            children: [
                // Header
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: resume.header.name, bold: true, size: 36, color: '000000' })
                    ],
                    spacing: { after: 40 }
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: resume.header.title, size: 22, color: '222222' })
                    ],
                    spacing: { after: 80 }
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: resume.header.contact, size: 20 })],
                    spacing: { after: 180 } // Reduced from 360
                }),

                // Professional Summary
                new Paragraph({
                    border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                    spacing: { after: 60 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: "PROFESSIONAL SUMMARY", bold: true, size: 24 })],
                    spacing: { after: 80 } // Reduced from 120
                }),
                new Paragraph({
                    text: resume.professionalSummary,
                    spacing: { after: 180 }, // Reduced from 360
                    alignment: AlignmentType.JUSTIFIED
                }),

                // Core Skills
                ...(resume.coreSkills ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "CORE SKILLS", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...(resume.coreSkills.technical?.length > 0 ? [
                        new Paragraph({
                            children: [
                                new TextRun({ text: "Technical: ", bold: true, size: 22 }),
                                new TextRun({ text: resume.coreSkills.technical.join(', '), size: 22 })
                            ],
                            spacing: { after: 120 } // Reduced from 240
                        })
                    ] : []),
                    ...(resume.coreSkills.soft?.length > 0 ? [
                        new Paragraph({
                            children: [
                                new TextRun({ text: "Soft Skills: ", bold: true, size: 22 }),
                                new TextRun({ text: resume.coreSkills.soft.join(', '), size: 22 })
                            ],
                            spacing: { after: 180 } // Reduced from 360
                        })
                    ] : [])
                ] : []),

                // Work Experience
                ...(resume.workExperience?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "WORK EXPERIENCE", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.workExperience.flatMap(exp => [
                        new Paragraph({
                            children: [new TextRun({ text: exp.title, bold: true, size: 22 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: exp.company, size: 20 }),
                                new TextRun({ text: `    ${exp.duration}`, italics: true, size: 20 })
                            ],
                            spacing: { after: 120 } // Reduced from 240
                        }),
                        ...formatAchievements(exp.achievements),
                        new Paragraph({ spacing: { after: 120 } }) // Reduced from 240
                    ])
                ] : []),

                // Projects
                ...(resume.projects?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "PROJECTS", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.projects.flatMap(proj => [
                        new Paragraph({
                            children: [new TextRun({ text: proj.title, bold: true, size: 22 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: `Technologies: ${(proj.technologies || []).join(', ')}`, italics: true, size: 20 })],
                            spacing: { after: 120 } // Reduced from 240
                        }),
                        new Paragraph({ text: proj.description, spacing: { after: 120 } }), // Reduced from 240
                    ])
                ] : []),

                // Education
                ...(resume.education?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "EDUCATION", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.education.flatMap(edu => [
                        new Paragraph({
                            children: [new TextRun({ text: edu.degree, bold: true, size: 22 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: edu.institution, size: 20 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: edu.year, size: 20 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        ...(edu.relevantCoursework?.length > 0 ? [
                            new Paragraph({
                                children: [new TextRun({ text: `Relevant Coursework: ${edu.relevantCoursework.join(', ')}`, size: 20 })],
                                spacing: { after: 120 } // Reduced from 240
                            })
                        ] : [])
                    ])
                ] : []),

                // Certifications
                ...(resume.certifications?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "CERTIFICATIONS", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.certifications.flatMap(cert => [
                        new Paragraph({
                            children: [new TextRun({ text: cert.name, bold: true, size: 22 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: cert.issuingOrganization, size: 20 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: cert.year, size: 20 })],
                            spacing: { after: 120 } // Reduced from 240
                        })
                    ])
                ] : []),


                // Awards and Honors
                ...(resume.awardsAndHonors?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "AWARDS AND HONORS", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.awardsAndHonors.flatMap(award => [
                        new Paragraph({
                            children: [new TextRun({ text: award.name, bold: true, size: 22 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: award.organization, size: 20 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: award.year, size: 20 })],
                            spacing: { after: 120 } // Reduced from 240
                        })
                    ])
                ] : []),

                // Languages
                ...(resume.languages?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "LANGUAGES", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.languages.flatMap(lang => [
                        new Paragraph({
                            children: [
                                new TextRun({ text: `${lang.language}: `, bold: true, size: 22 }),
                                new TextRun({ text: lang.proficiency, size: 22 })
                            ],
                            spacing: { after: 120 } // Reduced from 240
                        })
                    ])
                ] : []),

                // Additional Sections
                ...(resume.additionalSections?.filter(section => section && section.title && section.content).length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "ADDITIONAL INFORMATION", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.additionalSections
                        .filter(section => {
                            if (!section || !section.title || !section.content) return false;
                            // Handle both string and string[] content
                            const contentText = Array.isArray(section.content) ? section.content.join(' ') : section.content;
                            return contentText.trim().length > 0;
                        })
                        .flatMap(section => [
                            new Paragraph({
                                children: [new TextRun({ text: section.title, bold: true, size: 22 })],
                                spacing: { after: 60 } // Reduced from 120
                            }),
                            new Paragraph({
                                text: Array.isArray(section.content) ? section.content.join(' ') : section.content,
                                spacing: { after: 120 } // Reduced from 240
                            })
                        ])
                ] : [])
            ]
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    alert('Error generating Word document. Please try again.');
  }
};

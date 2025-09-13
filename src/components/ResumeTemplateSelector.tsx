import React, { useState } from 'react';
import { Button } from './ui/button';
import ModernCard from './ui/ModernCard';
import { ArrowLeft, Bot, Briefcase, Palette, Code, TrendingUp, GraduationCap, CheckCircle } from 'lucide-react';

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  atsScore: number;
  bestFor: string[];
  preview: string;
  features: string[];
}

const templates: ResumeTemplate[] = [
  {
    id: 'ats_optimized',
    name: 'ATS Optimized',
    description: 'Maximum keyword density for bot scanning',
    icon: Bot,
    atsScore: 98,
    bestFor: ['Corporate roles', 'Large companies', 'Automated screening'],
    preview: 'Clean, structured format with maximum keyword integration',
    features: ['Keyword-heavy', 'Simple formatting', 'ATS-friendly structure', 'Quantified achievements']
  },
  {
    id: 'executive_premium',
    name: 'Executive Premium',
    description: 'Leadership-focused professional presentation',
    icon: Briefcase,
    atsScore: 92,
    bestFor: ['Senior positions', 'C-level roles', 'Leadership positions'],
    preview: 'Executive summary with strategic accomplishments',
    features: ['Leadership emphasis', 'Strategic achievements', 'Executive summary', 'Board-ready format']
  },
  {
    id: 'modern_creative',
    name: 'Modern Creative',
    description: 'Design-forward with visual appeal',
    icon: Palette,
    atsScore: 85,
    bestFor: ['Creative roles', 'Startups', 'Design positions'],
    preview: 'Visually appealing with modern typography',
    features: ['Modern design', 'Visual elements', 'Creative layout', 'Brand-focused']
  },
  {
    id: 'tech_specialist',
    name: 'Tech Specialist',
    description: 'Developer-focused technical presentation',
    icon: Code,
    atsScore: 95,
    bestFor: ['Engineering roles', 'Tech companies', 'Developer positions'],
    preview: 'Technical skills prominent with project highlights',
    features: ['Technical skills focus', 'Project showcases', 'Code examples', 'Tech stack emphasis']
  },
  {
    id: 'sales_professional',
    name: 'Sales Professional',
    description: 'Results-driven achievement focus',
    icon: TrendingUp,
    atsScore: 90,
    bestFor: ['Sales roles', 'Business development', 'Revenue positions'],
    preview: 'Numbers-heavy with revenue achievements',
    features: ['Revenue focus', 'Achievement metrics', 'Growth statistics', 'Performance data']
  },
  {
    id: 'academic_research',
    name: 'Academic Research',
    description: 'Education and research emphasis',
    icon: GraduationCap,
    atsScore: 88,
    bestFor: ['Academic positions', 'Research roles', 'Education sector'],
    preview: 'Publications and research highlighted',
    features: ['Research emphasis', 'Publications list', 'Academic credentials', 'Conference presentations']
  }
];

interface ResumeTemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  onBack: () => void;
}

const ResumeTemplateSelector: React.FC<ResumeTemplateSelectorProps> = ({ onSelectTemplate, onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    // Add slight delay for visual feedback
    setTimeout(() => {
      onSelectTemplate(templateId);
    }, 300);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
        <Button onClick={onBack} variant="outline" className="group w-full md:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Analysis
        </Button>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          Choose Your Perfect Template
        </h1>
        <div className="hidden md:block w-24"></div>
      </div>

      <p className="text-center text-muted-foreground mb-6 md:mb-8 text-base md:text-lg">
        Select a template optimized for your target role. Each template is designed for maximum ATS compatibility and recruiter appeal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          const isHovered = hoveredTemplate === template.id;
          
          return (
            <ModernCard 
              key={template.id}
              variant="interactive"
              className={`
                relative cursor-pointer transition-all duration-300 overflow-hidden
                ${isSelected ? 'ring-2 ring-primary scale-105' : ''}
                ${isHovered ? 'scale-102 shadow-2xl' : ''}
              `}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              onClick={() => handleSelectTemplate(template.id)}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center animate-scale-in">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                  </div>
                </div>
              )}

              {/* ATS Score Badge */}
              <div className="absolute top-3 left-3 z-10">
                <div className={`
                  px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold
                  ${template.atsScore >= 95 ? 'bg-green-500/20 text-green-400' : 
                    template.atsScore >= 90 ? 'bg-blue-500/20 text-blue-400' : 
                    'bg-purple-500/20 text-purple-400'}
                `}>
                  {template.atsScore}% ATS
                </div>
              </div>

              <div className="p-4 md:p-6 pt-10 md:pt-12">
                {/* Template Header */}
                <div className="text-center mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">{template.name}</h3>
                  <p className="text-muted-foreground text-sm">{template.description}</p>
                </div>

                {/* Preview */}
                <div className="mb-4 p-3 md:p-4 bg-muted/30 rounded-lg text-center text-xs md:text-sm text-muted-foreground border-2 border-dashed border-muted/50">
                  {template.preview}
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Key Features:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {template.features.map((feature, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best For */}
                <div className="mb-4 md:mb-6">
                  <h4 className="text-sm font-semibold mb-2">Best For:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.bestFor.map((role, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Select Button */}
                <Button 
                  className={`
                    w-full transition-all duration-300 min-h-[44px]
                    ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                    ${isHovered ? 'scale-105' : ''}
                  `}
                  variant={isSelected ? "default" : "outline"}
                  disabled={isSelected}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Selected
                    </>
                  ) : (
                    'Select Template'
                  )}
                </Button>
              </div>
            </ModernCard>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="mt-6 md:mt-8 text-center">
        <p className="text-muted-foreground text-sm">
          Not sure which template to choose? The <strong>ATS Optimized</strong> template works great for most roles.
        </p>
      </div>
    </div>
  );
};

export default ResumeTemplateSelector;

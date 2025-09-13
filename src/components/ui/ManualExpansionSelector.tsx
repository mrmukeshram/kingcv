import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus, Minus, Edit3, Trash2, Check, X } from 'lucide-react';

export interface ExpansionSection {
  id: string;
  title: string;
  description: string;
  content: string[];
  selected: boolean;
  expanded: boolean;
}

export interface ManualExpansionSelectorProps {
  sections: ExpansionSection[];
  onSectionToggle: (sectionId: string) => void;
  onContentAdd: (sectionId: string, newContent: string) => void;
  onContentEdit: (sectionId: string, contentIndex: number, newContent: string) => void;
  onContentDelete: (sectionId: string, contentIndex: number) => void;
  onApplyExpansion: () => void;
  isLoading?: boolean;
  totalSelectedContent?: number;
  className?: string;
}

export const ManualExpansionSelector: React.FC<ManualExpansionSelectorProps> = ({
  sections,
  onSectionToggle,
  onContentAdd,
  onContentEdit,
  onContentDelete,
  onApplyExpansion,
  isLoading = false,
  totalSelectedContent = 0,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [editingContent, setEditingContent] = useState<{sectionId: string, contentIndex: number} | null>(null);
  const [editValue, setEditValue] = useState('');

  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const startEditing = (sectionId: string, contentIndex: number, currentContent: string) => {
    setEditingContent({ sectionId, contentIndex });
    setEditValue(currentContent);
  };

  const cancelEditing = () => {
    setEditingContent(null);
    setEditValue('');
  };

  const saveEditing = () => {
    if (editingContent) {
      onContentEdit(editingContent.sectionId, editingContent.contentIndex, editValue);
      setEditingContent(null);
      setEditValue('');
    }
  };

  const addNewContent = (sectionId: string) => {
    const newContent = window.prompt('Enter new content:');
    if (newContent && newContent.trim()) {
      onContentAdd(sectionId, newContent.trim());
    }
  };

  const selectedSectionsCount = sections.filter(s => s.selected).length;
  const totalContentItems = sections.reduce((sum, s) => sum + (s.selected ? s.content.length : 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            📄 Manual Single Page Expansion
          </h3>
          <p className="text-sm text-gray-600">
            Select sections and customize content to expand your resume
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 mb-1">
            {selectedSectionsCount} sections • {totalContentItems} items selected
          </div>
          <button
            onClick={onApplyExpansion}
            disabled={totalSelectedContent === 0 || isLoading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              totalSelectedContent > 0 && !isLoading
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Applying...' : 'Apply Expansion'}
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
            animate={{ height: expandedSections.has(section.id) ? 'auto' : '60px' }}
            transition={{ duration: 0.3 }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={section.selected}
                  onChange={() => onSectionToggle(section.id)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{section.title}</h4>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleSectionExpansion(section.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                {expandedSections.has(section.id) ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Section Content */}
            <AnimatePresence>
              {expandedSections.has(section.id) && section.selected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100 bg-white"
                >
                  <div className="p-4">
                    {/* Content Items */}
                    {section.content.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {section.content.map((content, contentIndex) => (
                          <div key={contentIndex} className="flex items-start space-x-2">
                            <div className="flex-1">
                              {editingContent?.sectionId === section.id && editingContent?.contentIndex === contentIndex ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Edit content..."
                                  />
                                  <button
                                    onClick={saveEditing}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                  <span className="text-sm text-gray-700 flex-1">{content}</span>
                                  <div className="flex items-center space-x-1 ml-2">
                                    <button
                                      onClick={() => startEditing(section.id, contentIndex, content)}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                      title="Edit"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => onContentDelete(section.id, contentIndex)}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-3">No content items yet</p>
                      </div>
                    )}

                    {/* Add New Content Button */}
                    <button
                      onClick={() => addNewContent(section.id)}
                      className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Content Item
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Summary Footer */}
      {totalSelectedContent > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200"
        >
          <h5 className="font-medium text-purple-900 mb-2">Expansion Summary</h5>
          <div className="text-sm text-purple-700 space-y-1">
            <p>• {selectedSectionsCount} sections selected</p>
            <p>• {totalContentItems} content items will be added</p>
            <p>• Approximately {totalSelectedContent * 25} words will be added</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManualExpansionSelector;

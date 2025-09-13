import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowUp, ArrowDown, Zap, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';

export type SinglePageFixStatus = 'analyzing' | 'optimal' | 'expanding' | 'reducing' | 'failed';

interface SinglePageFixCardProps {
  status: SinglePageFixStatus;
  wordCount?: number;
  estimatedLength?: 'too_short' | 'optimal' | 'too_long';
  className?: string;
}

export const SinglePageFixCard: React.FC<SinglePageFixCardProps> = ({
  status,
  wordCount,
  estimatedLength,
  className = ''
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'analyzing':
        return {
          icon: <Zap className="w-5 h-5 text-blue-500" />,
          title: "Analyzing Content",
          message: "Checking resume length for single-page fit...",
          bgColor: "from-blue-500/10 to-blue-600/10",
          borderColor: "border-blue-500/30",
          textColor: "text-blue-600"
        };
      case 'optimal':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          title: "Perfect Single Page",
          message: `${wordCount} words - optimal length achieved!`,
          bgColor: "from-green-500/10 to-green-600/10",
          borderColor: "border-green-500/30",
          textColor: "text-green-600"
        };
      case 'expanding':
        return {
          icon: <ArrowUp className="w-5 h-5 text-purple-500" />,
          title: "Expanding Content",
          message: `${wordCount} words - adding sections to fill page...`,
          bgColor: "from-purple-500/10 to-purple-600/10",
          borderColor: "border-purple-500/30",
          textColor: "text-purple-600"
        };
      case 'reducing':
        return {
          icon: <ArrowDown className="w-5 h-5 text-orange-500" />,
          title: "Optimizing Length",
          message: `${wordCount} words - condensing for single-page fit`,
          bgColor: "from-orange-500/10 to-orange-600/10",
          borderColor: "border-orange-500/30",
          textColor: "text-orange-600"
        };
      case 'failed':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          title: "Expansion Failed",
          message: "Using optimized version - continue with process",
          bgColor: "from-red-500/10 to-red-600/10",
          borderColor: "border-red-500/30",
          textColor: "text-red-600"
        };
      default:
        return {
          icon: <Zap className="w-5 h-5 text-gray-500" />,
          title: "Single Page Fix",
          message: "Preparing your resume...",
          bgColor: "from-gray-500/10 to-gray-600/10",
          borderColor: "border-gray-500/30",
          textColor: "text-gray-600"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-r ${config.bgColor} border ${config.borderColor} rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center space-x-3">
        <motion.div
          animate={status === 'analyzing' ? { rotate: 360 } : {}}
          transition={status === 'analyzing' ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
        >
          {config.icon}
        </motion.div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm ${config.textColor} mb-1`}>
            📄 Single Page Fix
          </h4>
          <p className="text-sm font-medium text-gray-800 mb-1">
            {config.title}
          </p>
          <p className="text-xs text-gray-600">
            {config.message}
          </p>
        </div>
      </div>

      {/* Progress indicator for expansion/reduction */}
      {(status === 'expanding' || status === 'reducing') && (
        <div className="mt-3 pt-3 border-t border-gray-200/50">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Content Length</span>
            <span>{wordCount} / 700+ words</span>
          </div>
          <div className="w-full bg-gray-200/50 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                estimatedLength === 'too_short' ? 'bg-purple-500' : 'bg-orange-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((wordCount! / 800) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SinglePageFixCard;

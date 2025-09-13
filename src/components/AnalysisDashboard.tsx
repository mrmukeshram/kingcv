import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResult } from '@/types/analysis';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowLeft, Target, Shield, Star, Zap, Search, User, CheckCircle, AlertTriangle, TrendingUp, Award, Brain, BarChart3 } from 'lucide-react';
import '@/components/ui/ScoreCard.css';
// --- EnhancedModernCard Component with Modern Shape ---
interface EnhancedModernCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'floating' | 'accent';
  accentColor?: string;
}
const EnhancedModernCard: React.FC<EnhancedModernCardProps> = React.memo(({
  children,
  className = '',
  variant = 'default',
  accentColor = 'from-gray-300 to-gray-400'
}) => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, duration: number, delay: number, hue: number}>>([]);
  useEffect(() => {
    if (variant === 'accent') {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 1.5,
        duration: 4 + Math.random() * 12,
        delay: Math.random() * 6,
        hue: accentColor.includes('blue') ? 220 : 
             accentColor.includes('purple') ? 270 : 
             accentColor.includes('pink') ? 330 : 
             accentColor.includes('red') ? 0 : 
             accentColor.includes('green') ? 120 : 
             accentColor.includes('cyan') ? 180 : 
             Math.random() * 360
      }));
      setParticles(newParticles);
    }
  }, [variant, accentColor]);
  const baseClasses = "relative bg-white/90 backdrop-blur-md rounded-[40px] p-6 md:p-8 shadow-2xl border border-white overflow-hidden transition-all duration-500";
  const variantClasses = variant === 'floating' 
    ? "hover:shadow-2xl hover:-translate-y-3 group" 
    : variant === 'accent' 
      ? "" 
      : "";
  return (
    <motion.div
      className={`${baseClasses} ${variantClasses} ${className}`}
      whileHover={variant === 'floating' ? { y: -8 } : {}}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {variant === 'accent' && (
        <>
          <motion.div 
            className="absolute inset-0 rounded-[40px] opacity-20 blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.35, 0.2]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${accentColor}`}></div>
          </motion.div>
          <div className="absolute inset-4 overflow-hidden rounded-[40px] pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  backgroundColor: `hsla(${particle.hue}, 85%, 70%, ${0.2 + Math.random() * 0.3})`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  boxShadow: `0 0 ${particle.size * 2}px hsla(${particle.hue}, 85%, 70%, 0.5)`
                }}
                initial={{ opacity: 0 }}
                animate={{ 
                  y: [0, -(25 + particle.size * 5), 0],
                  x: [0, (Math.random() - 0.5) * 50, 0],
                  opacity: [0, Math.min(0.6, particle.size / 5), 0],
                  scale: [1, particle.size / 3, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: particle.delay
                }}
              />
            ))}
          </div>
        </>
      )}
      {variant === 'floating' && (
        <>
          <div className="absolute inset-0 rounded-[40px] overflow-hidden opacity-0 group-hover:opacity-15 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200"></div>
          </div>
          <div className="absolute inset-0 rounded-[40px] overflow-hidden opacity-0 group-hover:opacity-10 transition-opacity duration-500">
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.9),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
          </div>
        </>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
});
// --- EnhancedAnimatedCircularScore Component ---
interface EnhancedAnimatedCircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}
const EnhancedAnimatedCircularScore: React.FC<EnhancedAnimatedCircularScoreProps> = React.memo(({
  score,
  size = 190,
  strokeWidth = 14
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const [rings, setRings] = useState<Array<{id: number, size: number, duration: number, delay: number, color: string}>>([]);
  const [particles, setParticles] = useState<Array<{id: number, angle: number, distance: number, size: number, duration: number, hue: number}>>([]);
  useEffect(() => {
    const newRings = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      size: size + i * 40,
      duration: 12 + i * 3,
      delay: i * 0.7,
      color: i % 2 === 0 ? '#3b82f6' : '#8b5cf6'
    }));
    setRings(newRings);
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      angle: Math.random() * 360,
      distance: radius + 35 + Math.random() * 45,
      size: Math.random() * 7 + 2,
      duration: 2 + Math.random() * 6,
      hue: (i * 15) % 360
    }));
    setParticles(newParticles);
  }, [size, radius]);
  return (
    <div className="relative inline-flex items-center justify-center">
      {rings.map((ring) => (
        <motion.div
          key={`ring-${ring.id}`}
          className="absolute rounded-full border"
          style={{
            width: `${ring.size}px`,
            height: `${ring.size}px`,
            borderColor: ring.color,
            opacity: 0.2
          }}
          animate={{ 
            rotate: 360,
            scale: [1, 1.03, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ 
            rotate: { duration: ring.duration, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      ))}
      {particles.map((particle) => {
        const radian = (particle.angle * Math.PI) / 180;
        const x = Math.cos(radian) * particle.distance;
        const y = Math.sin(radian) * particle.distance;
        return (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute rounded-full"
            style={{
              backgroundColor: `hsl(${particle.hue}, 90%, 65%)`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `calc(50% + ${x}px - ${particle.size/2}px)`,
              top: `calc(50% + ${y}px - ${particle.size/2}px)`,
              boxShadow: `0 0 ${particle.size * 1.5}px hsl(${particle.hue}, 90%, 65%)`
            }}
            animate={{ 
              rotate: [particle.angle, particle.angle + 360],
              scale: [1, 1.6, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              rotate: { duration: particle.duration, repeat: Infinity, ease: "linear" },
              scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        );
      })}
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        className="transform -rotate-90"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth * 0.7}
          fill="none"
          className="text-gray-200"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#enhancedScoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="enhancedScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="25%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="75%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]"
          style={{ textShadow: '0 0 12px rgba(139, 92, 246, 0.4)' }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 18 }}
          whileHover={{ scale: 1.1 }}
        >
          {score}
        </motion.span>
        <span className="text-base md:text-lg font-bold text-gray-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">/100</span>
      </div>
    </div>
  );
});
// --- Enhanced ScoreCard Component ---
interface EnhancedScoreCardProps {
  icon: React.ElementType;
  label: string;
  score: number;
  max: number;
  color: string;
  description: string;
}
const EnhancedScoreCard: React.FC<EnhancedScoreCardProps> = React.memo(({ icon: Icon, label, score, max, color, description }) => {
  const clampedScore = Math.min(score, max);
  const percentage = (clampedScore / max) * 100;
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      data-type={
        label === "Technical Skills" ? "technical" :
        label === "Soft Skills" ? "soft" :
        label === "Role Alignment" ? "role" :
        label === "ATS Compatibility" ? "ats" : ""
      }
      className="group relative bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 shadow-xl overflow-hidden score-card-square"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -7 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div 
        className="absolute inset-0 rounded-[24px] md:rounded-[32px] opacity-0"
        style={{ 
          background: `radial-gradient(circle at center, ${color.split(' ')[0].replace('from-', '')}40, transparent 70%)` 
        }}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.4 }}
      />
      <div className="relative z-10 score-card-content">
        <div className="flex items-center justify-between mb-3 md:mb-4 score-card-header">
          <motion.div 
            className={`score-card-icon ${color} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg w-12 h-12 md:w-14 md:h-14`}
            animate={isHovered ? { 
              scale: 1.2,
              rotate: [0, 15, -15, 0],
              boxShadow: [
                `0 0 0px 0px ${color.split(' ')[0].replace('from-', '')}80`,
                `0 0 0px 15px ${color.split(' ')[0].replace('from-', '')}00`,
                `0 0 0px 0px ${color.split(' ')[0].replace('from-', '')}80`,
              ]
            } : { scale: 1 }}
            transition={{ 
              scale: { type: "spring", stiffness: 350 },
              rotate: { duration: 0.7 },
              boxShadow: { duration: 1.2 }
            }}
          >
            <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </motion.div>
          <div className="text-right">
            <motion.div 
              className="score-card-score text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-900"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 220 }}
            >
              {clampedScore}
            </motion.div>
            <div className="text-xs font-medium text-gray-500">/{max}</div>
          </div>
        </div>
        <h3 className="score-card-title text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">{label}</h3>
        <p className="score-card-description text-xs text-gray-600 mb-3 md:mb-4">{description}</p>
        <div className="score-card-progress relative">
          <div className="score-card-progress-labels flex justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">0</span>
            <motion.span 
              className="score-card-percentage text-xs font-bold text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {percentage.toFixed(0)}%
            </motion.span>
            <span className="text-xs font-semibold text-gray-700">{max}</span>
          </div>
          <div className="score-card-progress-bar overflow-hidden h-2.5 md:h-3.5 text-xs flex rounded-full bg-gray-200 shadow-inner">
            <motion.div 
              className={`shadow-md rounded-full relative ${color}`}
              style={{ width: '0%' }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full opacity-40"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)',
                }}
                animate={{ x: ['-100%', '250%'] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
interface AnalysisDashboardProps {
  results: AnalysisResult;
  onBack: () => void;
  onBuildResume?: () => void;
  optimizationLevel: 'STANDARD' | 'MAXIMUM';
  setOptimizationLevel: (level: 'STANDARD' | 'MAXIMUM') => void;
}
const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ results, onBack, onBuildResume, optimizationLevel, setOptimizationLevel }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScoreAnimated, setIsScoreAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    const animation = animate(count, results.matchScore.total, {
      duration: 2,
      ease: "easeOut",
      delay: 0.8,
    });
    return () => animation.stop();
  }, [results.matchScore.total]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScoreAnimated(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };
  const handleBuildResume = () => {
    if (onBuildResume) {
      onBuildResume();
    }
  };
  const atsStatus = results.atsVerdict.willAutoReject
    ? { text: "AUTO-REJECT", colorClass: "from-red-500 to-pink-500", bgColor: "bg-red-50", textColor: "text-red-800", icon: "❌", borderGradient: { from: 'from-red-500', via: 'via-orange-500', to: 'to-pink-500' } }
    : { text: "APPROVED", colorClass: "from-green-500 to-emerald-500", bgColor: "bg-green-50", textColor: "text-green-800", icon: "✅", borderGradient: { from: 'from-green-500', via: 'via-teal-500', to: 'to-cyan-500' } };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Removed the max-w-7xl container here to eliminate the white card background */}
      <div className="relative w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Background bokeh particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`bg-particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `hsl(${Math.random() * 360}, 70%, 90%)`,
                opacity: 0.2,
                filter: 'blur(30px)',
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
              }}
              transition={{
                duration: 15 + Math.random() * 15,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <motion.h1
          className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-center"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
            Resume Analysis Dashboard
          </span>
        </motion.h1>
        <motion.p
          className="text-xs md:text-sm text-gray-600 font-medium mt-1 text-center mb-8 md:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Comprehensive Performance Breakdown
        </motion.p>
        {/* Premium Hero Score Section with Modern Border Animation */}
        <motion.div
          ref={cardRef}
          className="relative mb-8 md:mb-12 text-center overflow-visible"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onMouseMove={handleMouseMove}
          style={{
            transform: isMobile ? 'none' : `perspective(1000px) rotateX(${(mousePosition.y - 150) / 30}deg) rotateY(${(mousePosition.x - 300) / 30}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Modern Animated Gradient Border */}
          <div className="absolute inset-0 rounded-[32px] md:rounded-[40px] p-1 overflow-visible">
            <motion.div
              className="absolute inset-0 rounded-[32px] md:rounded-[40px]"
              animate={{ 
                background: [
                  'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)',
                  'conic-gradient(from 45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)',
                  'conic-gradient(from 90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)',
                  'conic-gradient(from 135deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)',
                  'conic-gradient(from 180deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)',
                  'conic-gradient(from 225deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)',
                  'conic-gradient(from 270deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)',
                  'conic-gradient(from 315deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)',
                  'conic-gradient(from 360deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)',
                ]
              }}
              transition={{ 
                background: { 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "linear" 
                }
              }}
            />
            <div className="absolute inset-[3px] md:inset-[4px] rounded-[29px] md:rounded-[36px] bg-white"></div>
          </div>
          {/* Inner Glow Effect */}
          <motion.div 
            className="absolute inset-0 rounded-[32px] md:rounded-[40px] opacity-0"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="absolute inset-0 rounded-[32px] md:rounded-[40px] bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20"></div>
          </motion.div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-[29px] md:rounded-[36px] p-5 md:p-8 shadow-xl border border-white overflow-hidden">
            {/* Confetti particles */}
            {isScoreAnimated && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={`confetti-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: `${Math.random() * 8 + 3}px`,
                      height: `${Math.random() * 8 + 3}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      background: `hsl(${Math.random() * 360}, 80%, 70%)`,
                      opacity: 0.7,
                    }}
                    animate={{
                      y: [0, -100 - Math.random() * 100],
                      x: [0, (Math.random() - 0.5) * 100],
                      opacity: [0.7, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
            <div className="relative z-10">
              <motion.div 
                className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-50 rounded-full mb-4 md:mb-6 border border-gray-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Award className="h-3.5 w-3.5 md:h-4 md:w-4 text-indigo-500" />
                <span className="font-semibold text-gray-700 text-xs md:text-sm">
                  Overall Performance Score
                </span>
              </motion.div>
              <div className="flex justify-center mb-4 md:mb-6">
                <motion.div
                  animate={isScoreAnimated ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <EnhancedAnimatedCircularScore 
                    score={results.matchScore.total} 
                    size={isMobile ? 140 : 200}
                    strokeWidth={isMobile ? 10 : 16}
                  />
                </motion.div>
              </div>
              <motion.h2 
                className="text-base md:text-lg font-bold text-gray-800 mb-1 md:mb-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                Resume-Job Compatibility
              </motion.h2>
              <motion.p 
                className="text-gray-600 max-w-xs mx-auto text-xs md:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                AI-powered analysis of your resume against job requirements
              </motion.p>
            </div>
          </div>
        </motion.div>
        {/* Score Breakdown Grid - Compact for Mobile */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <EnhancedScoreCard 
            icon={Target} 
            label="Technical Skills" 
            score={results.matchScore.hardSkills} 
            max={25} 
            color="bg-gradient-to-br from-blue-500 to-blue-600" 
            description="Technical competencies alignment"
          />
          <EnhancedScoreCard 
            icon={Star} 
            label="Soft Skills" 
            score={results.matchScore.softSkills} 
            max={25} 
            color="bg-gradient-to-br from-purple-500 to-purple-600" 
            description="Interpersonal abilities match"
          />
          <EnhancedScoreCard 
            icon={Zap} 
            label="Role Alignment" 
            score={results.matchScore.roleAlignment} 
            max={25} 
            color="bg-gradient-to-br from-pink-500 to-rose-500" 
            description="Position requirements fit"
          />
          <EnhancedScoreCard 
            icon={Shield} 
            label="ATS Compatibility" 
            score={results.matchScore.atsCompatibility} 
            max={25} 
            color="bg-gradient-to-br from-cyan-500 to-teal-500" 
            description="Automated system readiness"
          />
        </motion.div>
        {/* Mobile Vertical Stacked Cards */}
        <div className="md:hidden mb-6 space-y-4">
          {/* Missing Keywords Card */}
          <motion.div
            className="premium-card premium-card--keywords-new"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="premium-card__content">
              <header className="premium-card__header">
                <div className="premium-card__icon-wrapper" style={{ background: 'linear-gradient(135deg, var(--pink), var(--orange))' }}>
                  <Search className="premium-card__icon" />
                </div>
                <div>
                  <h3 className="premium-card__title">Missing Keywords</h3>
                  <p className="premium-card__subtitle">Critical terms to include</p>
                </div>
              </header>
              <ul className="premium-card__keyword-list">
                {results.missingKeywords.slice(0, 5).map((keyword, index) => (
                  <motion.li
                    key={keyword}
                    className="premium-card__keyword-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 0.2 }}
                  >
                    <div className="premium-card__keyword-dot" style={{ backgroundColor: 'var(--pink)' }}></div>
                    <span className="text-xs">{keyword}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
          {/* Recruiter View Card */}
          <motion.div
            className="premium-card premium-card--recruiter-new"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="premium-card__content">
              <header className="premium-card__header">
                <div className="premium-card__icon-wrapper" style={{ background: 'linear-gradient(135deg, var(--blue), var(--teal))' }}>
                  <TrendingUp className="premium-card__icon" />
                </div>
                <div>
                  <h3 className="premium-card__title">Recruiter View</h3>
                  <p className="premium-card__subtitle">Professional assessment</p>
                </div>
              </header>
              <div
                className="premium-card__metric text-4xl"
                style={{ backgroundImage: 'linear-gradient(135deg, var(--blue), var(--teal))' }}
              >
                {results.recruiterLens.shortlistProbability}%
              </div>
              <p className="premium-card__subtitle text-xs text-center" style={{ marginTop: '-15px' }}>Shortlist Probability</p>
            </div>
          </motion.div>
          {/* ATS Decision Card */}
          <motion.div
            className="premium-card premium-card--ats-new"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="premium-card__content">
              <header className="premium-card__header">
                <div className="premium-card__icon-wrapper" style={{ background: 'linear-gradient(135deg, var(--magenta), var(--purple))' }}>
                  <Brain className="premium-card__icon" />
                </div>
                <div>
                  <h3 className="premium-card__title">ATS Decision</h3>
                  <p className="premium-card__subtitle">System evaluation</p>
                </div>
              </header>
              {/* Compact Verdict */}
              <div className="flex items-center justify-between mb-3 p-2.5 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${results.atsVerdict.willAutoReject ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className="font-semibold text-gray-700 text-xs">Status</span>
                </div>
                <motion.div
                  className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                    results.atsVerdict.willAutoReject 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {results.atsVerdict.willAutoReject ? 'REJECTED' : 'PASSED'}
                </motion.div>
              </div>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-2.5 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-blue-600 font-semibold mb-0.5">Match Rate</div>
                  <div className="text-base font-bold text-blue-800">
                    {results.matchScore.atsCompatibility}%
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-2.5 rounded-lg border border-purple-100">
                  <div className="text-[10px] text-purple-600 font-semibold mb-0.5">Keywords</div>
                  <div className="text-base font-bold text-purple-800">
                    {results.missingKeywords.length}
                  </div>
                </div>
              </div>
              {/* Critical Issues */}
              <div>
                <h4 className="font-semibold text-gray-800 flex items-center mb-1.5 text-xs">
                  <AlertTriangle className={`w-3 h-3 mr-1 ${results.atsVerdict.willAutoReject ? 'text-red-500' : 'text-orange-500'}`} />
                  Critical Issues
                </h4>
                <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {results.atsVerdict.reason.split('. ').filter(Boolean).slice(0, 2).map((sentence, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start p-2 bg-gray-50 rounded-md border border-gray-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + 0.3 }}
                    >
                      <div 
                        className="mt-1 w-1 h-1 rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: results.atsVerdict.willAutoReject 
                            ? 'var(--orange)' 
                            : 'var(--blue)' 
                        }}
                      ></div>
                      <span className="ml-2 text-gray-700 text-[10px]">
                        {sentence.trim() + (sentence.endsWith('.') ? '' : '.')}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Desktop Grid Cards */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="premium-card premium-card--keywords-new"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="premium-card__content">
              <header className="premium-card__header">
                <div className="premium-card__icon-wrapper" style={{ background: 'linear-gradient(135deg, var(--pink), var(--orange))' }}>
                  <Search className="premium-card__icon" />
                </div>
                <div>
                  <h3 className="premium-card__title">Missing Keywords</h3>
                  <p className="premium-card__subtitle">Critical terms to include</p>
                </div>
              </header>
              <ul className="premium-card__keyword-list">
                {results.missingKeywords.slice(0, 8).map((keyword, index) => (
                  <motion.li
                    key={keyword}
                    className="premium-card__keyword-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 0.2 }}
                  >
                    <div className="premium-card__keyword-dot" style={{ backgroundColor: 'var(--pink)' }}></div>
                    {keyword}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
          <motion.div
            className="premium-card premium-card--recruiter-new"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="premium-card__content">
              <header className="premium-card__header">
                <div className="premium-card__icon-wrapper" style={{ background: 'linear-gradient(135deg, var(--blue), var(--teal))' }}>
                  <TrendingUp className="premium-card__icon" />
                </div>
                <div>
                  <h3 className="premium-card__title">Recruiter View</h3>
                  <p className="premium-card__subtitle">Professional assessment</p>
                </div>
              </header>
              <div
                className="premium-card__metric"
                style={{ backgroundImage: 'linear-gradient(135deg, var(--blue), var(--teal))' }}
              >
                {results.recruiterLens.shortlistProbability}%
              </div>
              <p className="premium-card__subtitle text-center" style={{ marginTop: '-20px' }}>Shortlist Probability</p>
            </div>
          </motion.div>
          {/* Redesigned Modern ATS Decision Card */}
          <motion.div
            className="premium-card premium-card--ats-new"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="premium-card__content">
              <header className="premium-card__header">
                <div className="premium-card__icon-wrapper" style={{ background: 'linear-gradient(135deg, var(--magenta), var(--purple))' }}>
                  <Brain className="premium-card__icon" />
                </div>
                <div>
                  <h3 className="premium-card__title">ATS Decision</h3>
                  <p className="premium-card__subtitle">System evaluation</p>
                </div>
              </header>
              {/* Modern Compact Verdict */}
              <div className="flex items-center justify-between mb-5 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${results.atsVerdict.willAutoReject ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className="font-semibold text-gray-700">Status</span>
                </div>
                <motion.div
                  className={`px-4 py-2 rounded-full font-bold text-sm ${
                    results.atsVerdict.willAutoReject 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {results.atsVerdict.willAutoReject ? 'REJECTED' : 'PASSED'}
                </motion.div>
              </div>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                  <div className="text-xs text-blue-600 font-semibold mb-1">Match Rate</div>
                  <div className="text-xl font-bold text-blue-800">
                    {results.matchScore.atsCompatibility}%
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
                  <div className="text-xs text-purple-600 font-semibold mb-1">Keywords</div>
                  <div className="text-xl font-bold text-purple-800">
                    {results.missingKeywords.length}
                  </div>
                </div>
              </div>
              {/* Critical Issues */}
              <div>
                <h4 className="font-semibold text-gray-800 flex items-center mb-3">
                  <AlertTriangle className={`w-4 h-4 mr-2 ${results.atsVerdict.willAutoReject ? 'text-red-500' : 'text-orange-500'}`} />
                  Critical Issues
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {results.atsVerdict.reason.split('. ').filter(Boolean).slice(0, 3).map((sentence, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start p-3 bg-gray-50 rounded-xl border border-gray-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + 0.3 }}
                    >
                      <div 
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: results.atsVerdict.willAutoReject 
                            ? 'var(--orange)' 
                            : 'var(--blue)' 
                        }}
                      ></div>
                      <span className="ml-3 text-gray-700 text-sm">
                        {sentence.trim() + (sentence.endsWith('.') ? '' : '.')}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {onBuildResume && (
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="optimizationLevel"
                  value="STANDARD"
                  checked={optimizationLevel === 'STANDARD'}
                  onChange={() => setOptimizationLevel('STANDARD')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700 text-sm">Standard Optimization</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="optimizationLevel"
                  value="MAXIMUM"
                  checked={optimizationLevel === 'MAXIMUM'}
                  onChange={() => setOptimizationLevel('MAXIMUM')}
                  className="form-radio h-4 w-4 text-purple-600"
                />
                <span className="text-gray-700 text-sm">Fully Optimized Resume</span>
              </label>

            </div>
            <button
              onClick={handleBuildResume}
              className="relative px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm md:text-base rounded-lg md:rounded-xl shadow-md hover:shadow-blue-500/30 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 overflow-hidden group"
            >
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="absolute w-0 h-full bg-white/20 rounded-lg md:rounded-xl transform -skew-x-12 group-hover:w-full transition-all duration-700 ease-out"></span>
              </span>
              <span className="relative z-10 flex items-center justify-center">
                <BarChart3 className="mr-1.5 h-4 w-4 md:mr-2 md:h-5 md:w-5" />
                Build Optimized Resume
              </span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default AnalysisDashboard;

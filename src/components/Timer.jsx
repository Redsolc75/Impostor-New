import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { useTranslation } from './i18n/i18nContext';

export default function Timer({ initialMinutes = 5, onTimeUp }) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const totalSeconds = initialMinutes * 60;
  const progress = (timeLeft / totalSeconds) * 100;

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp]);

  const toggleTimer = () => {
    if (!hasStarted) setHasStarted(true);
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(initialMinutes * 60);
    setIsRunning(false);
    setHasStarted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (progress > 50) return 'from-cyan-500 to-green-500';
    if (progress > 25) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
        {/* Background gradient animation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-20"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${progress > 50 ? '#00d4ff' : progress > 25 ? '#fbbf24' : '#ef4444'}, transparent)`
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-white/60" />
            <span className="text-white/60 font-medium">{t('timeRemaining')}</span>
          </div>

          {/* Circular progress */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#timerGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={553}
                animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
                transition={{ duration: 0.5 }}
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={progress > 50 ? '#00d4ff' : progress > 25 ? '#fbbf24' : '#ef4444'} />
                  <stop offset="100%" stopColor={progress > 50 ? '#22c55e' : progress > 25 ? '#f97316' : '#ec4899'} />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                key={timeLeft}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className={`text-5xl font-mono font-bold ${
                  progress > 50 ? 'text-white' : progress > 25 ? 'text-yellow-400' : 'text-red-400'
                }`}
              >
                {formatTime(timeLeft)}
              </motion.span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetTimer}
              className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-6 h-6 text-white/80" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTimer}
              className={`p-6 rounded-full ${
                isRunning 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500'
              } shadow-lg`}
            >
              {isRunning ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </motion.button>

            <div className="w-14" /> {/* Spacer for symmetry */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
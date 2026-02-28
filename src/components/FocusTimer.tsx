import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SoundscapePlayer } from './SoundscapePlayer';
import { BoundaryOverlay } from './BoundaryOverlay';
import { trackFocusBlockCompletion } from '../services/activityTracker';

interface FocusTimerProps {
  mission?: string | null;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ mission }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showBoundary, setShowBoundary] = useState(false);
  const [preset, setPreset] = useState(25);
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('focus_streak');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showFlameEffect, setShowFlameEffect] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setShowBoundary(false);
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('focus_streak', newStreak.toString());
      setShowFlameEffect(true);
      setTimeout(() => setShowFlameEffect(false), 3000);

      // Track activity
      const user = localStorage.getItem('focus_user');
      const userId = user ? JSON.parse(user).email : 'guest';
      trackFocusBlockCompletion(userId);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, streak]);

  const toggleTimer = () => {
    const newActive = !isActive;
    setIsActive(newActive);
    if (newActive) {
      setShowBoundary(true);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setShowBoundary(false);
    setTimeLeft(preset * 60);
  };

  const handlePreset = (mins: number) => {
    setPreset(mins);
    setIsActive(false);
    setTimeLeft(mins * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / (preset * 60);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12 py-8">
      {/* Timer Circle */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="130"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="130"
            fill="none"
            stroke="#EAB308"
            strokeWidth="4"
            strokeDasharray={2 * Math.PI * 130}
            animate={{ strokeDashoffset: 2 * Math.PI * 130 * (1 - progress) }}
            transition={{ duration: 1, ease: "linear" }}
            strokeLinecap="round"
            className="drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            key={timeLeft}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            className="text-7xl font-bold tracking-tighter text-white"
          >
            {formatTime(timeLeft)}
          </motion.span>
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] mt-4">
            {isActive ? 'Deep Work' : 'Ready'}
          </span>
        </div>

        {/* Subtle background glow */}
        <AnimatePresence>
          {isActive && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-gold/5 blur-3xl rounded-full -z-10"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Presets */}
      <div className="flex gap-3">
        {[25, 50, 90].map((mins) => (
          <button
            key={mins}
            onClick={() => handlePreset(mins)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
              preset === mins 
                ? 'bg-gold text-navy-dark shadow-lg' 
                : 'bg-white/5 text-white/40 border border-white/5 hover:border-gold/30'
            }`}
          >
            {mins}m
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-10">
          <button
            onClick={resetTimer}
            className="w-12 h-12 rounded-full bg-navy-medium border border-white/5 text-white/40 flex items-center justify-center hover:text-gold transition-all shadow-sm"
          >
            <RotateCcw size={20} />
          </button>
          
          <button
            onClick={toggleTimer}
            className="w-20 h-20 rounded-full bg-gold text-navy-dark flex items-center justify-center hover:scale-105 transition-all shadow-xl"
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <div className="w-12 h-12 flex items-center justify-center relative">
            <AnimatePresence>
              {showFlameEffect && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 0 }}
                  animate={{ opacity: 1, scale: 1.5, y: -20 }}
                  exit={{ opacity: 0, scale: 2, y: -40 }}
                  className="absolute text-gold font-bold pointer-events-none"
                >
                  +1
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                <Flame 
                  size={20} 
                  className={isActive || showFlameEffect ? "text-gold animate-pulse" : "text-white/10"} 
                  fill={streak > 0 ? "currentColor" : "none"}
                />
                {streak > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-navy-dark text-[8px] font-bold px-1 rounded-full min-w-[14px] text-center shadow-lg">
                    {streak}
                  </span>
                )}
              </div>
              <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Streak</span>
            </div>
          </div>
        </div>

        {isActive && !showBoundary && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowBoundary(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest hover:bg-gold/20 transition-all"
          >
            <Shield size={12} />
            Re-enter Boundary Mode
          </motion.button>
        )}
      </div>

      {/* Soundscape Player */}
      <div className="w-full max-w-sm">
        <SoundscapePlayer autoPlay={isActive} />
      </div>

      {/* Boundary Overlay */}
      <AnimatePresence>
        {showBoundary && isActive && (
          <BoundaryOverlay 
            timeLeft={formatTime(timeLeft)}
            progress={progress}
            onExit={() => setShowBoundary(false)}
            task={mission || undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { trackFocusBlockCompletion } from '../services/activityTracker';

interface FocusTimerProps {
  mission?: string | null;
  onSessionComplete?: () => void;
}

const DEFAULT_MINUTES = 25;
const TOTAL_SECONDS = DEFAULT_MINUTES * 60;

const readStoredStreak = () => {
  const saved = localStorage.getItem('focus_streak');
  const parsed = Number.parseInt(saved || '0', 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const readStoredUserId = () => {
  const rawUser = localStorage.getItem('focus_user');
  if (!rawUser) return 'guest';

  try {
    const user = JSON.parse(rawUser) as { email?: string };
    return user.email || 'guest';
  } catch {
    return 'guest';
  }
};

export const FocusTimer: React.FC<FocusTimerProps> = ({ mission, onSessionComplete }) => {
  const completionHandled = useRef(false);

  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isActive, setIsActive] = useState(false);
  const [streak, setStreak] = useState(() => readStoredStreak());

  useEffect(() => {
    if (!isActive) return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (timeLeft > 0) {
      completionHandled.current = false;
      return;
    }

    if (!isActive || completionHandled.current) return;

    completionHandled.current = true;
    setIsActive(false);
    setTimeLeft(TOTAL_SECONDS);

    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('focus_streak', String(newStreak));

    trackFocusBlockCompletion(readStoredUserId());
    onSessionComplete?.();
  }, [isActive, onSessionComplete, streak, timeLeft]);

  const progress = 1 - timeLeft / TOTAL_SECONDS;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(TOTAL_SECONDS);
    }

    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TOTAL_SECONDS);
    completionHandled.current = false;
  };

  const statusLabel = isActive ? 'Deep Work' : timeLeft === TOTAL_SECONDS ? 'Ready' : 'Paused';

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-10 py-8 text-center">
      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/70">Focus Session</p>
        <h2 className="text-3xl font-bold text-white">{mission || "Set today's mission first"}</h2>
        <p className="text-sm text-white/40">One 25-minute block. Start, focus, finish, review.</p>
      </div>

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
            transition={{ duration: 1, ease: 'linear' }}
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
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button
          onClick={resetTimer}
          className="w-12 h-12 rounded-full bg-navy-medium border border-white/5 text-white/40 flex items-center justify-center hover:text-gold transition-all shadow-sm"
          aria-label="Reset timer"
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={toggleTimer}
          className="w-20 h-20 rounded-full bg-gold text-navy-dark flex items-center justify-center hover:scale-105 transition-all shadow-xl"
          aria-label={isActive ? 'Pause timer' : 'Start timer'}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <div className="w-12 h-12 flex flex-col items-center justify-center">
          <Flame
            size={20}
            className={streak > 0 ? 'text-gold' : 'text-white/10'}
            fill={streak > 0 ? 'currentColor' : 'none'}
          />
          <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter mt-1">{streak || 0}</span>
        </div>
      </div>

      <div className="text-xs text-white/30 uppercase tracking-[0.25em]">{DEFAULT_MINUTES}-minute session</div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Sparkles, Target, Check } from 'lucide-react';
import { FocusCapacity, OnboardingAnswers, WorkType } from '../types/onboarding';
import { LegalFooter } from './LegalFooter';

interface OnboardingProps {
  onComplete: (answers: OnboardingAnswers) => void;
}

const WORK_TYPES: { id: WorkType; label: string }[] = [
  { id: 'corporate', label: 'Corporate' },
  { id: 'entrepreneur', label: 'Founder' },
  { id: 'creative', label: 'Creative' },
  { id: 'student', label: 'Student' },
  { id: 'freelancer', label: 'Freelancer' },
];

const CAPACITIES: { id: FocusCapacity; label: string }[] = [
  { id: '<10', label: 'Under 10 min' },
  { id: '10-20', label: '10-20 min' },
  { id: '20-30', label: '20-30 min' },
  { id: '30-45', label: '30-45 min' },
  { id: '45-60', label: '45-60 min' },
  { id: '60+', label: '60+ min' },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [workType, setWorkType] = useState<WorkType>('corporate');
  const [capacity, setCapacity] = useState<FocusCapacity>('20-30');
  const [goal, setGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = () => {
    setIsSubmitting(true);
    onComplete({
      workType,
      capacity,
      goal30Days: goal.trim(),
    });
  };

  const canFinish = goal.trim().length > 0;

  return (
    <div className="min-h-screen bg-navy-dark text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="atmosphere" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-navy-medium rounded-full border border-gold/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(234,179,8,0.1)]">
            <Sparkles className="text-gold" size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-serif italic text-gold tracking-tight">Focus Advantage</h1>
            <p className="text-white/40 text-sm uppercase tracking-[0.3em]">MVP setup</p>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Set the basics in under a minute and jump into the dashboard.
          </p>
        </div>

        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40">
              What best describes your work?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {WORK_TYPES.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setWorkType(option.id)}
                  className={`rounded-2xl border px-3 py-3 text-sm transition-all ${
                    workType === option.id
                      ? 'bg-gold text-navy-dark border-gold font-bold'
                      : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40">
              How long can you usually focus?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CAPACITIES.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setCapacity(option.id)}
                  className={`rounded-2xl border px-3 py-3 text-sm transition-all ${
                    capacity === option.id
                      ? 'bg-gold text-navy-dark border-gold font-bold'
                      : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40">
              What is your main goal for the next 30 days?
            </label>
            <div className="relative">
              <Target className="absolute left-4 top-4 text-gold/60" size={18} />
              <textarea
                autoFocus
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Finish the landing page, study every day, ship my app..."
                className="w-full h-36 bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder:text-white/25 focus:border-gold outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!canFinish || isSubmitting}
          className="gold-button w-full disabled:opacity-50"
        >
          {isSubmitting ? 'Setting up...' : 'Finish Setup'}
          {!isSubmitting && <ChevronRight size={18} />}
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/25">
          <Check size={14} />
          <span>Only the essentials</span>
        </div>

        <LegalFooter className="pt-2" />
      </motion.div>
    </div>
  );
};

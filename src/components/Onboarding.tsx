import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Sparkles, Target, Zap, Clock, Shield, User, Bot, BrainCircuit } from 'lucide-react';
import { OnboardingAnswers, FocusProfile } from '../types/onboarding';
import { calculateFocusScore, getFocusProfile } from '../services/onboardingService';

interface OnboardingProps {
  onComplete: (profile: FocusProfile, answers: OnboardingAnswers) => void;
}

const INITIAL_ANSWERS: OnboardingAnswers = {
  q1_workType: 'corporate',
  q2_workPlace: 'home',
  q3_workHours: '8-10',
  q4_startTime: '9-11',
  q5_capacity: '20-30',
  q6_distractions: [],
  q7_finishRate: 'often',
  q8_morningRoutine: 'loose',
  q9_flowFreq: 'few-month',
  q10_phoneCheck: '30m',
  q11_emailVolume: '50-200',
  q12_deviceCount: '2',
  q13_socialMedia: 'occasional',
  q14_peakEnergy: 'late-morning',
  q15_sleepHours: '7-8',
  q16_breakStyle: 'pomodoro',
  q17_workIntensity: 'balanced',
  q18_planningStyle: 'simple',
  q19_primaryReason: 'productivity',
  q20_goal30Days: '',
  q21_motivation: 'achievement',
  q22_commitment: 'moderate',
  q23_partnerStatus: 'want',
  q24_sharingComfort: 'group',
  q25_coachTone: 'coach',
  q26_readingProgress: 'none',
  q27_appsTried: [],
  q28_idealWorkday: ''
};

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(INITIAL_ANSWERS);
  const [profile, setProfile] = useState<FocusProfile | null>(null);

  const nextStep = () => {
    if (step === 7) {
      const score = calculateFocusScore(answers);
      const generatedProfile = getFocusProfile(score);
      setProfile(generatedProfile);
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const updateAnswer = (key: keyof OnboardingAnswers, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const toggleMultiSelect = (key: 'q6_distractions' | 'q27_appsTried', value: string) => {
    setAnswers(prev => {
      const current = prev[key] as string[];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter(v => v !== value) };
      }
      return { ...prev, [key]: [...current, value] };
    });
  };

  const progress = (step / 8) * 100;

  return (
    <div className="min-h-screen bg-navy-dark text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="atmosphere" />
      
      {/* Progress Bar */}
      {step > 0 && step < 8 && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gold shadow-[0_0_10px_rgba(234,179,8,0.5)]"
          />
          <div className="absolute top-4 right-6 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            {step} / 8
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full text-center space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-5xl font-serif italic text-gold tracking-tight">Focus Advantage</h1>
              <p className="text-white/40 text-sm uppercase tracking-[0.3em]">The Focus Advantage — Digital System</p>
            </div>

            <div className="relative py-12">
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute border border-gold/20 rounded-full"
                    style={{ width: (i + 1) * 40, height: (i + 1) * 40 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
                  />
                ))}
              </div>
              <div className="w-24 h-24 bg-navy-medium rounded-full border border-gold/30 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                <Sparkles className="text-gold" size={32} />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold leading-tight">Let's Build Your Personal Focus Profile</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {['Personalized Plan', 'Your Focus Score', 'AI Coach Briefed'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold rounded-full uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button onClick={nextStep} className="gold-button w-full">
              Begin Assessment
              <ChevronRight size={18} />
            </button>
            <p className="text-white/20 text-[10px] uppercase tracking-widest">Takes about 5 minutes</p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" className="max-w-md w-full space-y-8">
            <div className="space-y-2">
              <p className="text-gold text-[10px] font-bold uppercase tracking-widest">Phase 1 of 7 — Identity & Context</p>
              <h2 className="text-3xl font-bold">What best describes your work?</h2>
            </div>
            
            <div className="grid gap-3">
              {[
                { id: 'corporate', label: 'Corporate Knowledge Worker' },
                { id: 'entrepreneur', label: 'Entrepreneur / Business Owner' },
                { id: 'creative', label: 'Creative Professional' },
                { id: 'student', label: 'Student / Academic' },
                { id: 'freelancer', label: 'Freelancer / Consultant' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateAnswer('q1_workType', opt.id)}
                  className={`p-5 text-left rounded-2xl border transition-all ${
                    answers.q1_workType === opt.id 
                      ? 'bg-navy-medium border-gold text-white shadow-lg' 
                      : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                  }`}
                >
                  <span className="font-bold text-sm">{opt.label}</span>
                </button>
              ))}
            </div>

            <button onClick={nextStep} className="gold-button w-full mt-8">
              Continue
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" className="max-w-md w-full space-y-8">
            <div className="space-y-2">
              <p className="text-gold text-[10px] font-bold uppercase tracking-widest">Phase 2 of 7 — Focus Baseline</p>
              <h2 className="text-3xl font-bold">How long can you stay focused without distraction?</h2>
              <p className="text-white/40 text-sm">Be honest — there's no wrong answer.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: '<10', label: 'Under 10 min', sub: 'My focus breaks constantly' },
                { id: '10-20', label: '10-20 min', sub: 'I lose focus quickly' },
                { id: '20-30', label: '20-30 min', sub: 'Easily interrupted' },
                { id: '30-45', label: '30-45 min', sub: 'Pretty good' },
                { id: '45-60', label: '45-60 min', sub: 'Solid focus' },
                { id: '60+', label: '60+ minutes', sub: 'Strong focus already' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateAnswer('q5_capacity', opt.id)}
                  className={`p-4 text-left rounded-2xl border transition-all h-32 flex flex-col justify-between ${
                    answers.q5_capacity === opt.id 
                      ? 'bg-navy-medium border-gold text-white shadow-lg' 
                      : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                  }`}
                >
                  <span className="font-bold text-sm">{opt.label}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">{opt.sub}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={prevStep} className="p-4 rounded-xl bg-white/5 border border-white/5 text-white/60">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextStep} className="gold-button flex-1">
                Continue
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" className="max-w-md w-full space-y-8">
            <div className="space-y-2">
              <p className="text-gold text-[10px] font-bold uppercase tracking-widest">Phase 2 — Distractions</p>
              <h2 className="text-3xl font-bold">What usually pulls you away from focused work?</h2>
              <p className="text-white/40 text-sm">Select up to 3 — we'll build defenses.</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'phone', label: 'Phone', icon: '📱' },
                { id: 'email', label: 'Email', icon: '✉️' },
                { id: 'social', label: 'Social', icon: '🌐' },
                { id: 'people', label: 'People', icon: '👥' },
                { id: 'internal', label: 'Thoughts', icon: '🧠' },
                { id: 'task-switch', label: 'Switching', icon: '🔄' },
                { id: 'noise', label: 'Noise', icon: '🔊' },
                { id: 'hunger', label: 'Energy', icon: '🔋' },
                { id: 'boredom', label: 'Boredom', icon: '🥱' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleMultiSelect('q6_distractions', opt.id)}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    (answers.q6_distractions as string[]).includes(opt.id) 
                      ? 'bg-gold text-navy-dark border-gold' 
                      : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-center">{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={prevStep} className="p-4 rounded-xl bg-white/5 border border-white/5 text-white/60">
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextStep} 
                disabled={answers.q6_distractions.length === 0}
                className="gold-button flex-1 disabled:opacity-50"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" className="max-w-md w-full space-y-8">
            <div className="space-y-2">
              <p className="text-gold text-[10px] font-bold uppercase tracking-widest">Phase 4 — Style & Energy</p>
              <h2 className="text-3xl font-bold">When is your peak mental energy?</h2>
            </div>
            
            <div className="grid gap-3">
              {[
                { id: 'early-morning', label: 'Early Morning', sub: '5 AM - 9 AM' },
                { id: 'late-morning', label: 'Late Morning', sub: '9 AM - 12 PM' },
                { id: 'early-afternoon', label: 'Early Afternoon', sub: '12 PM - 3 PM' },
                { id: 'late-afternoon', label: 'Late Afternoon', sub: '3 PM - 6 PM' },
                { id: 'evening', label: 'Evening', sub: '6 PM - 10 PM' },
                { id: 'night', label: 'Night', sub: '10 PM+' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateAnswer('q14_peakEnergy', opt.id)}
                  className={`p-5 text-left rounded-2xl border transition-all flex justify-between items-center ${
                    answers.q14_peakEnergy === opt.id 
                      ? 'bg-navy-medium border-gold text-white shadow-lg' 
                      : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                  }`}
                >
                  <span className="font-bold text-sm">{opt.label}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">{opt.sub}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={prevStep} className="p-4 rounded-xl bg-white/5 border border-white/5 text-white/60">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextStep} className="gold-button flex-1">
                Continue
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" className="max-w-md w-full space-y-8">
            <div className="space-y-2">
              <p className="text-gold text-[10px] font-bold uppercase tracking-widest">Phase 5 — Goals</p>
              <h2 className="text-3xl font-bold">What's your PRIMARY reason for improving focus?</h2>
            </div>
            
            <div className="grid gap-3">
              {[
                { id: 'career', label: 'Advance my career / business', icon: '💰' },
                { id: 'project', label: 'Complete a specific project', icon: '✍️' },
                { id: 'stress', label: 'Feel calmer and less overwhelmed', icon: '😌' },
                { id: 'habits', label: 'Implement The Focus Advantage system', icon: '🎯' },
                { id: 'balance', label: 'Better work-life balance', icon: '⚖️' },
                { id: 'productivity', label: 'Compete at the highest level', icon: '🏆' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateAnswer('q19_primaryReason', opt.id)}
                  className={`p-5 text-left rounded-2xl border transition-all flex items-center gap-4 ${
                    answers.q19_primaryReason === opt.id 
                      ? 'bg-navy-medium border-gold text-white shadow-lg' 
                      : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="font-bold text-sm">{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={prevStep} className="p-4 rounded-xl bg-white/5 border border-white/5 text-white/60">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextStep} className="gold-button flex-1">
                Continue
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div key="step6" className="max-w-md w-full space-y-8">
            <div className="space-y-2">
              <p className="text-gold text-[10px] font-bold uppercase tracking-widest">Phase 5 — Goal Setting</p>
              <h2 className="text-3xl font-bold">What's ONE thing you want to accomplish in the next 30 days?</h2>
              <p className="text-white/40 text-sm">This becomes the lens through which your AI Coach views everything.</p>
            </div>
            
            <textarea
              value={answers.q20_goal30Days}
              onChange={(e) => updateAnswer('q20_goal30Days', e.target.value)}
              placeholder="e.g. Write my book, Launch my startup, Pass my exam..."
              className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
            />

            <div className="flex gap-3">
              <button onClick={prevStep} className="p-4 rounded-xl bg-white/5 border border-white/5 text-white/60">
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextStep} 
                disabled={!answers.q20_goal30Days.trim()}
                className="gold-button flex-1 disabled:opacity-50"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 7 && (
          <motion.div key="step7" className="max-w-md w-full space-y-8">
            <div className="space-y-2">
              <p className="text-gold text-[10px] font-bold uppercase tracking-widest">Phase 6 — AI Calibration</p>
              <h2 className="text-3xl font-bold">How should the AI Focus Coach talk to you?</h2>
            </div>
            
            <div className="grid gap-3">
              {[
                { id: 'drill', label: 'Direct / No-nonsense', sub: 'Drill Sergeant' },
                { id: 'cheerleader', label: 'Encouraging / Supportive', sub: 'Cheerleader' },
                { id: 'scientist', label: 'Data-driven / Analytical', sub: 'Scientist' },
                { id: 'peer', label: 'Friendly / Casual', sub: 'Peer' },
                { id: 'coach', label: 'Tough-love / Challenging', sub: 'Coach' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateAnswer('q25_coachTone', opt.id)}
                  className={`p-5 text-left rounded-2xl border transition-all flex justify-between items-center ${
                    answers.q25_coachTone === opt.id 
                      ? 'bg-navy-medium border-gold text-white shadow-lg' 
                      : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                  }`}
                >
                  <span className="font-bold text-sm">{opt.label}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">{opt.sub}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={prevStep} className="p-4 rounded-xl bg-white/5 border border-white/5 text-white/60">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextStep} className="gold-button flex-1">
                Generate My Profile
                <Sparkles size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 8 && profile && (
          <motion.div 
            key="step8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full space-y-8"
          >
            <div className="text-center space-y-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-32 h-32 rounded-full border-4 border-gold mx-auto flex items-center justify-center relative shadow-[0_0_50px_rgba(234,179,8,0.2)]"
              >
                <div className="text-4xl font-bold text-gold">{profile.score}</div>
                <div className="absolute -bottom-2 bg-gold text-navy-dark text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Focus Score</div>
              </motion.div>
              <h2 className="text-3xl font-bold">{profile.name}</h2>
              <div className="flex justify-center">
                <span className="px-4 py-1 bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold rounded-full uppercase tracking-widest">
                  Level: {profile.score > 85 ? 'Elite' : profile.score > 70 ? 'Advanced' : profile.score > 55 ? 'Intermediate' : 'Recruit'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-card p-6 space-y-3">
                <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Your Profile</h3>
                <p className="text-sm text-white/80 leading-relaxed">{profile.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-5 space-y-2">
                  <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Training Track</h3>
                  <p className="text-xs font-bold text-white">{profile.trainingTrack.split(':')[0]}</p>
                </div>
                <div className="glass-card p-5 space-y-2">
                  <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Coach Tone</h3>
                  <p className="text-xs font-bold text-white">{profile.coachTone.split('.')[0]}</p>
                </div>
              </div>

              <div className="glass-card p-6 border-gold/30 bg-gold/5">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="text-gold" size={18} />
                  <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Week 1 Priority</h3>
                </div>
                <p className="text-sm font-bold text-white leading-relaxed">{profile.week1Priority}</p>
              </div>
            </div>

            <button onClick={() => onComplete(profile, answers)} className="gold-button w-full">
              Enter Focus Advantage
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

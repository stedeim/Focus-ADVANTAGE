import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart2, Zap, Target, CheckCircle2, ChevronRight, ArrowLeft, Calendar, Star } from 'lucide-react';

interface SundayReviewProps {
  onComplete: (data: any) => void;
  onClose: () => void;
}

export const SundayReview: React.FC<SundayReviewProps> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    wins: '',
    energyLevel: 3,
    lessons: '',
    nextWeekGoal: ''
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-4">
                <Star size={24} />
              </div>
              <h2 className="text-2xl font-bold">The Win Audit</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Reflect on the past 7 days. What were your top 3 wins, no matter how small?
              </p>
            </div>
            <div className="space-y-4">
              <textarea
                autoFocus
                value={data.wins}
                onChange={(e) => setData({ ...data, wins: e.target.value })}
                placeholder="1. Completed the project proposal&#10;2. Hit 4 deep work blocks on Tuesday&#10;3. ..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all min-h-[160px] resize-none"
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-4">
                <Zap size={24} />
              </div>
              <h2 className="text-2xl font-bold">Energy Mapping</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                On average, how was your mental energy and focus capacity this week?
              </p>
            </div>
            <div className="space-y-12 py-8">
              <div className="flex justify-between px-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setData({ ...data, energyLevel: val })}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      data.energyLevel === val 
                        ? 'bg-gold text-navy-dark scale-110 shadow-lg' 
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20 px-2">
                <span>Drained</span>
                <span>Peak Performance</span>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4">
                <BarChart2 size={24} />
              </div>
              <h2 className="text-2xl font-bold">Focus Lessons</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                What did you learn about your focus patterns? What worked? What didn't?
              </p>
            </div>
            <div className="space-y-4">
              <textarea
                autoFocus
                value={data.lessons}
                onChange={(e) => setData({ ...data, lessons: e.target.value })}
                placeholder="I noticed I'm much more productive before 11 AM...&#10;Slack is still my biggest focus killer..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all min-h-[160px] resize-none"
              />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-4">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-bold">Next Week Calibration</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Based on this week's review, what is your primary objective for the upcoming week?
              </p>
            </div>
            <div className="space-y-4">
              <input
                autoFocus
                type="text"
                value={data.nextWeekGoal}
                onChange={(e) => setData({ ...data, nextWeekGoal: e.target.value })}
                placeholder="My primary objective for next week is..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
              />
            </div>
            <div className="p-6 bg-gold/5 border border-gold/20 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Training Progression</p>
                <p className="text-xs text-white/60">Ready to advance to Phase 2 of the 6-Week Plan.</p>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-navy-dark flex flex-col">
      <div className="atmosphere" />
      
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-6 relative z-10">
        <button 
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Sunday Ritual</span>
          <div className="flex gap-1.5 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === step ? 'w-8 bg-gold' : i < step ? 'w-4 bg-gold/40' : 'w-4 bg-white/10'
                }`} 
              />
            ))}
          </div>
        </div>
        <div className="w-10" />
      </header>

      {/* Content */}
      <main className="flex-1 px-6 flex flex-col justify-center relative z-10 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-6 relative z-10 max-w-md mx-auto w-full">
        <button
          onClick={handleNext}
          className="gold-button w-full py-5 rounded-2xl flex items-center justify-center gap-2"
        >
          {step === totalSteps ? 'Complete Review' : 'Continue'}
          <ChevronRight size={18} />
        </button>
      </footer>
    </div>
  );
};

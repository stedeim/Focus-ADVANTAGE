import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, ShieldAlert, Coffee, CheckCircle2, ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';

interface MorningLockInProps {
  onComplete: (data: any) => void;
  onClose: () => void;
}

export const MorningLockIn: React.FC<MorningLockInProps> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    priority: '',
    barrier: '',
    environment: {
      dnd: false,
      water: false,
      workspace: false,
      headphones: false
    }
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

  const toggleEnv = (key: keyof typeof data.environment) => {
    setData({
      ...data,
      environment: {
        ...data.environment,
        [key]: !data.environment[key]
      }
    });
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
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-bold">Clarity Audit</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Identify the "One Big Thing." If you could only accomplish one task today to feel successful, what would it be?
              </p>
            </div>
            <div className="space-y-4">
              <textarea
                autoFocus
                value={data.priority}
                onChange={(e) => setData({ ...data, priority: e.target.value })}
                placeholder="My #1 Deep Work priority is..."
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
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 mb-4">
                <ShieldAlert size={24} />
              </div>
              <h2 className="text-2xl font-bold">Barrier Identification</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                What is the most likely distraction that could derail your focus today? Naming it reduces its power.
              </p>
            </div>
            <div className="space-y-4">
              <input
                autoFocus
                type="text"
                value={data.barrier}
                onChange={(e) => setData({ ...data, barrier: e.target.value })}
                placeholder="e.g., Slack notifications, unscheduled calls..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
              />
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
                <Coffee size={24} />
              </div>
              <h2 className="text-2xl font-bold">Environment Setup</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Prepare your physical and digital space for elite performance.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'dnd', label: 'Phone on DND / Out of Sight', icon: '📱' },
                { id: 'water', label: 'Hydration Ready (Water/Coffee)', icon: '💧' },
                { id: 'workspace', label: 'Clear Physical Workspace', icon: '🧹' },
                { id: 'headphones', label: 'Focus Soundscape Ready', icon: '🎧' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleEnv(item.id as any)}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                    data.environment[item.id as keyof typeof data.environment]
                      ? 'bg-gold/10 border-gold text-white'
                      : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {data.environment[item.id as keyof typeof data.environment] && (
                    <CheckCircle2 size={18} className="text-gold" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-12"
          >
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center text-gold mx-auto">
                <Sparkles size={48} />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-gold/10 rounded-full blur-xl"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold">Morning Lock-In Complete</h2>
              <p className="text-white/40 text-sm max-w-xs mx-auto">
                Your intention is set. Your barriers are identified. Your space is ready.
              </p>
            </div>
            <div className="glass-card p-6 border-gold/20 bg-gold/5 text-left space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Today's Mission</p>
                <p className="text-lg font-bold text-white">{data.priority || 'Unspecified Priority'}</p>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center gap-2 text-xs text-white/40">
                <ShieldAlert size={14} className="text-red-400" />
                <span>Watch out for: {data.barrier || 'None identified'}</span>
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
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${
                i === step ? 'w-8 bg-gold' : i < step ? 'w-4 bg-gold/40' : 'w-4 bg-white/10'
              }`} 
            />
          ))}
        </div>
        <div className="w-10" /> {/* Spacer */}
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
          disabled={step === 1 && !data.priority.trim()}
          className="gold-button w-full py-5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {step === totalSteps ? 'Enter Focus Zone' : 'Continue'}
          <ChevronRight size={18} />
        </button>
      </footer>
    </div>
  );
};

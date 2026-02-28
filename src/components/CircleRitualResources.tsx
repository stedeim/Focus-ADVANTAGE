import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Users, Target, Sparkles, X, MessageSquare } from 'lucide-react';

interface CircleRitualResourcesProps {
  onClose: () => void;
}

export const CircleRitualResources: React.FC<CircleRitualResourcesProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const discussionTemplate = `🎯 Ritual Check-In: Week 3 Calibration

1. My Morning Lock-In Priority today was: [Insert One Big Thing]
2. One barrier I neutralized this morning: [Insert Barrier]
3. Current Focus Streak: [Insert Days]

How are you all finding the Phase 2 transition? Let's stay locked in. 🤝`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(discussionTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[100] bg-navy-dark/95 backdrop-blur-xl flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Circle Resources</h3>
            <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Accountability & Rituals</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-8 max-w-md mx-auto w-full">
        {/* Discussion Template */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-gold" />
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Discussion Template</h4>
            </div>
            <button 
              onClick={copyTemplate}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest hover:bg-gold/20 transition-all"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy Template'}
            </button>
          </div>
          <div className="bg-navy-medium border border-white/5 rounded-2xl p-5 relative group">
            <pre className="text-[11px] text-white/60 font-mono whitespace-pre-wrap leading-relaxed">
              {discussionTemplate}
            </pre>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles size={16} className="text-gold/20" />
            </div>
          </div>
        </section>

        {/* Accountability Integration */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-gold" />
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Accountability Integration</h4>
          </div>
          <div className="space-y-4 text-xs text-white/60 leading-relaxed">
            <p>
              Circles create a natural accountability loop by making your focus rituals visible to others. When you share your "Morning Lock-In" priority or your "Sunday Ritual" wins, you're not just logging data—you're making a social commitment. This "visibility effect" has been shown to increase ritual consistency by up to 40% in high-performance cohorts.
            </p>
            <p>
              By seeing your peers navigate barriers and celebrate deep work streaks, you normalize the struggle of focus. This collective momentum prevents the "isolation drift" that often leads to abandoned habits. In a Circle, your presence is your contribution.
            </p>
          </div>
        </section>

        {/* Week 3 Ritual Challenge */}
        <section className="p-6 rounded-3xl bg-gold/5 border border-gold/20 space-y-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-gold" />
              <h4 className="text-xs font-bold text-gold uppercase tracking-widest">Week 3 Ritual Challenge</h4>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">The "Invisible Morning" Sprint</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              For the next 5 days, every member of the Circle commits to completing their Morning Lock-In and 90 minutes of Deep Work before checking the Circle feed or any other digital communication.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gold uppercase tracking-widest">
              <span>Goal: 100% Circle Participation</span>
            </div>
          </div>
          {/* Abstract background */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gold/10 blur-2xl rounded-full" />
        </section>
      </div>
    </motion.div>
  );
};

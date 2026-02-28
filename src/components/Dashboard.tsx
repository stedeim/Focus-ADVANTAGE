import React from 'react';
import { TrendingUp, Clock, Target, Zap, CheckCircle2, ChevronRight, ShieldCheck, Calendar, Brain } from 'lucide-react';
import { TrainingPlan } from './TrainingPlan';

interface DashboardProps {
  onboarded: boolean;
  setActiveTab: (tab: string) => void;
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  onStartLockIn?: () => void;
  onStartReview?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onboarded, setActiveTab, currentWeek, setCurrentWeek, onStartLockIn, onStartReview }) => {
  return (
    <div className="space-y-8 py-6">
      {/* Morning Lock-In Section */}
      <section className="relative overflow-hidden rounded-3xl bg-navy-medium border border-gold/20 p-6 shadow-[0_0_40px_rgba(234,179,8,0.05)]">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <h3 className="text-sm font-bold text-gold uppercase tracking-widest">Morning Protocol</h3>
            </div>
            <h2 className="text-xl font-bold text-white">Morning Lock-In</h2>
            <p className="text-xs text-white/40">10 minutes to elite focus.</p>
          </div>
          <button 
            onClick={onStartLockIn}
            className="w-12 h-12 rounded-2xl bg-gold text-navy-dark flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-105 transition-transform"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        {/* Abstract background elements */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-gold/10 blur-2xl rounded-full" />
        <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-gold/5 blur-xl rounded-full" />
      </section>

      {/* Sunday Ritual Section */}
      <section className="glass-card p-6 border-purple-500/20 bg-purple-500/5 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-purple-400" />
              <h3 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Weekly Review</h3>
            </div>
            <h2 className="text-lg font-bold text-white">Sunday Ritual</h2>
            <p className="text-xs text-white/40">Close the loop. Calibrate for next week.</p>
          </div>
          <button 
            onClick={onStartReview}
            className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest hover:bg-purple-500/20 transition-all"
          >
            Start Review
          </button>
        </div>
      </section>

      {/* Welcome Section */}
      <section>
        <h3 className="text-2xl font-bold text-white">Let's Build Your Personal Focus Profile</h3>
        <p className="text-white/40 text-sm mt-1">5 minutes · 28 questions · Completely personalized</p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Deep Work', value: '12.5h', icon: Clock, color: 'text-gold', bg: 'bg-gold/10' },
          { label: 'Focus Score', value: '84%', icon: Target, color: 'text-gold', bg: 'bg-gold/10' },
          { label: 'Predicted Focus', value: '78%', icon: Brain, color: 'text-gold', bg: 'bg-gold/10', onClick: () => setActiveTab('analytics') },
          { label: 'Streak', value: '3 Days', icon: Zap, color: 'text-gold', bg: 'bg-gold/10' },
        ].map((stat, i) => (
          <div 
            key={i} 
            onClick={stat.onClick}
            className="glass-card p-5 flex flex-col justify-between h-32 border-white/5 hover:border-gold/30 transition-all cursor-pointer group"
          >
            <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold text-white mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Action Card */}
      <div className="glass-card p-6 relative overflow-hidden group bg-navy-medium border-gold/20 shadow-[0_0_30px_rgba(234,179,8,0.05)]">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">6-Week Training</h3>
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Focus Master</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/60">
              <span>Progress to Master</span>
              <span>35%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="w-[35%] h-full bg-gold shadow-[0_0_12px_rgba(234,179,8,0.4)]" />
            </div>
          </div>

          {onboarded ? (
            <button onClick={() => setActiveTab('timer')} className="gold-button w-full mt-8">
              Start Focus Session
              <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={() => window.location.reload()} className="gold-button w-full mt-8">
              Begin Assessment
              <ChevronRight size={14} />
            </button>
          )}
        </div>
        
        {/* Subtle background glow */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold/5 blur-3xl rounded-full" />
      </div>

      {/* 6-Week Training Plan */}
      <TrainingPlan currentWeek={currentWeek} onStartWeek={setCurrentWeek} />

      {/* Research-Backed Benefits */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck size={16} className="text-emerald-400" />
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Research-Backed Benefits</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Session Completion', value: '+40%', desc: 'Higher success rate', color: 'text-emerald-400' },
            { label: 'Distractions', value: '-35%', desc: 'Reduced interruptions', color: 'text-red-400' },
            { label: 'Focus Quality', value: '+28%', desc: 'Deep work depth', color: 'text-blue-400' },
            { label: 'Flow Entry', value: '67%', desc: 'Flow within 5 min', color: 'text-gold' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 border-white/5 bg-navy-medium/20 space-y-1">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-[9px] text-white/20 italic">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Activity */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Weekly Activity</h3>
          <div className="flex items-center gap-1 text-[10px] font-bold text-gold">
            <TrendingUp size={12} />
            +12%
          </div>
        </div>
        <div className="glass-card p-6 h-40 flex items-end gap-3 border-white/5">
          {[45, 60, 30, 80, 55, 90, 70].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-white/5 rounded-t-sm transition-all duration-700 hover:bg-gold/50" 
                style={{ height: `${height}%` }}
              />
              <span className="text-[8px] font-bold text-white/20 uppercase">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </div>
          ))}
        </div>
      </section>
      {/* Security & Privacy Info */}
      <section className="pt-8 border-t border-white/5">
        <div className="glass-card p-6 bg-navy-medium/30 border-white/5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Security & Privacy</h4>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Your data is stored locally in your browser. We use industry-standard encryption for AI interactions and never store your personal focus data on our servers. The payment gateway is currently in <span className="text-gold font-bold">Simulation Mode</span> for this preview.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

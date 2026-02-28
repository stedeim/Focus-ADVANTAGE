import React from 'react';
import { CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { TRAINING_PLAN, TrainingPhase } from '../lib/trainingPlan';

interface TrainingPlanProps {
  currentWeek: number;
  onStartWeek: (week: number) => void;
}

export const TrainingPlan: React.FC<TrainingPlanProps> = ({ currentWeek, onStartWeek }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">6-Week Training Plan</h3>
        <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Phase {TRAINING_PLAN[currentWeek - 1]?.phase || 1}</span>
      </div>
      
      <div className="space-y-3">
        {TRAINING_PLAN.map((phase) => {
          const isCompleted = phase.week < currentWeek;
          const isCurrent = phase.week === currentWeek;
          const isLocked = phase.week > currentWeek;

          return (
            <div key={phase.week} className={`glass-card p-4 flex items-center gap-4 transition-all border ${isCurrent ? 'border-gold/30 bg-navy-medium' : 'border-white/5'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isCompleted ? 'bg-gold/10 text-gold' :
                isCurrent ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/30'
              }`}>
                {isCompleted ? <CheckCircle size={20} /> : isLocked ? <Lock size={20} /> : <span className="text-xl font-bold">{phase.week}</span>}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-white">{phase.title}</h4>
                <p className="text-xs text-white/40">{phase.subtitle}</p>
              </div>
              {!isLocked && (
                <button 
                  onClick={() => onStartWeek(phase.week)}
                  className={`p-2 rounded-full ${isCurrent ? 'bg-gold text-navy-dark' : 'bg-white/5 text-white/40'}`}>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

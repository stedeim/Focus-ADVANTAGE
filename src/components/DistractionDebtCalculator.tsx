import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Clock, BrainCircuit, AlertTriangle, ChevronsRight } from 'lucide-react';

const COMPLEXITY_LEVELS = {
  low: {
    label: 'Shallow Task',
    multiplier: 3,
    tax: 5, // minutes
    color: 'text-emerald-400',
    description: 'e.g., Routine emails, admin tasks'
  },
  medium: {
    label: 'Moderate Task',
    multiplier: 5,
    tax: 10, // minutes
    color: 'text-yellow-400',
    description: 'e.g., Writing a report, planning'
  },
  high: {
    label: 'Deep Work',
    multiplier: 7,
    tax: 15, // minutes
    color: 'text-red-400',
    description: 'e.g., Coding, strategic analysis'
  },
};

export const DistractionDebtCalculator: React.FC = () => {
  const [interruptionTime, setInterruptionTime] = useState(30); // in seconds
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('high');

  const { debt, recoveryTime, tax, totalCostMultiplier } = useMemo(() => {
    const level = COMPLEXITY_LEVELS[complexity];
    const recovery = interruptionTime * level.multiplier;
    const taxInSeconds = level.tax * 60;
    const totalDebtInSeconds = recovery + taxInSeconds;
    
    const totalCost = totalDebtInSeconds / interruptionTime;

    return {
      debt: totalDebtInSeconds,
      recoveryTime: recovery,
      tax: taxInSeconds,
      totalCostMultiplier: isNaN(totalCost) || !isFinite(totalCost) ? 0 : totalCost,
    };
  }, [interruptionTime, complexity]);

  const formatSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white">Distraction Debt Calculator</h2>
          <p className="text-white/40 mt-2">Quantify the true cost of a "quick" interruption.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6 glass-card p-6 border-white/5">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
                <Clock size={14} />
                Interruption Time
              </label>
              <div className="flex items-center gap-4 mt-3">
                <input 
                  type="range"
                  min="5" 
                  max="300"
                  step="5"
                  value={interruptionTime}
                  onChange={(e) => setInterruptionTime(Number(e.target.value))}
                  className="w-full accent-gold"
                />
                <span className="text-lg font-bold text-gold w-24 text-center tabular-nums">{formatSeconds(interruptionTime)}</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
                <BrainCircuit size={14} />
                Task Complexity
              </label>
              <div className="grid grid-cols-1 gap-2 mt-3">
                {Object.entries(COMPLEXITY_LEVELS).map(([key, value]) => (
                  <button 
                    key={key}
                    onClick={() => setComplexity(key as any)}
                    className={`p-3 text-left rounded-xl border transition-all text-sm ${complexity === key ? 'bg-navy-medium border-gold/50' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                      <p className={`font-bold ${value.color}`}>{value.label}</p>
                      <p className="text-xs text-white/30 mt-1">{value.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <motion.div 
              key={debt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-navy-medium border border-gold/30 rounded-2xl p-6 text-center space-y-2"
            >
              <p className="text-xs font-bold text-gold uppercase tracking-widest">Total Distraction Debt</p>
              <p className="text-5xl font-bold text-white">{formatSeconds(debt)}</p>
              <p className="text-white/40 text-sm">This is the real time lost.</p>
            </motion.div>

            <div className="glass-card p-6 border-white/5 space-y-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Cost Breakdown</h3>
              <div className="flex justify-between items-center">
                <p className="text-sm text-white/60">Recovery Time</p>
                <p className="font-mono text-white">{formatSeconds(interruptionTime)} x {COMPLEXITY_LEVELS[complexity].multiplier} = <span className="font-bold text-gold">{formatSeconds(recoveryTime)}</span></p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-white/60">Attention Residue Tax</p>
                <p className="font-mono text-white"><span className="font-bold text-gold">{formatSeconds(tax)}</span></p>
              </div>
              <div className="w-full h-px bg-white/10 my-2"></div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-white">Total Debt</p>
                <p className="font-mono font-bold text-white">{formatSeconds(debt)}</p>
              </div>
            </div>

            <div className="bg-red-900/40 border border-red-500/30 rounded-2xl p-6 text-center">
                <p className="text-xs font-bold text-red-300 uppercase tracking-widest">Cost Multiplier</p>
                <p className="text-3xl font-bold text-white mt-1">{totalCostMultiplier.toFixed(1)}x</p>
                <p className="text-red-300/60 text-xs mt-1">The interruption cost <span className="font-bold">{totalCostMultiplier.toFixed(0)} times more</span> than you thought.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5 text-sm text-white/60 leading-relaxed space-y-4">
            <p><strong>Distraction Debt</strong> is the hidden cost of context switching. When you get interrupted, you don't just lose the time of the interruption itself; you pay a heavy tax in mental recovery and lingering attention residue.</p>
            <p>This calculator demonstrates why protecting your first 90 minutes with the <strong>Morning Lock-In Protocol</strong> is critical for accumulating deep work assets, not attention debt.</p>
        </div>
      </div>
    </div>
  );
};

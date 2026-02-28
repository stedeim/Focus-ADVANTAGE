import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Brain, Moon, Calendar, Cloud, TrendingUp, Info, Zap, AlertCircle } from 'lucide-react';
import { predictionEngine, FocusFactor } from '../services/predictionEngine';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const FocusPrediction: React.FC = () => {
  const [history, setHistory] = useState<FocusFactor[]>([]);
  const [todayFactors, setTodayFactors] = useState({
    sleep: 7.5,
    density: 0.4,
    weather: 0.8
  });
  const [predictedScore, setPredictedScore] = useState(0);

  useEffect(() => {
    // Load or generate mock history
    const saved = localStorage.getItem('focus_history_v2');
    if (saved) {
      setHistory(JSON.parse(saved));
    } else {
      const mock = predictionEngine.generateMockHistory(30);
      setHistory(mock);
      localStorage.setItem('focus_history_v2', JSON.stringify(mock));
    }
  }, []);

  useEffect(() => {
    const score = predictionEngine.predict(todayFactors.sleep, todayFactors.density, todayFactors.weather);
    setPredictedScore(score);
  }, [todayFactors]);

  const getRecommendation = (score: number) => {
    if (score >= 85) return {
      title: "Elite Focus Day",
      desc: "Your biological and environmental factors are perfectly aligned. Schedule your most complex Deep Work sessions today.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    };
    if (score >= 65) return {
      title: "Strong Focus Potential",
      desc: "Good conditions for meaningful work. Aim for at least two 90-minute Focus Blocks.",
      color: "text-gold",
      bg: "bg-gold/10",
      border: "border-gold/20"
    };
    return {
      title: "Maintenance Day",
      desc: "Factors are suboptimal. Focus on shallow work, admin tasks, or recovery. Don't force high-stakes creative work.",
      color: "text-white/60",
      bg: "bg-white/5",
      border: "border-white/10"
    };
  };

  const rec = getRecommendation(predictedScore);

  return (
    <div className="space-y-8 py-6">
      <section className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Focus Prediction Engine</h3>
          <p className="text-white/40 text-sm mt-1">ML-driven insights based on your biological rhythms.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full border border-gold/20">
          <Zap size={12} className="text-gold" />
          <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Beta Engine v1.0</span>
        </div>
      </section>

      {/* Today's Prediction Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-8 border-gold/20 bg-gold/5 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="text-center md:text-left space-y-2">
              <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Predicted Focus Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-bold text-white tracking-tighter">{predictedScore}</span>
                <span className="text-white/20 text-xl">/100</span>
              </div>
            </div>
            
            <div className={`flex-1 p-6 rounded-2xl border ${rec.bg} ${rec.border} space-y-3`}>
              <div className="flex items-center gap-2">
                <Zap size={16} className={rec.color} />
                <h4 className={`text-sm font-bold uppercase tracking-widest ${rec.color}`}>{rec.title}</h4>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {rec.desc}
              </p>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-gold/5 blur-3xl rounded-full" />
        </div>

        {/* Factors Input/Display */}
        <div className="glass-card p-6 border-white/5 bg-navy-medium/30 space-y-6">
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Daily Factors</h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span className="flex items-center gap-1.5 text-white/40"><Moon size={12} /> Sleep</span>
                <span className="text-white">{todayFactors.sleep}h</span>
              </div>
              <input 
                type="range" min="4" max="10" step="0.5" 
                value={todayFactors.sleep}
                onChange={(e) => setTodayFactors({...todayFactors, sleep: parseFloat(e.target.value)})}
                className="w-full h-1 bg-white/5 rounded-full appearance-none accent-gold cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span className="flex items-center gap-1.5 text-white/40"><Calendar size={12} /> Calendar Density</span>
                <span className="text-white">{Math.round(todayFactors.density * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={todayFactors.density}
                onChange={(e) => setTodayFactors({...todayFactors, density: parseFloat(e.target.value)})}
                className="w-full h-1 bg-white/5 rounded-full appearance-none accent-gold cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span className="flex items-center gap-1.5 text-white/40"><Cloud size={12} /> Weather Score</span>
                <span className="text-white">{Math.round(todayFactors.weather * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={todayFactors.weather}
                onChange={(e) => setTodayFactors({...todayFactors, weather: parseFloat(e.target.value)})}
                className="w-full h-1 bg-white/5 rounded-full appearance-none accent-gold cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-start gap-3">
            <Info size={14} className="text-white/20 mt-0.5" />
            <p className="text-[9px] text-white/20 leading-relaxed italic">
              Factors are currently simulated. Connect Apple Health or Google Calendar for real-time sync.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Correlation Chart */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-gold" />
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Historical Correlation</h4>
          </div>
          <span className="text-[10px] text-white/20 font-medium">Last 30 Days</span>
        </div>

        <div className="glass-card p-6 border-white/5 bg-navy-medium/20 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                hide 
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="rgba(255,255,255,0.2)" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0A0A0B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#EAB308' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#EAB308" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Moon size={20} />
          </div>
          <div className="space-y-1">
            <h5 className="text-sm font-bold text-white">Sleep Correlation</h5>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Your data shows a <span className="text-emerald-400 font-bold">+12%</span> increase in focus for every hour of sleep above 7.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 flex-shrink-0">
            <AlertCircle size={20} />
          </div>
          <div className="space-y-1">
            <h5 className="text-sm font-bold text-white">Density Warning</h5>
            <p className="text-[11px] text-white/40 leading-relaxed">
              High calendar density (over 60%) consistently leads to a <span className="text-red-400 font-bold">-18 point</span> drop in deep work capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

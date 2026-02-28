import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { FocusPrediction } from './FocusPrediction';
import { TrendingUp, Brain } from 'lucide-react';

const focusScoreData = [
  { name: 'Week 1', score: 68 },
  { name: 'Week 2', score: 72 },
  { name: 'Week 3', score: 78 },
  { name: 'Week 4', score: 84 },
];

const workBreakdownData = [
  { name: 'Deep Work', value: 70, color: '#EAB308' },
  { name: 'Shallow Work', value: 30, color: '#3B82F6' },
];

const distractionData = [
  { name: 'Social Media', value: 45 },
  { name: 'Email', value: 28 },
  { name: 'Colleagues', value: 15 },
  { name: 'Other', value: 12 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-medium/80 backdrop-blur-sm border border-white/10 p-3 rounded-lg shadow-lg">
        <p className="text-xs font-bold text-white/60">{label}</p>
        <p className="text-sm font-bold text-gold">Focus Score: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export const AnalyticsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'historical' | 'predictive'>('historical');

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Your Analytics</h2>
          <p className="text-xs text-white/40">An overview of your focus performance.</p>
        </div>

        <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 self-start">
          <button
            onClick={() => setActiveTab('historical')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'historical' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <TrendingUp size={14} />
            Historical
          </button>
          <button
            onClick={() => setActiveTab('predictive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'predictive' ? 'bg-gold text-navy-dark shadow-lg' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <Brain size={14} />
            Predictive
          </button>
        </div>
      </div>

      {activeTab === 'predictive' ? (
        <FocusPrediction />
      ) : (
        <>
          {/* Focus Score Over Time */}
          <div className="glass-card p-6 h-64 border-white/5">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Focus Score Over Time</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={focusScoreData} margin={{ top: 5, right: 20, left: -20, bottom: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[60, 90]} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(234, 179, 8, 0.5)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="score" stroke="#EAB308" strokeWidth={3} dot={{ r: 4, fill: '#EAB308' }} activeDot={{ r: 8, stroke: 'rgba(234, 179, 8, 0.3)', strokeWidth: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Work Breakdown */}
            <div className="glass-card p-6 h-64 border-white/5 flex flex-col">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Work Breakdown</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={workBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5}>
                    {workBreakdownData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                {workBreakdownData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-white/60">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Distraction Analysis */}
            <div className="glass-card p-6 h-64 border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Top Distractions</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distractionData} layout="vertical" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                  <Bar dataKey="value" fill="rgba(234, 179, 8, 0.3)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Clock, Zap, Coffee, BookOpen } from 'lucide-react';

export interface PlannerBlock {
  id: string;
  title: string;
  type: 'deep' | 'shallow' | 'break' | 'learning';
  startTime: number; // Hour from 0-23
  duration: number; // in hours
}

interface AddBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (block: Omit<PlannerBlock, 'id'>) => void;
  dayStartHour: number;
}

const blockTypes = [
  { id: 'deep', label: 'Deep Work', icon: Zap, color: 'gold' },
  { id: 'shallow', label: 'Shallow Work', icon: Clock, color: 'blue-400' },
  { id: 'learning', label: 'Learning', icon: BookOpen, color: 'purple-400' },
  { id: 'break', label: 'Break', icon: Coffee, color: 'green-400' },
];

export const AddBlockModal: React.FC<AddBlockModalProps> = ({ isOpen, onClose, onAddBlock, dayStartHour }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'deep' | 'shallow' | 'break' | 'learning'>('deep');
  const [startTime, setStartTime] = useState(9);
  const [duration, setDuration] = useState(2);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title) return;
    onAddBlock({ title, type, startTime, duration });
    onClose();
    // Reset form
    setTitle('');
    setType('deep');
    setStartTime(9);
    setDuration(2);
  };

  return (
    <div className="fixed inset-0 bg-navy-dark/50 backdrop-blur-lg flex items-center justify-center z-50 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-navy-medium border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-6 relative"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Add New Block</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5">
            <X size={20} />
          </button>
        </div>

        {/* Title Input */}
        <div>
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='e.g., "Finalize Q1 Report"'
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all mt-2"
          />
        </div>

        {/* Block Type */}
        <div>
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {blockTypes.map(blockType => (
              <button 
                key={blockType.id}
                onClick={() => setType(blockType.id as any)}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${type === blockType.id ? `border-${blockType.color} bg-${blockType.color}/10` : 'border-transparent bg-white/5'}`}>
                <blockType.icon size={20} className={`text-${blockType.color}`} />
                <span className="text-xs font-bold text-white">{blockType.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Start Time</label>
            <select 
              value={startTime}
              onChange={(e) => setStartTime(parseInt(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-gold outline-none transition-all mt-2 appearance-none">
              {Array.from({ length: 15 }, (_, i) => i + dayStartHour).map(hour => (
                <option key={hour} value={hour}>{`${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 || hour === 24 ? 'AM' : 'PM'}`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Duration</label>
            <select 
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-gold outline-none transition-all mt-2 appearance-none">
              {[0.5, 1, 1.5, 2, 2.5, 3, 4].map(d => (
                <option key={d} value={d}>{`${d} hour${d > 1 ? 's' : ''}`}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={handleSubmit} className="gold-button w-full">
          Add Block to Planner
        </button>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { AddBlockModal, PlannerBlock } from './AddBlockModal';

const DAY_START_HOUR = 7;

const timeSlots = Array.from({ length: 15 }, (_, i) => {
  const hour = i + DAY_START_HOUR;
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
});

const blockTypeColors = {
  deep: 'gold',
  shallow: 'blue-400',
  learning: 'purple-400',
  break: 'green-400',
};

export const Planner: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blocks, setBlocks] = useState<PlannerBlock[]>([]);

  const handleAddBlock = (newBlock: Omit<PlannerBlock, 'id'>) => {
    setBlocks([...blocks, { ...newBlock, id: Date.now().toString() }]);
  };

  return (
    <>
      <div className="h-full flex flex-col relative py-6">
        {/* Header */}
        <div className="flex items-center justify-between px-2 mb-6">
          <button className="p-2 rounded-md hover:bg-white/5">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h3 className="text-lg font-bold text-white">Today</h3>
            <p className="text-xs text-white/40">Thursday, Feb 26</p>
          </div>
          <button className="p-2 rounded-md hover:bg-white/5">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pr-4">
          <div className="relative">
            {timeSlots.map((time, i) => (
              <div key={time} className="h-16 flex gap-4">
                <div className="w-12 text-right">
                  <span className="text-[10px] font-bold text-white/30 relative -top-2">{time}</span>
                </div>
                <div className="flex-1 border-t border-white/5"></div>
              </div>
            ))}

            {/* Render Blocks */}
            {blocks.map(block => {
              const top = (block.startTime - DAY_START_HOUR) * 64; // 64px per hour
              const height = block.duration * 64;
              const color = blockTypeColors[block.type];

              return (
                <div 
                  key={block.id}
                  className={`absolute left-[64px] right-0 bg-${color}/10 border-l-4 border-${color} p-3 rounded-lg`}
                  style={{ top: `${top}px`, height: `${height}px`}}
                >
                  <h4 className={`text-xs font-bold text-${color}`}>{block.title}</h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Button */}
        <div className="absolute bottom-8 right-0">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="gold-button rounded-full w-16 h-16 flex items-center justify-center shadow-lg shadow-gold/10">
            <Plus size={24} />
          </button>
        </div>
      </div>
      <AddBlockModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddBlock={handleAddBlock} 
        dayStartHour={DAY_START_HOUR} 
      />
    </>
  );
};

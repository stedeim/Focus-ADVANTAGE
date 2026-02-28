import React, { useState } from 'react';
import { Settings, Users, Bell, Info } from 'lucide-react';
import { GroupCharter } from './GroupCharter';
import { CircleFeed } from './CircleFeed';
import { CircleRitualResources } from './CircleRitualResources';
import { AnimatePresence } from 'motion/react';

export const CircleHomeScreen: React.FC = () => {
  const [hasJoined, setHasJoined] = useState(false);
  const [showResources, setShowResources] = useState(false);

  if (!hasJoined) {
    return <GroupCharter onSign={() => setHasJoined(true)} />;
  }

  return (
    <div className="h-full flex flex-col bg-navy-dark">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-navy-dark/50 backdrop-blur-xl z-20">
        <div>
          <h2 className="text-lg font-bold text-white">Your Circle</h2>
          <p className="text-[10px] font-bold text-gold uppercase tracking-widest">The Q4 Finishers</p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowResources(true)}
            className="p-2 rounded-full hover:bg-white/5 text-white/40"
            title="Circle Resources"
          >
            <Info size={18} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/5 text-white/40">
            <Bell size={18} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/5 text-white/40">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Circle Feed */}
      <div className="flex-1 overflow-hidden">
        <CircleFeed />
      </div>

      {/* Ritual Resources Modal */}
      <AnimatePresence>
        {showResources && (
          <CircleRitualResources onClose={() => setShowResources(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

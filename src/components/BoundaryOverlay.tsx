import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X, Send, Zap, Clock } from 'lucide-react';
import { encryptData } from '../services/cryptoService';

interface BoundaryOverlayProps {
  timeLeft: string;
  progress: number;
  onExit: () => void;
  task?: string;
}

export const BoundaryOverlay: React.FC<BoundaryOverlayProps> = ({ timeLeft, progress, onExit, task }) => {
  const [distraction, setDistraction] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogConfirm, setShowLogConfirm] = useState(false);

  const handleLogDistraction = async () => {
    if (!distraction.trim()) return;
    const newLogs = [distraction, ...logs];
    setLogs(newLogs);
    
    // Persist to localStorage for the Vault
    try {
      const user = localStorage.getItem('focus_user');
      const userId = user ? JSON.parse(user).email : 'guest';
      
      const savedDistractions = JSON.parse(localStorage.getItem('focus_distractions') || '[]');
      
      // Encrypt the distraction text
      const encryptedText = await encryptData(distraction, userId);
      
      localStorage.setItem('focus_distractions', JSON.stringify([
        { text: encryptedText, timestamp: new Date().toISOString(), encrypted: true },
        ...savedDistractions
      ]));
    } catch (e) {
      console.warn('Failed to save distraction', e);
    }

    setDistraction('');
    setShowLogConfirm(true);
    setTimeout(() => setShowLogConfirm(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-navy-dark flex flex-col items-center justify-center p-8 text-center"
    >
      {/* Immersive Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.03)_0%,transparent_70%)]" />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0%,transparent_50%)]"
        />
      </div>

      {/* Boundary Shield Icon */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 flex flex-col items-center gap-3"
      >
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold shadow-[0_0_30px_rgba(234,179,8,0.2)]">
          <Shield size={32} />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">Boundary Mode Active</span>
        </div>
      </motion.div>

      {/* Main Timer Display */}
      <div className="relative mb-16">
        <motion.h1 
          key={timeLeft}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-8xl font-bold tracking-tighter text-white tabular-nums"
        >
          {timeLeft}
        </motion.h1>
        
        {/* Progress Bar */}
        <div className="mt-8 w-64 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            className="h-full bg-gold shadow-[0_0_10px_rgba(234,179,8,0.5)]"
          />
        </div>
      </div>

      {/* Current Task */}
      <div className="mb-16 max-w-xs">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Current Mission</p>
        <h2 className="text-xl font-medium text-white/80 italic">
          "{task || 'Deep Work Session'}"
        </h2>
      </div>

      {/* Distraction Log */}
      <div className="w-full max-w-sm space-y-4">
        <div className="relative">
          <input 
            type="text"
            value={distraction}
            onChange={(e) => setDistraction(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogDistraction()}
            placeholder="Quick log a distraction..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/20 focus:border-gold/50 outline-none transition-all pr-12"
          />
          <button 
            onClick={handleLogDistraction}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-gold transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        
        <AnimatePresence>
          {showLogConfirm && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest"
            >
              <Zap size={12} />
              Logged to Vault. Stay focused.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Exit Button */}
      <button 
        onClick={onExit}
        className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:bg-white/10 hover:text-white transition-all group"
      >
        <X size={20} className="group-hover:rotate-90 transition-transform" />
      </button>

      {/* Stats Overlay (Bottom) */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-12 text-white/20">
        <div className="flex flex-col items-center gap-1">
          <Clock size={16} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Session</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Shield size={16} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Protected</span>
        </div>
      </div>
    </motion.div>
  );
};

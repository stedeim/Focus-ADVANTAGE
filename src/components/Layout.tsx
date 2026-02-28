import React from 'react';
import { LayoutDashboard, Timer, MessageSquare, Shield, User, Calendar, BarChart2, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentWeek: number;
  avatarUrl?: string | null;
  onAvatarUpload?: (url: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'planner', label: 'Planner', icon: Calendar },
  { id: 'timer', label: 'Focus', icon: Timer },
  { id: 'circle', label: 'Circle', icon: Users },
  { id: 'coach', label: 'Coach', icon: MessageSquare },
  { id: 'vault', label: 'Vault', icon: Shield },
  { id: 'analytics', label: 'Stats', icon: BarChart2 },
  { id: 'debt-calculator', label: 'Debt Calc', icon: AlertTriangle },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, currentWeek, avatarUrl, onAvatarUpload }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-navy-dark text-white overflow-hidden relative">
      {/* Immersive Background */}
      <div className="atmosphere" />

      {/* Progress Bar (Global Context) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '32%' }}
          className="h-full bg-gold shadow-[0_0_10px_rgba(234,179,8,0.5)]"
        />
      </div>

      {/* Header */}
      <header className="h-20 flex items-center justify-between px-6 z-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-serif italic text-gold tracking-tight">
            Focus Advantage
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              Phase {currentWeek} of 6
            </span>
          </div>
        </div>
        
        <div className="relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={handleAvatarClick}
            className="w-10 h-10 rounded-full bg-navy-medium border border-white/10 flex items-center justify-center overflow-hidden shadow-lg hover:border-gold/50 transition-all group"
          >
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User size={18} className="text-gold/60 group-hover:text-gold transition-colors" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 z-10 scrollbar-hide">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-md mx-auto h-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-navy-dark/80 backdrop-blur-2xl border-t border-white/5 px-4 flex items-center justify-between z-20">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="relative flex flex-col items-center gap-1 group w-14"
          >
            <div className={`p-2 rounded-2xl transition-all duration-300 ${
              activeTab === item.id 
                ? 'text-gold scale-110' 
                : 'text-white/20 hover:text-white/40'
            }`}>
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider transition-opacity duration-300 ${
              activeTab === item.id ? 'opacity-100 text-gold' : 'opacity-0'
            }`}>
              {item.label}
            </span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -top-2 w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

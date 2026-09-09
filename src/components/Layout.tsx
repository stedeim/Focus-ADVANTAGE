import React from 'react';
import { LayoutDashboard, LogOut, Timer } from 'lucide-react';
import { motion } from 'motion/react';
import { LEGAL_LINKS } from '../lib/brand';
import { AppLink } from './AppLink';
import { LegalFooter } from './LegalFooter';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'timer';
  setActiveTab: (tab: 'dashboard' | 'timer') => void;
  userLabel?: string;
  isGuest?: boolean;
  onSignOut?: () => void;
}

const navItems = [
  { id: 'dashboard' as const, label: 'Home', icon: LayoutDashboard },
  { id: 'timer' as const, label: 'Focus', icon: Timer },
];

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  userLabel,
  isGuest = false,
  onSignOut,
}) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-navy-dark text-white overflow-hidden relative">
      <div className="atmosphere" />

      <nav className="hidden md:flex flex-col w-64 bg-navy-dark/80 backdrop-blur-2xl border-r border-white/5 z-20 p-6">
        <div className="mb-12">
          <h1 className="text-2xl font-serif italic text-gold tracking-tight">Focus Advantage</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mt-2">MVP Mode</p>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id
                  ? 'bg-gold/10 text-gold border border-gold/20'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
              {activeTab === item.id && (
                <motion.div
                  layoutId="nav-indicator-desktop"
                  className="ml-auto w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                />
              )}
            </button>
          ))}
        </div>

        {onSignOut && (
          <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
            <div className="px-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                {isGuest ? 'Guest session' : 'Signed in'}
              </p>
              <p className="text-xs text-white/55 truncate">{userLabel || (isGuest ? 'Local only' : 'Account')}</p>
            </div>
            <nav aria-label="Account and legal" className="grid grid-cols-2 gap-1 px-1">
              {LEGAL_LINKS.map((link) => (
                <AppLink
                  key={link.to}
                  to={link.to}
                  className="text-[10px] font-bold uppercase tracking-widest text-white/35 hover:text-gold transition-colors py-1"
                >
                  {link.label}
                </AppLink>
              ))}
            </nav>
            <button
              type="button"
              onClick={onSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:text-gold hover:bg-white/5 transition-colors"
            >
              <LogOut size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Sign out</span>
            </button>
          </div>
        )}
      </nav>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="md:hidden h-20 flex items-center justify-between gap-3 px-6 z-10">
          <div className="flex flex-col min-w-0">
            <h1 className="text-2xl font-serif italic text-gold tracking-tight">Focus Advantage</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mt-0.5 truncate">
              {isGuest ? 'Guest · MVP Mode' : userLabel || 'MVP Mode'}
            </p>
          </div>
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="shrink-0 w-10 h-10 rounded-2xl border border-white/10 bg-white/5 text-white/50 flex items-center justify-center hover:text-gold hover:border-gold/20 transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto px-6 pb-32 md:pb-12 pt-4 z-10 scrollbar-hide">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-4xl mx-auto h-full"
          >
            {children}
          </motion.div>
          <div className="max-w-4xl mx-auto mt-8 md:hidden">
            <LegalFooter />
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 min-h-24 bg-navy-dark/80 backdrop-blur-2xl border-t border-white/5 px-4 flex items-center justify-around z-20 pb-[env(safe-area-inset-bottom)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center gap-1 group w-14"
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'text-gold scale-110' : 'text-white/20 hover:text-white/40'}`}>
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider transition-opacity duration-300 ${activeTab === item.id ? 'opacity-100 text-gold' : 'opacity-0'}`}>
                {item.label}
              </span>
              {activeTab === item.id && (
                <motion.div
                  layoutId="nav-indicator-mobile"
                  className="absolute -top-2 w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

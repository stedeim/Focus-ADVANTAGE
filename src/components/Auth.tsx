import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Mail, User } from 'lucide-react';

interface AuthProps {
  onAuthComplete: (user: { email: string; name: string }) => void;
  onGuestLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthComplete, onGuestLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const safeName = name.trim();
    const safeEmail = email.trim();

    onAuthComplete({
      email: safeEmail,
      name: safeName || safeEmail.split('@')[0] || 'Guest User',
    });
  };

  return (
    <div className="min-h-screen bg-navy-dark text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="atmosphere" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-serif italic text-gold tracking-tight">Focus Advantage</h1>
          <h2 className="text-2xl font-bold">Sign in to continue</h2>
          <p className="text-white/40 text-sm">
            Save your mission and review notes so you can pick up where you left off.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
            <input
              type="text"
              required
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
            />
          </div>

          <button type="submit" className="gold-button w-full">
            Continue
            <ChevronRight size={18} />
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-navy-dark px-4 text-white/20">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGuestLogin}
          className="w-full text-center text-xs text-white/40 hover:text-gold transition-colors uppercase tracking-widest font-bold"
        >
          Continue as Guest
        </button>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ChevronRight, Github, Chrome, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onAuthComplete: (user: { email: string; name: string }) => void;
  onGuestLogin: () => void;
  onBack?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthComplete, onGuestLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    onAuthComplete({ email, name: name || email.split('@')[0] });
  };

  return (
    <div className="min-h-screen bg-navy-dark text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="atmosphere" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif italic text-gold tracking-tight">Focus Advantage</h1>
          <h2 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create Your Account'}</h2>
          <p className="text-white/40 text-sm">
            {isLogin ? 'Log in to continue your focus journey.' : 'Save your focus profile and start training.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
              />
            </div>
          )}
          
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
            />
          </div>

          <button type="submit" className="gold-button w-full">
            {isLogin ? 'Log In' : 'Create Account'}
            <ChevronRight size={18} />
          </button>
        </form>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-navy-dark px-4 text-white/20">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl py-3 hover:bg-white/10 transition-all">
              <Chrome size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl py-3 hover:bg-white/10 transition-all">
              <Github size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">GitHub</span>
            </button>
          </div>
          <button 
            onClick={onGuestLogin}
            className="w-full text-center text-xs text-white/40 hover:text-gold transition-colors uppercase tracking-widest font-bold mt-4"
          >
            Continue as Guest (for testing)
          </button>
        </div>

        <div className="text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-white/40 hover:text-gold transition-colors uppercase tracking-widest font-bold"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>

        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/20 hover:text-white transition-colors mx-auto text-[10px] uppercase tracking-widest font-bold"
          >
            <ArrowLeft size={14} />
            Back to Assessment
          </button>
        )}
      </motion.div>
    </div>
  );
};

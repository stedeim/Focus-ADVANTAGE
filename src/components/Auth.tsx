import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Check, ChevronRight, Mail, User } from 'lucide-react';
import { sendMagicLink, SUPABASE_CONFIG_MESSAGE } from '../lib/supabaseClient';

interface AuthProps {
  supabaseConfigured: boolean;
  onGuestLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ supabaseConfigured, onGuestLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!supabaseConfigured) {
      setError(SUPABASE_CONFIG_MESSAGE);
      return;
    }

    const safeEmail = email.trim().toLowerCase();
    if (!safeEmail) {
      setError('Enter the email address for your magic link.');
      return;
    }

    setStatus('sending');
    const { error: sendError } = await sendMagicLink(safeEmail, name);
    if (sendError) {
      setStatus('idle');
      setError(sendError);
      return;
    }

    setStatus('sent');
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
            Recommended: email a magic link so your mission, review, and streak follow you across devices.
          </p>
        </div>

        {!supabaseConfigured && (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 flex items-start gap-3 text-sm text-amber-100">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-300" />
            <p>{SUPABASE_CONFIG_MESSAGE}</p>
          </div>
        )}

        {status === 'sent' ? (
          <div className="rounded-3xl border border-gold/20 bg-white/5 p-6 space-y-3 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Check className="text-gold" size={22} />
            </div>
            <h3 className="text-xl font-bold">Check your email</h3>
            <p className="text-sm text-white/55 leading-relaxed">
              We sent a sign-in link to <span className="text-white font-semibold">{email.trim()}</span>.
              Open it on this device to restore your session.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="text-xs uppercase tracking-widest font-bold text-white/40 hover:text-gold transition-colors"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
              <input
                type="text"
                placeholder="Name (optional)"
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

            {error && (
              <p className="text-sm text-amber-200/90 leading-relaxed">{error}</p>
            )}

            <button
              type="submit"
              disabled={!supabaseConfigured || status === 'sending'}
              className="gold-button w-full disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending link…' : 'Email me a magic link'}
              {status !== 'sending' && <ChevronRight size={18} />}
            </button>
          </form>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-navy-dark px-4 text-white/20">Or</span>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <button
            type="button"
            onClick={onGuestLogin}
            className="w-full text-center text-xs text-white/40 hover:text-gold transition-colors uppercase tracking-widest font-bold"
          >
            Continue as Guest
          </button>
          <p className="text-[11px] text-white/25">Guest progress stays on this device only.</p>
        </div>
      </motion.div>
    </div>
  );
};

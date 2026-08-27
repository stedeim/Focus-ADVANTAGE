import React from 'react';
import { motion } from 'motion/react';
import { Check, Crown, Sparkles, Lock } from 'lucide-react';

interface PaywallProps {
  onUpgradeNow: () => void;
  onNotNow: () => void;
}

const premiumBullets = [
  'Unlimited focus sessions',
  'Progress history',
  'Advanced insights',
  'Future premium tools',
];

export const Paywall: React.FC<PaywallProps> = ({ onUpgradeNow, onNotNow }) => {
  return (
    <div className="min-h-screen bg-navy-dark text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="atmosphere" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full rounded-3xl border border-gold/20 bg-navy-medium/95 backdrop-blur-xl p-6 shadow-[0_0_50px_rgba(234,179,8,0.08)] relative z-10"
      >
        <div className="flex items-center gap-3 text-gold mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Crown size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/80">Premium</p>
            <h1 className="text-2xl font-bold">Unlock Premium</h1>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center gap-3">
          <Lock size={16} className="text-white/40 shrink-0" />
          <p className="text-sm text-white/65 leading-relaxed">
            You are on the <span className="text-white font-semibold">Free Plan</span> right now. Upgrade when you want more depth.
          </p>
        </div>

        <p className="text-sm text-white/60 leading-relaxed mb-5">
          Keep your focus flow simple now and unlock deeper history, insights, and future tools when you’re ready. Checkout opens securely in Stripe.
        </p>

        <div className="space-y-3 mb-6">
          {premiumBullets.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <Check size={16} className="text-gold shrink-0" />
              <span className="text-sm text-white/80">{item}</span>
            </div>
          ))}
        </div>

        <button onClick={onUpgradeNow} className="gold-button w-full mb-3">
          <Sparkles size={16} />
          Continue to Stripe
        </button>

        <button
          onClick={onNotNow}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white/60 hover:text-white hover:border-white/20 transition-all"
        >
          Not now
        </button>

        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-white/25 text-center">
          You can upgrade anytime.
        </p>
      </motion.div>
    </div>
  );
};

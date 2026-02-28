import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Crown, Zap, Star, ChevronRight, ShieldCheck, CreditCard, Lock, Calendar } from 'lucide-react';

interface PaywallProps {
  onSelectTier: (tier: 'recruit' | 'pro' | 'master') => void;
}

const tiers = [
  {
    id: 'recruit',
    name: 'Focus Recruit',
    price: '$19.99',
    period: 'Lifetime',
    description: 'One-time payment. Lifetime access.',
    features: [
      'Basic Deep Work Timer',
      'Daily Progress Dashboard',
      'Focus Flame (Basic)',
      'Community Access'
    ],
    icon: Star,
    color: 'text-white/60',
    border: 'border-white/10'
  },
  {
    id: 'pro',
    name: 'Focus Pro',
    price: '$9.99',
    period: '/mo',
    description: 'For consistent high-performers.',
    features: [
      'Everything in Recruit',
      'Advanced Analytics',
      'Full Boundary Vault',
      'Unlimited Streaks',
      'Custom Focus Presets'
    ],
    icon: Zap,
    color: 'text-gold',
    border: 'border-gold/30',
    popular: true
  },
  {
    id: 'master',
    name: 'Focus Master',
    price: '$19.99',
    period: '/mo',
    description: 'The ultimate focus system.',
    features: [
      'Everything in Pro',
      'AI Focus Coach (24/7)',
      'Deep Thinking Mode',
      'Personalized Training Plan',
      'Priority Support'
    ],
    icon: Crown,
    color: 'text-purple-400',
    border: 'border-purple-500/30'
  }
];

export const Paywall: React.FC<PaywallProps> = ({ onSelectTier }) => {
  const [selectedTier, setSelectedTier] = useState<typeof tiers[0] | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTier) {
      onSelectTier(selectedTier.id as any);
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark text-white flex flex-col items-center py-12 px-6 relative overflow-y-auto">
      <div className="atmosphere" />
      
      <div className="max-w-4xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full">
            <ShieldCheck size={14} className="text-gold" />
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Secure Checkout</span>
          </div>
          <h1 className="text-4xl font-bold">Choose Your Path to Mastery</h1>
          <p className="text-white/40 max-w-md mx-auto">
            Unlock the full power of Focus Advantage. All plans include a 7-day free trial.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedTier ? (
            <motion.div
              key="tiers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {tiers.map((tier) => (
                <motion.div
                  key={tier.id}
                  whileHover={{ y: -5 }}
                  className={`glass-card p-8 flex flex-col h-full relative ${tier.border} ${tier.popular ? 'bg-navy-medium/80' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-6 flex-1">
                    <div className="space-y-2">
                      <tier.icon className={tier.color} size={32} />
                      <h3 className="text-xl font-bold">{tier.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{tier.price}</span>
                        <span className="text-white/40 text-sm">{tier.period}</span>
                      </div>
                      <p className="text-xs text-white/40">{tier.description}</p>
                    </div>

                    <div className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check size={14} className="text-gold mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-white/70 leading-tight">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTier(tier)}
                    className={`w-full mt-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      tier.popular 
                        ? 'gold-button' 
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Start 7-Day Trial
                    <ChevronRight size={14} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-md mx-auto glass-card p-8 border-white/10 bg-navy-medium/80 space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Payment Details</h3>
                  <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Selected: {selectedTier.name}</p>
                </div>
                <button onClick={() => setSelectedTier(null)} className="text-white/40 text-xs hover:text-white underline">Change Plan</button>
              </div>

              <form onSubmit={handleStartTrial} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <CreditCard size={12} /> Card Number
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={12} /> Expiry
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <Lock size={12} /> CVC
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gold/5 border border-gold/10 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-gold uppercase tracking-widest">
                    <ShieldCheck size={12} /> Simulation Mode
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed mb-2">
                    This is a secure simulation. No actual payment will be processed. Please do not enter real credit card information.
                  </p>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Trial Period</span>
                    <span className="text-gold font-bold">7 Days</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">{selectedTier.period === 'Lifetime' ? 'One-time Payment' : 'Monthly Payment'}</span>
                    <span className="text-white font-bold">{selectedTier.price}</span>
                  </div>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="flex justify-between text-sm font-bold">
                    <span>Due Today</span>
                    <span className="text-gold">$0.00</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="gold-button w-full py-5 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <ChevronRight size={18} />
                </button>
              </form>

              <div className="flex items-center justify-center gap-4 opacity-30 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" referrerPolicy="no-referrer" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" referrerPolicy="no-referrer" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" referrerPolicy="no-referrer" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-[10px] text-white/20 uppercase tracking-widest">
          Cancel anytime · 7-day money back guarantee · Secure payment
        </p>
      </div>
    </div>
  );
};

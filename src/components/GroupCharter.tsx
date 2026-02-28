import React from 'react';
import { motion } from 'motion/react';

export const GroupCharter: React.FC<{ onSign: () => void }> = ({ onSign }) => {
  return (
    <div className="h-full flex flex-col p-6 bg-navy-dark text-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gold font-serif italic">The Focus Advantage Circle Charter</h2>
        <p className="text-sm text-white/50">Your Commitment to Deep Work</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 text-sm text-white/70 bg-navy-medium p-6 rounded-2xl border border-white/10 scrollbar-hide">
        <div>
          <h3 className="font-bold text-white mb-2">Our Shared Purpose</h3>
          <p>This Circle exists to be a safe, honest space where we turn our intentions into action. We are not here to be perfect; we are here to be consistent, supportive, and truthful about our work.</p>
        </div>

        <div>
          <h3 className="font-bold text-white mb-2">5 Commitment Pledges</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>I promise to post a Morning Check-In at least 4 days per week.</li>
            <li>I promise to be honest when I am struggling, rather than hiding or ghosting.</li>
            <li>I promise to respond to at least one other member's post daily to show support.</li>
            <li>I promise to keep all Circle conversations confidential and private.</li>
            <li>I promise to treat every member with respect, empathy, and zero judgment.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white mb-2">3 Circle Agreements</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li><span className="font-bold">We Cheer for Effort, Not Just Results:</span> Showing up on a bad day is worth more than a perfect day.</li>
            <li><span className="font-bold">Advice by Permission:</span> We listen first. We only offer tactical advice if the person asks for it.</li>
            <li><span className="font-bold">What's Shared Here, Stays Here:</span> This is a confidential space.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white mb-2">The Minimum Viable Participation Rule</h3>
          <p>Life happens. If you cannot do a full check-in, a "Minimum Viable Participation" (MVP) is simply posting a thumbs-up emoji 👍 or a single sentence. This signals "I'm still here, just busy" and keeps your seat in the circle secure.</p>
        </div>

        <div>
          <h3 className="font-bold text-white mb-2">The Graceful Exit Agreement</h3>
          <p>If this group is no longer serving you, you may leave with grace. We agree to give 1 week's notice and post a goodbye message, rather than silently disappearing. We celebrate your next step, whatever it is.</p>
        </div>
      </div>

      <div className="mt-8">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onSign}
          className="gold-button w-full text-lg font-bold py-4"
        >
          I'm In. I Commit to This Circle.
        </motion.button>
        <p className="text-center text-xs text-white/30 mt-3">You are committing to a 4-week cycle.</p>
      </div>
    </div>
  );
};

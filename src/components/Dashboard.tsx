import React from 'react';
import { ChevronRight, CheckCircle2, Target, BadgePercent, Lock } from 'lucide-react';

interface DashboardProps {
  mission: string;
  reviewNote: string;
  setMission: (mission: string) => void;
  onMissionStart: (mission: string) => void;
  onSaveReview: (note: string) => void;
  onOpenPaywall: () => void;
  isPremium: boolean;
  saveDestination?: 'cloud' | 'local';
}

export const Dashboard: React.FC<DashboardProps> = ({
  mission,
  reviewNote,
  setMission,
  onMissionStart,
  onSaveReview,
  onOpenPaywall,
  isPremium,
  saveDestination = 'local',
}) => {
  const [draftReview, setDraftReview] = React.useState(reviewNote);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    setDraftReview(reviewNote);
  }, [reviewNote]);

  const handleSaveReview = () => {
    onSaveReview(draftReview.trim());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="py-6">
      <section className="glass-card p-6 bg-navy-medium border border-gold/15 shadow-[0_0_30px_rgba(234,179,8,0.05)] space-y-6 max-w-2xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-widest">
              <Target size={14} />
              MVP Home
            </div>
            <h2 className="text-2xl font-bold text-white">Today&apos;s Mission</h2>
            <p className="text-sm text-white/40">Set one task. Start focus. Leave a quick review.</p>
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.25em] border ${
              isPremium
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                : 'bg-white/5 text-white/45 border-white/10'
            }`}
          >
            {isPremium ? <BadgePercent size={14} /> : <Lock size={14} />}
            {isPremium ? 'Premium Active' : 'Free Plan'}
          </div>
        </div>

        {!isPremium && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-widest">
                <Lock size={12} />
                Premium Preview
              </div>
              <p className="text-sm text-white/70">Keep the core loop free and unlock deeper progress when you are ready.</p>
            </div>
            <button
              onClick={onOpenPaywall}
              className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-xs font-bold uppercase tracking-widest text-gold hover:bg-gold/15 transition-colors"
            >
              See Premium
            </button>
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40">
            Mission
          </label>
          <input
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="Example: Finish onboarding copy"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
          />
          <button
            onClick={() => onMissionStart(mission.trim() || 'Deep Work Session')}
            className="gold-button w-full"
          >
            Start Focus Session
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="pt-2 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Quick Review</h3>
              <p className="text-xs text-white/40">One sentence is enough.</p>
            </div>
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>

          <textarea
            value={draftReview}
            onChange={(e) => setDraftReview(e.target.value)}
            placeholder="What moved forward?"
            rows={4}
            className="w-full bg-navy-medium/60 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all resize-none"
          />

          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
              {saveDestination === 'cloud' ? 'Saved to cloud' : 'Saved locally'}
            </span>
            <button
              onClick={handleSaveReview}
              className="px-4 py-3 rounded-2xl bg-gold text-navy-dark font-bold text-xs uppercase tracking-widest"
            >
              {saved ? 'Saved' : 'Save Review'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

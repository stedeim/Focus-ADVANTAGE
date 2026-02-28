import React, { useState, useEffect } from 'react';
import { Copy, Check, Trash2, ShieldAlert, Lock } from 'lucide-react';
import { decryptData } from '../services/cryptoService';

const scripts = [
  {
    title: 'Deep Work Update',
    content: "Hey team, I'm heading into a 90-minute Focus Block for the Q3 report. I'll be back online at 2 PM. Thanks for respecting the deep work!",
    category: 'Slack'
  },
  {
    title: 'Meeting Decline',
    content: "Thanks for the invite! I'm currently protecting my morning Focus Zones for high-leverage work. Could we handle this via email, or meet briefly after 3 PM?",
    category: 'Email'
  },
  {
    title: 'Auto-Reply',
    content: "I am currently in a Focus Block. My brain is offline to the world so I can produce something meaningful. I will respond to all messages during my next shallow work window.",
    category: 'Personal'
  }
];

export const BoundaryVault: React.FC = () => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [distractions, setDistractions] = useState<{text: string, timestamp: string}[]>([]);

  useEffect(() => {
    const loadDistractions = async () => {
      const saved = localStorage.getItem('focus_distractions');
      if (saved) {
        try {
          const user = localStorage.getItem('focus_user');
          const userId = user ? JSON.parse(user).email : 'guest';
          
          const rawDistractions = JSON.parse(saved);
          const decryptedDistractions = await Promise.all(
            rawDistractions.map(async (d: any) => {
              if (d.encrypted) {
                try {
                  const decryptedText = await decryptData(d.text, userId);
                  return { ...d, text: decryptedText };
                } catch (e) {
                  return { ...d, text: '[Encrypted - Decryption Failed]' };
                }
              }
              return d;
            })
          );
          setDistractions(decryptedDistractions);
        } catch (e) {
          console.error("Failed to parse distractions", e);
        }
      }
    };
    
    loadDistractions();
  }, []);

  const clearDistractions = () => {
    localStorage.removeItem('focus_distractions');
    setDistractions([]);
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8 py-6">
      <section>
        <h3 className="text-2xl font-bold text-white">Boundary Vault</h3>
        <p className="text-white/40 text-sm mt-1">Templates for protecting your focus.</p>
      </section>

      {distractions.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-gold" />
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Logged Distractions</h4>
            </div>
            <button 
              onClick={clearDistractions}
              className="text-[10px] font-bold text-white/20 hover:text-red-400 uppercase tracking-widest transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {distractions.map((d, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Lock size={12} className="text-gold/40" />
                  <p className="text-xs text-white/60 italic">"{d.text}"</p>
                </div>
                <span className="text-[8px] font-bold text-white/10 uppercase">{new Date(d.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-white/20 uppercase tracking-widest px-1">Boundary Scripts</h4>
        {scripts.map((script, i) => (
          <div key={i} className="glass-card p-6 space-y-4 border-white/5 hover:border-gold/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-gold/10 text-gold text-[8px] font-bold rounded uppercase tracking-widest">
                  {script.category}
                </span>
                <h4 className="text-sm font-bold text-white">{script.title}</h4>
              </div>
              <button 
                onClick={() => copyToClipboard(script.content, i)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-gold transition-all border border-white/5"
              >
                {copiedIdx === i ? <Check size={14} className="text-gold" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-white/60 text-xs italic leading-relaxed">
                "{script.content}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Play, Pause, Music, Wind, CloudRain, Library } from 'lucide-react';

interface Soundscape {
  id: string;
  name: string;
  icon: React.ElementType;
  url: string;
}

const SOUNDSCAPES: Soundscape[] = [
  { 
    id: 'binaural', 
    name: 'Binaural Focus', 
    icon: Music, 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Placeholder: In real app, use specific binaural frequencies
  },
  { 
    id: 'brown', 
    name: 'Deep Brown Noise', 
    icon: Wind, 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' // Placeholder
  },
  { 
    id: 'rain', 
    name: 'Rain on Tin', 
    icon: CloudRain, 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' // Placeholder
  },
  { 
    id: 'library', 
    name: 'Old Library', 
    icon: Library, 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' // Placeholder
  }
];

interface SoundscapePlayerProps {
  autoPlay?: boolean;
  onStateChange?: (isPlaying: boolean) => void;
}

export const SoundscapePlayer: React.FC<SoundscapePlayerProps> = ({ autoPlay = false, onStateChange }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlay && selectedId && !isPlaying) {
      setIsPlaying(true);
    }
  }, [autoPlay, selectedId]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && selectedId) {
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
      } else {
        audioRef.current.pause();
      }
    }
    onStateChange?.(isPlaying);
  }, [isPlaying, selectedId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!selectedId) setSelectedId(SOUNDSCAPES[0].id);
    setIsPlaying(!isPlaying);
  };

  const selectSound = (id: string) => {
    if (selectedId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedId(id);
      setIsPlaying(true);
    }
  };

  const selectedSound = SOUNDSCAPES.find(s => s.id === selectedId);

  return (
    <div className="glass-card p-6 border-white/5 bg-navy-medium/30 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isPlaying ? 'bg-gold text-navy-dark shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-white/5 text-white/40'
          }`}>
            {selectedSound ? <selectedSound.icon size={20} /> : <Music size={20} />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Focus Soundscape</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">
              {isPlaying ? `Playing: ${selectedSound?.name}` : 'Select a soundscape'}
            </p>
          </div>
        </div>
        <button 
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isPlaying ? 'bg-white/10 text-white' : 'bg-gold text-navy-dark shadow-lg'
          }`}
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SOUNDSCAPES.map((s) => (
          <button
            key={s.id}
            onClick={() => selectSound(s.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
              selectedId === s.id
                ? 'bg-gold/10 border-gold text-gold'
                : 'bg-white/5 border-transparent text-white/20 hover:text-white/40 hover:border-white/10'
            }`}
          >
            <s.icon size={18} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">{s.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button onClick={() => setIsMuted(!isMuted)} className="text-white/40 hover:text-white transition-colors">
          {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <div className="flex-1 h-1 bg-white/5 rounded-full relative group cursor-pointer">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute inset-y-0 left-0 bg-gold rounded-full transition-all"
            style={{ width: `${volume * 100}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${volume * 100}%`, marginLeft: '-6px' }}
          />
        </div>
      </div>

      {selectedId && (
        <audio
          ref={audioRef}
          src={SOUNDSCAPES.find(s => s.id === selectedId)?.url}
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
};

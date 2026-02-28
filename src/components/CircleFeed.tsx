import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Smile, Plus, ChevronRight } from 'lucide-react';
import { CircleMessage, MOCK_INITIAL_MESSAGES } from '../lib/circleData';
import { trackCircleCheckin } from '../services/activityTracker';

const QUICK_REPLIES = [
  "I'm in! 🚀",
  "That's a huge win! 👏",
  "I completely relate to that.",
  "What's the smallest possible win for the next hour?",
  "Rough day, just checking in to stay visible. 🆘"
];

export const CircleFeed: React.FC = () => {
  const [messages, setMessages] = useState<CircleMessage[]>(MOCK_INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage: CircleMessage = {
      id: Date.now().toString(),
      senderId: 'user-1',
      senderName: 'You',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'member'
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');

    // Track activity
    const user = localStorage.getItem('focus_user');
    const userId = user ? JSON.parse(user).email : 'guest';
    trackCircleCheckin(userId);
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="flex flex-col h-full bg-navy-dark relative">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide pb-32"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.type === 'guide' ? 'items-center' : msg.senderId === 'user-1' ? 'items-end' : 'items-start'}`}
            >
              {msg.type === 'guide' ? (
                <div className="w-full max-w-sm bg-gold/5 border border-gold/20 rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-20">
                    <Sparkles size={40} className="text-gold" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-[10px] text-navy-dark font-bold">🤖</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Circle Guide</span>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed font-medium italic">
                    {msg.text}
                  </p>
                </div>
              ) : (
                <div className={`max-w-[85%] ${msg.senderId === 'user-1' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{msg.senderName}</span>
                    <span className="text-[9px] text-white/20">{msg.timestamp}</span>
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.senderId === 'user-1' 
                      ? 'bg-gold text-navy-dark font-medium rounded-tr-none' 
                      : 'bg-navy-medium border border-white/5 text-white/90 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-navy-dark via-navy-dark to-transparent">
        {/* Quick Replies */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-2">
          {QUICK_REPLIES.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleQuickReply(reply)}
              className="whitespace-nowrap px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[11px] font-medium text-white/60 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Text Input */}
        <div className="flex items-center gap-2 bg-navy-medium border border-white/10 rounded-2xl p-2 pl-4 shadow-2xl">
          <button className="p-2 text-white/20 hover:text-white/40">
            <Plus size={20} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`p-3 rounded-xl transition-all ${
              inputText.trim() ? 'bg-gold text-navy-dark' : 'bg-white/5 text-white/10'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

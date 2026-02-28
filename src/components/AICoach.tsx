import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, BrainCircuit } from 'lucide-react';
import Markdown from 'react-markdown';
import { geminiService } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { FocusProfile, OnboardingAnswers } from '../types/onboarding';

interface Message {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

interface AICoachProps {
  profile?: FocusProfile | null;
  answers?: OnboardingAnswers | null;
}

export const AICoach: React.FC<AICoachProps> = ({ profile, answers }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Welcome to Focus Advantage. I am your AI Focus Coach. Your Morning Lock-In is complete. What is our #1 Deep Work priority for this session?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const currentThinkingMode = isThinkingMode;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await geminiService.generateResponse(
        userMessage, 
        history, 
        currentThinkingMode,
        profile || undefined,
        answers || undefined
      );
      setMessages(prev => [...prev, { role: 'model', text: response, isThinking: currentThinkingMode }]);
    } catch (error) {
      console.error("AI Coach Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] relative">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-8 scrollbar-hide pb-32"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                  msg.role === 'user' ? 'bg-white/5 text-white/40' : 'bg-gold text-navy-dark'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className={`p-5 rounded-[24px] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-navy-light text-white rounded-tr-none shadow-lg border border-white/5' 
                      : 'bg-navy-medium text-white/80 border border-white/5 rounded-tl-none shadow-lg'
                  }`}>
                    <div className="markdown-body">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                  {msg.isThinking && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 rounded-full self-start border border-gold/20">
                      <BrainCircuit size={10} className="text-gold" />
                      <span className="text-[8px] font-bold text-gold uppercase tracking-widest">Deep Thinking Mode</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[90%]">
              <div className="w-8 h-8 rounded-full bg-gold text-navy-dark flex items-center justify-center">
                <Bot size={14} />
              </div>
              <div className="p-5 bg-navy-medium border border-white/5 rounded-[24px] rounded-tl-none shadow-lg">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  {isThinkingMode && (
                    <div className="flex items-center gap-2">
                      <BrainCircuit size={12} className="text-gold animate-pulse" />
                      <span className="text-[10px] font-medium text-gold/60 italic">Analyzing complex patterns...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-2 flex flex-col gap-3 bg-gradient-to-t from-navy-dark via-navy-dark to-transparent pt-8">
        {/* Thinking Mode Toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsThinkingMode(!isThinkingMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 shadow-lg ${
              isThinkingMode 
                ? 'bg-gold text-navy-dark border-gold' 
                : 'bg-white/5 text-white/40 border-white/10 hover:border-gold/30'
            }`}
          >
            <BrainCircuit size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Thinking Mode {isThinkingMode ? 'On' : 'Off'}
            </span>
          </button>
        </div>

        <div className="glass-card p-2 flex items-center gap-2 shadow-2xl border-white/10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isThinkingMode ? "Ask a complex query..." : "Ask your coach..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-2 text-white placeholder:text-white/20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-gold text-navy-dark rounded-full flex items-center justify-center disabled:opacity-20 transition-all shadow-lg"
          >
            <Send size={16} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};

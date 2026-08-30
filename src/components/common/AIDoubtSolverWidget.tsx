import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  Zap, 
  Cpu, 
  MessageSquare,
  Compass,
  ArrowRight,
  RefreshCw,
  Terminal,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { askGeminiDoubt, ChatMessage } from '../../services/aiService';
import { useApp } from '../../context/AppContext';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    role: 'assistant',
    content: `👋 **Namaste Officer / Student!** I am **Vayu AI** (*Mausam Vidyarthi Sahayak*), your dedicated AI Meteorology & Atmospheric Sciences Doubt Solver.

I am trained on official MoES & IMD modules to answer your queries on:
• **Doppler Weather Radar (DWR):** dBZ Reflectivity, Radial Velocity Dipoles, Dual-Pol ($Z_{DR}, \\rho_{HV}$).
• **Numerical Weather Prediction (NWP):** WRF Parameterizations, GFS, 4D-Var Data Assimilation.
• **Satellite Meteorology:** INSAT-3D/3DR TIR & Water Vapor Imagery, Dvorak Cyclone T-numbers.
• **Synoptic Dynamics:** Monsoon depressions, Western Disturbances, CAPE/CIN thunderstorm nowcasts.

*What concept or assessment doubt can I clarify for you today?*`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const QUICK_PROMPTS = [
  {
    category: 'Doppler Radar',
    icon: '📡',
    prompt: 'How do I identify a mesocyclone or tornado signature on Doppler radial velocity display?'
  },
  {
    category: 'INSAT Satellite',
    icon: '🛰️',
    prompt: 'Explain how the Dvorak technique uses INSAT-3D TIR1 imagery to estimate cyclone intensity.'
  },
  {
    category: 'NWP Models',
    icon: '🌐',
    prompt: 'What is the difference between convective parameterization and microphysics schemes in WRF?'
  },
  {
    category: 'Severe Weather',
    icon: '⚡',
    prompt: 'How do CAPE and CIN values help in nowcasting severe Kalbaishakhi (Nor\'westers) thunderstorms?'
  },
  {
    category: 'Monsoon Dynamics',
    icon: '🌧️',
    prompt: 'Why do Monsoon Depressions tilt southward with height over central India?'
  },
  {
    category: 'Exam / MCQ Helper',
    icon: '📝',
    prompt: 'Give me 3 practice MCQ questions on Doppler Weather Radar with step-by-step explanations.'
  }
];

export const AIDoubtSolverWidget: React.FC = () => {
  const { role, activeTab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('vayu_ai_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'Intuitive & Practical' | 'Deep Atmospheric Science' | 'MCQ & Exam Prep'>('Intuitive & Practical');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Save conversation history
  useEffect(() => {
    localStorage.setItem('vayu_ai_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery.trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: activeTab
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      // Build conversation payload for multi-turn chat
      const chatPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await askGeminiDoubt({
        messages: chatPayload,
        currentTopic: `Active Workspace Tab: ${activeTab}, Role: ${role}`,
        mode: selectedMode
      });

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "⚠️ I encountered an error connecting to the AI inference service. Please verify your network connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Do you want to reset this doubt solving session?")) {
      setMessages(INITIAL_MESSAGES);
      localStorage.removeItem('vayu_ai_chat_history');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(null);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown before speaking
    const cleanText = text.replace(/[*_#`$]/g, '').replace(/\[.*?\]\(.*?\)/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-full shadow-[0_8px_30px_rgba(37,99,235,0.4)] border border-white/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Open AI Doubt Solver Chatbot"
          >
            {/* Pulsing Aura */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-slate-900"></span>
            </span>

            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot size={20} className="text-white animate-pulse" />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-black tracking-wide">VAYU AI</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-semibold">Gemini 3.5</span>
              </div>
              <p className="text-[11px] text-blue-100 font-medium leading-none mt-1">
                Ask Meteorology Doubt
              </p>
            </div>

            <Sparkles size={16} className="text-amber-300 ml-1 group-hover:rotate-12 transition-transform" />
          </button>
        </motion.div>
      )}

      {/* Main Multi-Turn Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-50 bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
              isExpanded 
                ? 'inset-4 sm:inset-10 max-w-5xl mx-auto' 
                : 'bottom-4 sm:bottom-6 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[640px] max-h-[88vh]'
            }`}
          >
            {/* Header */}
            <div className="bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-sm">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                      <span>Vayu AI</span>
                      <span className="text-[10px] text-teal-300 font-normal bg-teal-950 border border-teal-800 px-2 py-0.5 rounded-full font-mono">
                        Doubt Solver
                      </span>
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Gemini 3.5 Flash • IMD/MoES Knowledge Base</span>
                  </p>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={handleClearChat}
                  title="Reset Conversation"
                  className="p-1.5 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Collapse" : "Expand"}
                  className="p-1.5 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer hidden sm:block"
                >
                  {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="p-1.5 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Mode Selection Ribbon */}
            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Answering Mode:</span>
              <div className="flex items-center gap-1">
                {(['Intuitive & Practical', 'Deep Atmospheric Science', 'MCQ & Exam Prep'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMode(m)}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                      selectedMode === m 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {m === 'Intuitive & Practical' ? '⚡ Intuitive' : m === 'Deep Atmospheric Science' ? '🔬 Deep Science' : '📝 MCQ Prep'}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Chat Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAssistant && (
                      <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <Bot size={15} />
                      </div>
                    )}

                    <div
                      className={`relative max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                        isAssistant
                          ? 'bg-white text-slate-800 border border-slate-200'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {/* Topic tag */}
                      {msg.topic && (
                        <span className={`inline-block text-[9px] uppercase font-bold px-1.5 py-0.5 rounded mb-1.5 ${
                          isAssistant ? 'bg-slate-100 text-slate-500' : 'bg-blue-700 text-blue-100'
                        }`}>
                          {msg.topic}
                        </span>
                      )}

                      {/* Content with rich formatting */}
                      <div className="whitespace-pre-wrap space-y-2 font-sans selection:bg-blue-200 selection:text-slate-900">
                        {msg.content}
                      </div>

                      {/* Action footer */}
                      <div className={`mt-2.5 pt-1.5 flex items-center justify-between text-[10px] border-t ${
                        isAssistant ? 'border-slate-100 text-slate-400' : 'border-blue-500 text-blue-100'
                      }`}>
                        <span>{msg.timestamp}</span>

                        {isAssistant && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleSpeak(msg.id, msg.content)}
                              className="p-1 hover:text-blue-600 rounded transition-colors cursor-pointer"
                              title={isSpeaking === msg.id ? "Stop Voice" : "Read Aloud"}
                            >
                              {isSpeaking === msg.id ? <VolumeX size={13} className="text-red-500" /> : <Volume2 size={13} />}
                            </button>
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="p-1 hover:text-blue-600 rounded transition-colors cursor-pointer"
                              title="Copy Answer"
                            >
                              {copiedId === msg.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isAssistant && (
                      <div className="w-7 h-7 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 shadow-xs mt-0.5 font-bold text-[11px]">
                        ME
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Generating Loading State */}
              {loading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                    <Bot size={15} />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 shadow-xs flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">
                      Vayu AI is analyzing atmospheric formulas...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions Ribbon */}
            <div className="bg-white border-t border-slate-100 p-2.5 overflow-x-auto scrollbar-none flex gap-2 shrink-0">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp.prompt)}
                  disabled={loading}
                  className="shrink-0 text-[11px] font-medium px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>{qp.icon}</span>
                  <span className="truncate max-w-[150px]">{qp.category}</span>
                </button>
              ))}
            </div>

            {/* Input Composer */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-blue-600 focus-within:bg-white transition-all shadow-xs"
              >
                <textarea
                  ref={inputRef}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a meteorological doubt or paste question... (Enter to send)"
                  rows={1}
                  className="flex-1 bg-transparent px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none resize-none max-h-24 leading-relaxed font-medium"
                />

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || loading}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xs transition-all cursor-pointer shrink-0"
                  aria-label="Send query"
                >
                  {loading ? <RefreshCw size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </form>

              <div className="flex items-center justify-between px-1 pt-2 text-[10px] text-slate-400">
                <span>Multi-turn conversational context active</span>
                <span>Powered by Gemini • MoES IMD</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

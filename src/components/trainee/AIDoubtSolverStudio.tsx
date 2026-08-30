import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Radio, 
  Layers, 
  Zap, 
  BookOpen, 
  Cpu, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle,
  FileQuestion,
  RefreshCw,
  Compass,
  ArrowRight,
  GraduationCap,
  Download
} from 'lucide-react';
import { askGeminiDoubt, ChatMessage } from '../../services/aiService';
import { useApp } from '../../context/AppContext';

const DEFAULT_PROMPTS = [
  {
    title: 'Doppler Radar Radial Velocity Dipole',
    topic: 'Doppler Radar',
    icon: '📡',
    desc: 'How to detect cyclonic vortex or tornado vortex signature (TVS) on Doppler velocity display.',
    prompt: 'Can you explain step-by-step how to identify a mesocyclone or tornado vortex signature (TVS) on a Doppler Weather Radar radial velocity PPI display with color coding conventions?'
  },
  {
    title: 'Dvorak Cyclone Intensity Estimation',
    topic: 'Satellite Meteorology',
    icon: '🛰️',
    desc: 'Using INSAT-3D/3DR TIR1 imagery and T-number logarithmic spirals.',
    prompt: 'Explain the Dvorak technique used by IMD to determine tropical cyclone T-numbers, central pressure deficits, and maximum sustained surface winds using INSAT-3D/3DR satellite imagery.'
  },
  {
    title: 'Convective Parameterization vs Microphysics',
    topic: 'NWP Modeling',
    icon: '🌐',
    desc: 'Sub-grid scale convective schemes (Kain-Fritsch) vs explicit grid-scale microphysics.',
    prompt: 'What is the physical difference between sub-grid convective parameterization schemes (like Kain-Fritsch or Betts-Miller-Janjic) and explicit cloud microphysics schemes in WRF modeling?'
  },
  {
    title: 'CAPE & CIN for Severe Thunderstorms',
    topic: 'Thermodynamics',
    icon: '⚡',
    desc: 'Tephigram analysis, Level of Free Convection (LFC), and Nor\'wester nowcasting.',
    prompt: 'How are Convective Available Potential Energy (CAPE) and Convective Inhibition (CIN) derived from a Tephigram / Skew-T diagram, and what threshold values indicate severe thunderstorms over India?'
  },
  {
    title: 'Monsoon Depression Vertical Structure',
    topic: 'Monsoon Dynamics',
    icon: '🌧️',
    desc: 'Why low-pressure systems over the Bay of Bengal tilt southwestward with height.',
    prompt: 'Why do Monsoon Depressions developing over the Bay of Bengal tilt southward/southwestward with height, and how does this affect rainfall distribution in their southwest quadrant?'
  },
  {
    title: 'Aviation Weather: METAR, TAF & Wind Shear',
    topic: 'Aviation Meteorology',
    icon: '✈️',
    desc: 'Terminal Aerodrome Forecast interpretation and LLWS alerts.',
    prompt: 'How do aviation meteorologists decode a METAR and TAF report during a microburst event, and how does Terminal Doppler Weather Radar (TDWR) trigger wind shear warnings?'
  }
];

export const AIDoubtSolverStudio: React.FC = () => {
  const { user, role, activeTab } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('vayu_ai_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'msg-init-1',
        role: 'assistant',
        content: `👋 **Welcome Officer ${user?.name || ''}!** 

I am **Vayu AI** (*Mausam Vidyarthi Sahayak*), your interactive AI atmospheric sciences and meteorology mentor. 

Feel free to ask any question regarding your **course lectures, radar interpretations, NWP formulas, satellite imagery, or assessment preparation**. You can also click any of the study prompts on the left to start exploring!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'Intuitive & Practical' | 'Deep Atmospheric Science' | 'MCQ & Exam Prep'>('Intuitive & Practical');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('vayu_ai_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery.trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: 'Doubt Studio'
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const chatPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await askGeminiDoubt({
        messages: chatPayload,
        currentTopic: `MoES IMD Training Studio, Trainee: ${user?.name}, Department: ${user?.department}`,
        mode: selectedMode
      });

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "⚠️ I was unable to connect to the AI model. Please verify your internet connection or retry in a few moments.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your current doubt solving session?")) {
      setMessages([
        {
          id: 'msg-init-reset',
          role: 'assistant',
          content: "✨ Session reset. What meteorological concept would you like to explore next?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
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
    const cleanText = text.replace(/[*_#`$]/g, '').replace(/\[.*?\]\(.*?\)/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-teal-400 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-teal-300">
                <Bot size={28} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  VAYU AI • Doubt Solver Studio
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Gemini 3.5 Flash
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>24x7 Student Mentorship</span>
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
                Instant interactive AI assistance for meteorology officer trainees, radar analysts, and NWP modelers. Ask complex doubts, clarify physical equations, or get practice MCQ explanations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={handleClearChat}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Preset Questions & Formula Quick References (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Preset Doubts Library */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Lightbulb size={17} className="text-amber-500" />
                <span>Recommended Study Doubts</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Click to ask</span>
            </div>

            <div className="space-y-2.5">
              {DEFAULT_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.prompt)}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 transition-all group cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-blue-700">
                    <span className="flex items-center gap-1.5">
                      <span>{p.icon}</span>
                      <span>{p.title}</span>
                    </span>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {p.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Atmospheric Cheat Sheet */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 text-white space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2 text-teal-400">
              <Cpu size={16} />
              <h4 className="text-xs font-bold uppercase tracking-wider">Meteorology Quick Cheat Sheet</h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-blue-400">Hydrostatic Balance:</span>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5">∂P/∂z = -ρg</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400">Geostrophic Wind:</span>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5">vg = (1 / ρf) (∂P/∂x)</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400">Doppler Reflectivity:</span>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5">dBZ = 10 log₁₀(Σ Dᵢ⁶)</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Multi-Turn Conversation Thread (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[740px] overflow-hidden">
          
          {/* Thread Header & Mode Toggle */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Interactive Conversation Thread</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  {messages.length} messages in current thread
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
              {(['Intuitive & Practical', 'Deep Atmospheric Science', 'MCQ & Exam Prep'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMode(m)}
                  className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedMode === m
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {m === 'Intuitive & Practical' ? '⚡ Intuitive' : m === 'Deep Atmospheric Science' ? '🔬 Deep Science' : '📝 MCQ Prep'}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    className={`relative max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isAssistant
                        ? 'bg-white text-slate-800 border border-slate-200'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <div className="whitespace-pre-wrap space-y-2 selection:bg-blue-200 selection:text-slate-900">
                      {msg.content}
                    </div>

                    <div className={`mt-3 pt-2 flex items-center justify-between text-[11px] border-t ${
                      isAssistant ? 'border-slate-100 text-slate-400' : 'border-blue-500 text-blue-100'
                    }`}>
                      <span>{msg.timestamp}</span>

                      {isAssistant && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleSpeak(msg.id, msg.content)}
                            className="p-1 hover:text-blue-600 rounded transition-colors cursor-pointer"
                            title={isSpeaking === msg.id ? "Stop Speech" : "Read Aloud"}
                          >
                            {isSpeaking === msg.id ? <VolumeX size={14} className="text-red-500" /> : <Volume2 size={14} />}
                          </button>
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="p-1 hover:text-blue-600 rounded transition-colors cursor-pointer"
                            title="Copy Message"
                          >
                            {copiedId === msg.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-1 font-bold text-xs">
                      ME
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 shadow-xs flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="font-medium text-slate-600">
                    Vayu AI is calculating mathematical solution and formulating explanation...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer Box */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-blue-600 focus-within:bg-white transition-all shadow-xs"
            >
              <textarea
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your meteorological question, equation doubt, or assessment query... (Enter to send)"
                rows={2}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none leading-relaxed font-medium"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span className="hidden sm:inline">Solving...</span>
                  </>
                ) : (
                  <>
                    <span>Ask AI</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

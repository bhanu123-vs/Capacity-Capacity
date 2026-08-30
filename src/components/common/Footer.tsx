import React, { useState } from 'react';
import { 
  Star, 
  Send, 
  CheckCircle, 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  Globe, 
  Sparkles, 
  MessageSquare, 
  ThumbsUp,
  Award,
  Radio,
  FileText,
  Users,
  Code
} from 'lucide-react';

interface FooterProps {
  variant?: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({ variant = 'light' }) => {
  const isDark = variant === 'dark';

  // Rating State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('General Experience');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const feedbackTags = [
    'Course Content',
    'Radar Simulator',
    'Assessments',
    'Portal Speed',
    'General Experience'
  ];

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <footer 
      className={`border-t transition-colors relative z-20 ${
        isDark 
          ? 'bg-slate-950 text-slate-300 border-slate-800' 
          : 'bg-slate-900 text-slate-200 border-slate-800'
      }`}
    >
      {/* Upper Grid: Rate Us, Connect With Us, Portals, & Helpdesk */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Section 1: Brand & Ministry Information (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-md">
                <Globe size={22} />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">
                  CAPACITY <span className="text-blue-400">CONNECT</span>
                </span>
                <p className="text-[11px] text-slate-400 font-medium">
                  India Meteorological Department • MoES
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Unified competency-based capacity building ecosystem for meteorologists, weather radar specialists, and numerical weather modelers across India.
            </p>

            {/* Ministry & Govt Badges */}
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300 font-medium">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Govt of India Verified</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300 font-medium">
                <Radio size={13} className="text-blue-400" />
                <span>24x7 IMD Telemetry</span>
              </span>
            </div>

            {/* Helpline / Contact details */}
            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-blue-400 shrink-0 mt-0.5" />
                <span>Mausam Bhavan, Lodhi Road, New Delhi – 110003</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-emerald-400 shrink-0" />
                <span>Toll-Free Training Helpline: <strong className="text-white">1800-180-1717</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-amber-400 shrink-0" />
                <span>Support: <a href="mailto:support.capacity@imd.gov.in" className="text-blue-400 hover:underline">support.capacity@imd.gov.in</a></span>
              </div>
            </div>
          </div>

          {/* Section 2: Interactive "Rate Us & Feedback" (4 cols) */}
          <div className="lg:col-span-4 bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-3.5 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <h4 className="text-sm font-bold text-white">Rate Your Experience</h4>
              </div>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                4.9 / 5.0 (1,420 Reviews)
              </span>
            </div>

            {submitted ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-center space-y-2 animate-fade-in">
                <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={20} />
                </div>
                <p className="text-xs font-bold text-emerald-300">Thank You for Your Valuable Feedback!</p>
                <p className="text-[11px] text-slate-400">
                  Your rating of {rating} Stars helps the training directorate continuously improve curriculum quality.
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setFeedbackText(''); }}
                  className="text-[11px] text-blue-400 underline hover:text-blue-300 pt-1 block mx-auto cursor-pointer"
                >
                  Submit another rating
                </button>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-3">
                {/* 5-Star interactive control */}
                <div className="flex items-center justify-center gap-2 py-1 bg-slate-900 rounded-xl border border-slate-800">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1.5 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      aria-label={`Rate ${star} Stars`}
                    >
                      <Star
                        size={22}
                        className={`transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-300 ml-1">
                    {hoverRating || rating} / 5
                  </span>
                </div>

                {/* Feedback Focus Tag */}
                <div className="flex flex-wrap gap-1.5">
                  {feedbackTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`text-[10px] px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                        selectedTag === tag
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Comment input */}
                <div className="relative">
                  <input
                    type="text"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Any suggestions or questions? (Optional)"
                    className="w-full pl-3 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute right-1.5 top-1.5 p-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
                    title="Send Feedback"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Section 3: Connect With Us & Quick Links (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Users size={16} className="text-teal-400" />
              <span>Connect With MoES & IMD</span>
            </h4>

            {/* Social & Portal Connect Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="https://mausam.imd.gov.in"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 hover:text-white transition-all flex items-center gap-2 group"
              >
                <Globe size={15} className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium truncate">Mausam Portal</span>
                <ExternalLink size={11} className="text-slate-500 ml-auto shrink-0" />
              </a>

              <a
                href="https://moes.gov.in"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 hover:text-white transition-all flex items-center gap-2 group"
              >
                <Award size={15} className="text-teal-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium truncate">MoES Central</span>
                <ExternalLink size={11} className="text-slate-500 ml-auto shrink-0" />
              </a>

              <a
                href="https://digitalindia.gov.in"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 hover:text-white transition-all flex items-center gap-2 group"
              >
                <Sparkles size={15} className="text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium truncate">Digital India</span>
                <ExternalLink size={11} className="text-slate-500 ml-auto shrink-0" />
              </a>

              <a
                href="https://www.india.gov.in"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 hover:text-white transition-all flex items-center gap-2 group"
              >
                <ShieldCheck size={15} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium truncate">National Portal</span>
                <ExternalLink size={11} className="text-slate-500 ml-auto shrink-0" />
              </a>
            </div>

            {/* Quick Policies & Legal links */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-slate-400">
              <a href="#terms" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <span className="text-slate-700">•</span>
              <a href="#privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <span className="text-slate-700">•</span>
              <a href="#rti" className="hover:text-blue-400 transition-colors">RTI Portal</a>
              <span className="text-slate-700">•</span>
              <a href="#helpdesk" className="hover:text-blue-400 transition-colors">NIC Helpdesk</a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom High-Contrast Banner: "Developed and Maintained by Kalki team" */}
      <div className="border-t border-slate-800 bg-slate-950 py-5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          {/* Left: Copyright & Governance */}
          <div className="text-xs text-slate-400 space-y-0.5">
            <p className="font-semibold text-slate-300">
              © {new Date().getFullYear()} Capacity Connect • India Meteorological Department (IMD)
            </p>
            <p className="text-[11px] text-slate-500">
              Ministry of Earth Sciences, Government of India. All rights reserved.
            </p>
          </div>

          {/* Center/Right: PROMINENT "Developed and Maintained by Kalki team" CREDITS BADGE */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 border border-blue-500/30 text-xs shadow-lg">
            <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Code size={14} />
            </div>
            <span className="text-slate-300">
              Developed and Maintained by <strong className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 font-extrabold tracking-wide">Kalki team</strong>
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

        </div>
      </div>
    </footer>
  );
};

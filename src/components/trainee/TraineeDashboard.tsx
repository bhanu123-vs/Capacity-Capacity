import React from 'react';
import { 
  Play, 
  ArrowRight, 
  Calendar,
  CheckCircle,
  Award,
  Sparkles,
  Download,
  AlertCircle,
  Bot,
  MessageSquare,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';

export const TraineeDashboard: React.FC = () => {
  const { 
    currentUser, 
    courses, 
    enrolledCourses, 
    assessments, 
    certificates, 
    competencies, 
    setActiveTab, 
    openCoursePlayer,
    openCertificateModal,
    announcements
  } = useApp();

  const avgSkillScore = Math.round(
    competencies.reduce((acc, curr) => acc + curr.currentLevel, 0) / (competencies.length || 1)
  );

  const completedMCQs = assessments.filter(a => a.userAttempts && a.userAttempts.length > 0).length;

  return (
    <div className="space-y-8">
      {/* Header with Title & Next Assessment Badge */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">
            Check your learning progress and upcoming certifications.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs self-start sm:self-auto">
          <Calendar size={16} className="text-blue-600" />
          <span className="font-bold text-slate-800">Next Assessment:</span>
          <span>June 15, 2026</span>
        </div>
      </header>

      {/* 4 Minimalist Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Courses Active */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Courses Active</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-blue-600">
              {enrolledCourses.length.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-emerald-600 font-bold">+2 new</span>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certifications</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-teal-600">
              {certificates.length.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 font-medium">Verified</span>
          </div>
        </div>

        {/* MCQs Taken */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">MCQs Taken</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-indigo-600">
              {completedMCQs.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-indigo-500 font-semibold">of {assessments.length}</span>
          </div>
        </div>

        {/* Avg. Skill Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Skill Score</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-orange-600">{avgSkillScore}%</span>
            <span className="text-xs text-blue-600 font-bold">Top 5%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Competency Mapping & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: Competency Mapping Visualizer */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
              Competency Mapping (Skill Heatmap)
            </h2>
            <button 
              onClick={() => setActiveTab('Competency Map')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Full Analysis</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="p-6 sm:p-8 flex flex-col gap-6">
            {/* Visual Skill Heatmap Bands */}
            <div className="relative w-full flex flex-col justify-center gap-5">
              {competencies.map((comp, idx) => {
                const isProficient = comp.currentLevel >= 80;
                const isDeveloping = comp.currentLevel >= 50 && comp.currentLevel < 80;
                const barColor = isProficient ? 'bg-indigo-500' : isDeveloping ? 'bg-blue-500' : 'bg-teal-500';

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{comp.skill}</span>
                        <span className="text-[10px] text-slate-400">({comp.domain})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{comp.currentLevel}%</span>
                        <span className="text-[10px] text-slate-400 font-mono">Target {comp.requiredLevel}%</span>
                      </div>
                    </div>

                    <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${comp.currentLevel}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className={`h-full ${barColor}`} 
                      />
                    </div>
                  </div>
                );
              })}

              {/* Four Quadrant Tier Labels */}
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider pt-2 border-t border-slate-100">
                <span>Basic (0-25%)</span>
                <span>Intermediate (26-50%)</span>
                <span>Expert (51-75%)</span>
                <span>Specialist (76-100%)</span>
              </div>
            </div>

            {/* Quick Action to Take Assessment or Resume */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Benchmarks calibrated to IMD Operational Meteorological Standard SOP-2024
              </div>
              <button
                onClick={() => setActiveTab('MCQ Assessments')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Take Skill Evaluation</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Notices & Updates */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
              Notices & Updates
            </h2>
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          </div>

          <div className="space-y-3.5 flex-1">
            {/* Notice 1 */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-xs font-bold text-amber-800 mb-1">New Assessment Open</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Advanced Doppler Radar Interpretation module is now open for enrollment. Check course tab.
              </p>
            </div>

            {/* Notice 2 */}
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-xs font-bold text-blue-800 mb-1">Satellite Nowcasting Feed</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                INSAT-3DR rapid scan radiometric training dataset has been uploaded to Knowledge Library.
              </p>
            </div>

            {/* Notice 3 */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-800 mb-1">Certificate Issued</p>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Your 'Severe Weather Prediction & SOP' certificate is ready for download with Director General seal.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('Knowledge Library')}
            className="mt-4 w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            View All Announcements
          </button>
        </div>
      </div>

      {/* AI Doubt Solver Quick Launch Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-blue-500/20 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
              <Sparkles size={11} />
              <span>AI DOUBT SOLVER</span>
            </span>
            <span className="text-xs text-slate-400">• Powered by Gemini 3.5 Flash</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Stuck on a Doppler formula, NWP scheme, or INSAT satellite doubt?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Get instant multi-turn pedagogical explanations, Tephigram interpretations, and MCQ solutions tailored for IMD officer exams.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 relative z-10">
          <button
            onClick={() => setActiveTab('AI Doubt Solver')}
            className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Bot size={16} className="group-hover:scale-110 transition-transform" />
            <span>Open Doubt Studio</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Continue Learning Strip */}
      {enrolledCourses.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
              {enrolledCourses[0].code.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  Current Course
                </span>
                <span className="text-xs text-slate-400">• {enrolledCourses[0].modules.length} Modules</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {enrolledCourses[0].title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-800">{enrolledCourses[0].completionPercentage || 0}% Completed</p>
              <p className="text-[10px] text-slate-400">Interactive Slide Deck</p>
            </div>
            <button
              onClick={() => openCoursePlayer(enrolledCourses[0])}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Play size={14} />
              <span>Resume Player</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

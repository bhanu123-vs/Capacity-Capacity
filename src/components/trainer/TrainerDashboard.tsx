import React from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  FileText, 
  Plus, 
  Play, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TrainerDashboard: React.FC = () => {
  const { 
    currentUser, 
    courses, 
    assessments, 
    setActiveTab, 
    traineeAnalytics,
    openCoursePlayer
  } = useApp();

  const totalTrainees = 864;
  const avgPassRate = 88;

  return (
    <div className="space-y-8">
      {/* Minimal Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Faculty Portal: {currentUser.name}
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">
            Author meteorological modules, build assessments, and monitor trainee proficiency.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('Create Content')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>Create Course</span>
          </button>
          <button
            onClick={() => setActiveTab('Questionnaires')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <FileText size={15} className="text-blue-600" />
            <span>New Quiz</span>
          </button>
        </div>
      </header>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Trainees</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-blue-600">{totalTrainees}</span>
            <span className="text-xs text-emerald-600 font-bold">37 RMCs</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published Courses</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-teal-600">{courses.length.toString().padStart(2, '0')}</span>
            <span className="text-xs text-slate-400 font-medium">Active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Quizzes</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-indigo-600">{assessments.length.toString().padStart(2, '0')}</span>
            <span className="text-xs text-indigo-500 font-semibold">Timed MCQs</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Pass Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-orange-600">{avgPassRate}%</span>
            <span className="text-xs text-emerald-600 font-bold">+3.2% MoM</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Published Course Portfolio & Trainee Analytics Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: Published Courses Table / Cards */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
                Your Published Training Modules
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('Create Content')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Manage Modules</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="p-6 space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <span className="text-xs text-slate-500">{course.category}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{course.title}</h4>
                  <p className="text-xs text-slate-400">{course.modules.length} Modules • {course.enrolledCount} Trainees Enrolled</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => openCoursePlayer(course)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Play size={12} />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('Questionnaires')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                  >
                    Manage Exam
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Trainee Weakness Alerts & Batch Status */}
        <div className="space-y-6">
          {/* Competency Gap Alert */}
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle size={18} className="text-amber-600" />
              <h3 className="font-bold text-sm">Competency Advisory</h3>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Assessment analytics indicate <strong>24% of trainees</strong> scored below the 70% threshold in <em>Hydrometeorological Flood Routing</em>.
            </p>
            <button
              onClick={() => setActiveTab('Trainee Analytics')}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              Inspect Batch Analytics
            </button>
          </div>

          {/* Quick Roster Snippet */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-xs">Recent Submissions</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>

            <div className="space-y-2.5">
              {traineeAnalytics.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[11px] text-slate-500">{item.center}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {item.avgScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('Trainee Analytics')}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              View Full Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

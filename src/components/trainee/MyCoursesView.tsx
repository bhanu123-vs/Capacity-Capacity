import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Play, 
  CheckCircle, 
  Star, 
  Clock, 
  Award, 
  Layers, 
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

export const MyCoursesView: React.FC = () => {
  const { courses, enrolledCourses, enrollInCourse, openCoursePlayer } = useApp();
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'enrolled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null);

  const categories = ['All', 'Radar Meteorology', 'Numerical Weather Prediction', 'Disaster Management', 'Satellite Meteorology', 'Agrometeorology'];

  const displayedCourses = courses.filter(c => {
    if (activeTabFilter === 'enrolled' && !c.isEnrolled) return false;
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.competenciesCovered.some(comp => comp.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Meteorological Courses & Curriculum</h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {courses.length} Certified Modules
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standardized Ministry of Earth Sciences curriculum for operational radar, satellite, and NWP personnel.
          </p>
        </div>

        {/* Tab Filter Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTabFilter === 'all'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTabFilter('enrolled')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTabFilter === 'enrolled'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Enrolled ({enrolledCourses.length})
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course title, code (e.g., MET-RAD-401), or skill keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
          />
        </div>

        {/* Category Scroll/Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCourses.map((course) => {
          const isEnrolled = course.isEnrolled;
          const progress = course.completionPercentage || 0;

          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                      {course.code}
                    </span>
                    <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      {course.level}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 font-semibold">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span>{course.rating}</span>
                      <span className="text-slate-300 text-[11px]">({course.enrolledCount} enrolled)</span>
                    </div>
                    <span className="flex items-center gap-1 text-slate-300 font-mono text-[11px]">
                      <Clock size={13} />
                      {course.durationHours}h
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    {course.category}
                  </span>

                  <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Competency badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {course.competenciesCovered.slice(0, 2).map((comp, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md truncate max-w-[160px]"
                      >
                        {comp}
                      </span>
                    ))}
                    {course.competenciesCovered.length > 2 && (
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-1.5 py-0.5 rounded-md">
                        +{course.competenciesCovered.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Progress bar if enrolled */}
                  {isEnrolled && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Progress</span>
                        <span className="text-blue-600">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setSelectedCourseForDetail(course)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Info size={14} />
                  <span>Syllabus</span>
                </button>

                {isEnrolled ? (
                  <button
                    onClick={() => openCoursePlayer(course)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Play size={14} />
                    <span>Launch</span>
                  </button>
                ) : (
                  <button
                    onClick={() => enrollInCourse(course.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <BookOpen size={14} />
                    <span>Enroll</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {displayedCourses.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <BookOpen size={40} className="text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching meteorological courses found</h3>
          <p className="text-xs text-slate-500">Try adjusting your keyword search or category filter.</p>
        </div>
      )}

      {/* Syllabus Detail Modal */}
      {selectedCourseForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedCourseForDetail.code}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {selectedCourseForDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourseForDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedCourseForDetail.description}
            </p>

            {/* Instructor */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <img
                src={selectedCourseForDetail.instructor.avatar}
                alt={selectedCourseForDetail.instructor.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">{selectedCourseForDetail.instructor.name}</p>
                <p className="text-[11px] text-slate-500">
                  {selectedCourseForDetail.instructor.designation} • {selectedCourseForDetail.instructor.department}
                </p>
              </div>
            </div>

            {/* Modules List */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Curriculum Modules ({selectedCourseForDetail.modules.length})
              </h4>
              <div className="space-y-2">
                {selectedCourseForDetail.modules.map((mod, mIdx) => (
                  <div key={mod.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-blue-600 font-mono">0{mIdx + 1}</span>
                      <div>
                        <p className="font-bold text-slate-800">{mod.title}</p>
                        <p className="text-[11px] text-slate-500">{mod.summary}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase bg-slate-100 px-2 py-0.5 rounded">
                      {mod.durationMinutes}m • {mod.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedCourseForDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              {selectedCourseForDetail.isEnrolled ? (
                <button
                  onClick={() => {
                    const c = selectedCourseForDetail;
                    setSelectedCourseForDetail(null);
                    openCoursePlayer(c);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Launch Player
                </button>
              ) : (
                <button
                  onClick={() => {
                    enrollInCourse(selectedCourseForDetail.id);
                    setSelectedCourseForDetail(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  CheckCircle, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  Video, 
  HelpCircle, 
  Award, 
  Download, 
  Share2, 
  RotateCcw,
  Sparkles,
  Volume2,
  Maximize2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, CourseModule } from '../../types';

interface CoursePlayerProps {
  course: Course;
  onClose: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onClose }) => {
  const { updateCourseProgress, startAssessment, assessments } = useApp();
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35);

  const currentModule: CourseModule = course.modules[selectedModuleIndex] || course.modules[0];
  const slides = currentModule.slides || [];

  const handleToggleComplete = (modId: string, currentStatus: boolean) => {
    updateCourseProgress(course.id, modId, !currentStatus);
  };

  const handleNextModule = () => {
    if (selectedModuleIndex < course.modules.length - 1) {
      setSelectedModuleIndex(selectedModuleIndex + 1);
      setCurrentSlideIndex(0);
      setIsPlayingVideo(false);
    }
  };

  const handlePrevModule = () => {
    if (selectedModuleIndex > 0) {
      setSelectedModuleIndex(selectedModuleIndex - 1);
      setCurrentSlideIndex(0);
      setIsPlayingVideo(false);
    }
  };

  const relatedAssessment = assessments.find(a => a.courseId === course.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between overflow-hidden">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Close Player"
          >
            <X size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold bg-blue-600/40 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded">
                {course.code}
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                {course.department}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
              {course.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400">Total Completion</span>
            <p className="text-xs font-bold text-emerald-400">{course.completionPercentage || 0}%</p>
          </div>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${course.completionPercentage || 0}%` }}
            />
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
          >
            Exit Player
          </button>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-900">
        {/* Left Interactive Viewer Area */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto">
          {/* Header of Active Module */}
          <div className="flex items-center justify-between bg-slate-850 p-4 rounded-2xl border border-slate-800 mb-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600/30 border border-blue-500/30 text-blue-400">
                {currentModule.type === 'video' && <Video size={20} />}
                {currentModule.type === 'presentation' && <BookOpen size={20} />}
                {currentModule.type === 'document' && <FileText size={20} />}
                {currentModule.type === 'quiz_checkpoint' && <HelpCircle size={20} />}
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Module {selectedModuleIndex + 1} of {course.modules.length} • {currentModule.type.toUpperCase()}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {currentModule.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => handleToggleComplete(currentModule.id, !!currentModule.completed)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                currentModule.completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CheckCircle size={15} />
              <span>{currentModule.completed ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>

          {/* Interactive Player Screen depending on type */}
          <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 flex flex-col justify-center min-h-[350px]">
            {/* 1. Video Player Simulation */}
            {currentModule.type === 'video' && (
              <div className="space-y-4">
                <div className="relative aspect-video max-h-[420px] mx-auto w-full bg-black rounded-xl overflow-hidden flex flex-col justify-end border border-slate-800 shadow-2xl">
                  {/* Background Video Simulator Graphic */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900/40 to-slate-900 flex items-center justify-center">
                    <div className="text-center p-6 space-y-2">
                      <div className="w-16 h-16 rounded-full bg-blue-600/80 hover:bg-blue-600 text-white flex items-center justify-center mx-auto cursor-pointer shadow-lg transition-transform hover:scale-105"
                        onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                      >
                        {isPlayingVideo ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                      </div>
                      <p className="text-sm font-bold text-white">
                        {isPlayingVideo ? 'Playing: Operational Radar Echo Diagnostic Feed' : 'Click to Play Recorded Lecture'}
                      </p>
                      <p className="text-xs text-slate-400 max-w-md">
                        Recorded training by {course.instructor.name} ({course.instructor.department})
                      </p>
                    </div>
                  </div>

                  {/* Video Controls Bar */}
                  <div className="relative z-10 bg-gradient-to-t from-black/90 to-transparent p-4 space-y-2">
                    <div className="w-full h-1.5 bg-slate-700 rounded-full cursor-pointer overflow-hidden"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        setVideoProgress(Math.round((clickX / rect.width) * 100));
                      }}
                    >
                      <div className="h-full bg-blue-500" style={{ width: `${videoProgress}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setIsPlayingVideo(!isPlayingVideo)}>
                          {isPlayingVideo ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <Volume2 size={16} />
                        <span>14:20 / {currentModule.durationMinutes}:00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">1080p HD</span>
                        <Maximize2 size={16} className="cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes box */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    Key Lecture Takeaways
                  </p>
                  <p>{currentModule.summary}</p>
                </div>
              </div>
            )}

            {/* 2. Presentation Slides Deck */}
            {currentModule.type === 'presentation' && slides.length > 0 && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                {/* Slide Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 rounded-2xl border border-blue-900/40 shadow-xl flex-1 flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="flex items-center justify-between text-xs text-blue-400 mb-3">
                      <span className="font-mono font-bold uppercase tracking-wider">
                        Slide {currentSlideIndex + 1} of {slides.length}
                      </span>
                      <span className="bg-blue-950 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-800">
                        MoES Training Slide Deck
                      </span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-extrabold text-white mb-4">
                      {slides[currentSlideIndex].title}
                    </h4>

                    <div className="space-y-3">
                      {slides[currentSlideIndex].bulletPoints.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-3 text-slate-200 text-sm sm:text-base leading-relaxed">
                          <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                          <p>{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Speaker Notes */}
                  {slides[currentSlideIndex].notes && (
                    <div className="mt-6 p-3.5 bg-blue-950/60 rounded-xl border border-blue-800/60 text-xs text-blue-200">
                      <span className="font-bold text-blue-300 uppercase tracking-wider mr-2">
                        Instructor Operational Note:
                      </span>
                      {slides[currentSlideIndex].notes}
                    </div>
                  )}
                </div>

                {/* Slide Navigation Controls */}
                <div className="flex items-center justify-between text-white pt-2">
                  <button
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous Slide</span>
                  </button>

                  {/* Slide Dots */}
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => setCurrentSlideIndex(sIdx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          sIdx === currentSlideIndex
                            ? 'bg-blue-500 w-6'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    disabled={currentSlideIndex === slides.length - 1}
                    onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition-colors"
                  >
                    <span>Next Slide</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* 3. Document Viewer */}
            {currentModule.type === 'document' && (
              <div className="space-y-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 text-slate-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-white">Technical Manual / Study Material</h4>
                  <button
                    onClick={() => alert('Download initiated: IMD Standard Manual')}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold"
                  >
                    <Download size={14} />
                    <span>Save PDF</span>
                  </button>
                </div>
                <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-300">
                  {currentModule.documentContent || currentModule.summary}
                </div>
              </div>
            )}

            {/* 4. Quiz Checkpoint */}
            {currentModule.type === 'quiz_checkpoint' && (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-purple-600/30 text-purple-400 rounded-full flex items-center justify-center mx-auto border border-purple-500/40">
                  <Award size={32} />
                </div>
                <h4 className="text-xl font-bold text-white">
                  End of Course Assessment Checkpoint
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  You have covered all fundamental modules. Take the official National Certification Assessment to verify your competencies and claim your signed MoES certificate.
                </p>
                {relatedAssessment && (
                  <button
                    onClick={() => {
                      onClose();
                      startAssessment(relatedAssessment);
                    }}
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105"
                  >
                    Launch Timed MCQ Assessment ({relatedAssessment.timeLimitMinutes} Mins)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Module Navigation Footer */}
          <div className="flex items-center justify-between pt-4 mt-2">
            <button
              disabled={selectedModuleIndex === 0}
              onClick={handlePrevModule}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-white transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Previous Module</span>
            </button>

            <button
              disabled={selectedModuleIndex === course.modules.length - 1}
              onClick={handleNextModule}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-white transition-colors"
            >
              <span>Next Module</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Syllabus / Modules Drawer */}
        <div className="w-full lg:w-80 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-white">
              <h3 className="font-bold text-sm">Course Modules ({course.modules.length})</h3>
              <span className="text-xs text-blue-400 font-mono">{course.durationHours} Hours Total</span>
            </div>

            <div className="space-y-2">
              {course.modules.map((mod, idx) => {
                const isActive = idx === selectedModuleIndex;
                return (
                  <div
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleIndex(idx);
                      setCurrentSlideIndex(0);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-blue-900/40 border-blue-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(mod.id, !!mod.completed);
                          }}
                          className="mt-0.5 text-slate-400 hover:text-emerald-400"
                        >
                          {mod.completed ? (
                            <CheckCircle size={16} className="text-emerald-400" />
                          ) : (
                            <Circle size={16} />
                          )}
                        </button>
                        <div>
                          <p className="text-xs font-bold line-clamp-1">{mod.title}</p>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">
                            {mod.type} • {mod.durationMinutes} mins
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assessment Trigger Box at Bottom */}
          {relatedAssessment && (
            <div className="mt-4 p-3.5 bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-xl border border-purple-800/60 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Award size={16} className="text-purple-400" />
                <span className="text-xs font-bold text-purple-200">Official Exam Available</span>
              </div>
              <p className="text-[11px] text-slate-300 mb-2">
                Pass with ≥{relatedAssessment.passingPercentage}% score to get certified.
              </p>
              <button
                onClick={() => {
                  onClose();
                  startAssessment(relatedAssessment);
                }}
                className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                Launch Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

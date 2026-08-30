import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  BookOpen, 
  Video, 
  FileText, 
  HelpCircle, 
  Layers, 
  CheckCircle,
  Eye,
  Upload
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, CourseModule, SlideItem } from '../../types';

export const CreateContentView: React.FC = () => {
  const { addNewCourse, setActiveTab, openCoursePlayer, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState(`MET-ADV-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState<Course['category']>('Radar Meteorology');
  const [level, setLevel] = useState<Course['level']>('Intermediate');
  const [department, setDepartment] = useState(currentUser.department || 'Radar & Satellite Meteorology Division');
  const [durationHours, setDurationHours] = useState(12);
  const [description, setDescription] = useState('');
  const [competenciesInput, setCompetenciesInput] = useState('Severe Convective Tracking, Dual-Pol Hydrometeor Algorithms, Flash Flood SOPs');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=600&auto=format&fit=crop&q=80');

  // Modules Builder
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: `mod_${Date.now()}_1`,
      title: 'Module 1: Principles & Satellite-Radar Synergy',
      type: 'presentation',
      durationMinutes: 45,
      summary: 'Theoretical foundations and operational data assimilation.',
      completed: false,
      slides: [
        {
          slideNumber: 1,
          title: 'Atmospheric Radar Principles',
          bulletPoints: [
            'Electromagnetic wave propagation in heterogeneous atmosphere.',
            'Reflectivity factor (Z) calculation and drop size distribution (DSD).',
            'S-Band versus C-Band pulse attenuation characteristics.'
          ],
          notes: 'Ensure trainees verify receiver calibration constants.'
        }
      ]
    },
    {
      id: `mod_${Date.now()}_2`,
      title: 'Module 2: Real-time Convective Nowcasting SOP',
      type: 'video',
      durationMinutes: 60,
      summary: 'Case study on supercell thunderstorm tracking with Doppler velocity products.',
      completed: false,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
  ]);

  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [publishSuccess, setPublishSuccess] = useState<Course | null>(null);

  const handleAddModule = () => {
    const newMod: CourseModule = {
      id: `mod_${Date.now()}_${modules.length + 1}`,
      title: `Module ${modules.length + 1}: Practical Operational Workflow`,
      type: 'presentation',
      durationMinutes: 30,
      summary: 'Core instructions and operational evaluation criteria.',
      completed: false,
      slides: [
        {
          slideNumber: 1,
          title: 'Operational Scenario Overview',
          bulletPoints: ['Step 1: Check AWS automated telemetry', 'Step 2: Inspect Velocity Azimuth Display (VAD)', 'Step 3: Issue district bulletin'],
          notes: 'Standard MoES protocol.'
        }
      ]
    };
    setModules([...modules, newMod]);
    setActiveModuleIndex(modules.length);
  };

  const handleRemoveModule = (index: number) => {
    if (modules.length <= 1) return;
    const updated = modules.filter((_, idx) => idx !== index);
    setModules(updated);
    setActiveModuleIndex(Math.max(0, index - 1));
  };

  const handleAddSlideToActiveModule = () => {
    const currentMod = modules[activeModuleIndex];
    if (!currentMod) return;

    const currentSlides = currentMod.slides || [];
    const newSlide: SlideItem = {
      slideNumber: currentSlides.length + 1,
      title: `Topic ${currentSlides.length + 1}: Diagnostic Method`,
      bulletPoints: ['Key principle definition', 'Critical parameters for meteorological evaluation'],
      notes: 'Operational guidance for field stations.'
    };

    const updatedModules = [...modules];
    updatedModules[activeModuleIndex] = {
      ...currentMod,
      slides: [...currentSlides, newSlide]
    };
    setModules(updatedModules);
  };

  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a course title.');
      return;
    }

    const competenciesArray = competenciesInput.split(',').map(s => s.trim()).filter(Boolean);

    const createdCourse = addNewCourse({
      title,
      code,
      category,
      level,
      department,
      durationHours: Number(durationHours),
      description: description || 'Specialized capacity building module formulated for MoES meteorological trainees.',
      competenciesCovered: competenciesArray,
      thumbnail,
      modules
    });

    setPublishSuccess(createdCourse);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Curriculum & Slide Deck Builder</h1>
            <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Faculty Studio
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author comprehensive multi-module training courses, interactive slide decks, and technical manuals.
          </p>
        </div>
      </div>

      {publishSuccess ? (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle size={36} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Course Successfully Published to Portal!</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            <strong>{publishSuccess.title}</strong> is now live across the Trainee and Admin dashboards with all interactive modules and slide decks.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => openCoursePlayer(publishSuccess)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Eye size={15} />
              <span>Launch in Player Preview</span>
            </button>
            <button
              onClick={() => {
                setPublishSuccess(null);
                setTitle('');
                setCode(`MET-ADV-${Math.floor(100 + Math.random() * 900)}`);
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Create Another Course
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePublishCourse} className="space-y-6">
          {/* General Course Properties Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              1. General Course Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dual-Polarization Radar Interpretation in Pre-Monsoon Squall Lines"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                >
                  <option value="Radar Meteorology">Radar Meteorology</option>
                  <option value="Numerical Weather Prediction">Numerical Weather Prediction</option>
                  <option value="Disaster Management">Disaster Management</option>
                  <option value="Satellite Meteorology">Satellite Meteorology</option>
                  <option value="Agrometeorology">Agrometeorology</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Total Duration (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Competencies Covered (Comma-separated)
                </label>
                <input
                  type="text"
                  value={competenciesInput}
                  onChange={(e) => setCompetenciesInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Course Description & Objectives
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an overview of what trainees will master..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Curriculum Modules & Slides Builder */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  2. Curriculum Modules & Interactive Slide Decks
                </h3>
                <p className="text-xs text-slate-500">Add recorded lectures, slide presentations, or study manuals.</p>
              </div>
              <button
                type="button"
                onClick={handleAddModule}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add Module</span>
              </button>
            </div>

            {/* Modules Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {modules.map((mod, idx) => (
                <button
                  type="button"
                  key={mod.id}
                  onClick={() => setActiveModuleIndex(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeModuleIndex === idx
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>Mod {idx + 1}: {mod.title.slice(0, 20)}...</span>
                  {modules.length > 1 && (
                    <Trash2
                      size={12}
                      className="opacity-60 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveModule(idx);
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Active Module Editor */}
            {modules[activeModuleIndex] && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Module Title
                    </label>
                    <input
                      type="text"
                      value={modules[activeModuleIndex].title}
                      onChange={(e) => {
                        const updated = [...modules];
                        updated[activeModuleIndex].title = e.target.value;
                        setModules(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Module Type
                    </label>
                    <select
                      value={modules[activeModuleIndex].type}
                      onChange={(e) => {
                        const updated = [...modules];
                        updated[activeModuleIndex].type = e.target.value as any;
                        setModules(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      <option value="presentation">Interactive Slide Deck</option>
                      <option value="video">Recorded Video Lecture</option>
                      <option value="document">Technical Document / Manual</option>
                    </select>
                  </div>
                </div>

                {/* If Presentation Type: Slide Creator */}
                {modules[activeModuleIndex].type === 'presentation' && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Slide Deck Pages ({modules[activeModuleIndex].slides?.length || 0})
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddSlideToActiveModule}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                      >
                        <Plus size={13} />
                        <span>Add Slide</span>
                      </button>
                    </div>

                    {modules[activeModuleIndex].slides?.map((slide, sIdx) => (
                      <div key={sIdx} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-teal-700">Slide {sIdx + 1}</span>
                          {modules[activeModuleIndex].slides!.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...modules];
                                updated[activeModuleIndex].slides = updated[activeModuleIndex].slides!.filter((_, i) => i !== sIdx);
                                setModules(updated);
                              }}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="Slide Title (e.g. Dual-Pol Correlation Coefficient)"
                          value={slide.title}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[activeModuleIndex].slides![sIdx].title = e.target.value;
                            setModules(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                        />

                        <textarea
                          rows={2}
                          placeholder="Bullet Points (One per line)"
                          value={slide.bulletPoints.join('\n')}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[activeModuleIndex].slides![sIdx].bulletPoints = e.target.value.split('\n');
                            setModules(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700"
                        />

                        <input
                          type="text"
                          placeholder="Faculty Operational Notes (Guidance for trainees)"
                          value={slide.notes}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[activeModuleIndex].slides![sIdx].notes = e.target.value;
                            setModules(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-600"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('Dashboard')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Save size={16} />
              <span>Publish Course to National Portal</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

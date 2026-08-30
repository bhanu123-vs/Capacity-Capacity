import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  HelpCircle, 
  CheckCircle, 
  FileText, 
  Sparkles, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Assessment, MCQQuestion } from '../../types';

export const QuestionnaireBuilderView: React.FC = () => {
  const { courses, addNewAssessment, setActiveTab, currentUser, startAssessment } = useApp();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState(`EVAL-MET-${Math.floor(100 + Math.random() * 900)}`);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(20);
  const [passingPercentage, setPassingPercentage] = useState(75);

  const [questions, setQuestions] = useState<MCQQuestion[]>([
    {
      id: 'q1',
      text: 'What is the primary indicator of atmospheric instability in Pre-Convective sounding profiles?',
      options: [
        'High Convective Available Potential Energy (CAPE > 1500 J/kg) with low CIN',
        'Strictly zero Vertical Wind Shear in 0-6km layer',
        'Dry mid-levels accompanied by isothermal lapse rate',
        'High surface pressure with strong anticyclonic subsidence'
      ],
      correctIndex: 0,
      explanation: 'Elevated CAPE values coupled with low CIN (Convective Inhibition) represent buoyant energy for thunderstorm updrafts.',
      category: 'Atmospheric Thermodynamics',
      difficulty: 'Medium'
    },
    {
      id: 'q2',
      text: 'In satellite infrared imagery, what does a rapid cooling of cloud tops below -70°C signify during cyclone intensification?',
      options: [
        'Cloud dissipation into dry air',
        'Intense deep convective bursting in the central dense overcast (CDO)',
        'Stratocumulus cloud deck over cold sea water',
        'Cirrus outflow weakening'
      ],
      correctIndex: 1,
      explanation: 'Rapid cloud top cooling indicates vigorous convective updrafts penetrating the upper troposphere, a hallmark of cyclone deepening.',
      category: 'Satellite Meteorology',
      difficulty: 'Hard'
    }
  ]);

  const [publishedAssessment, setPublishedAssessment] = useState<Assessment | null>(null);

  const handleAddQuestion = () => {
    const newQ: MCQQuestion = {
      id: `q_${Date.now()}_${questions.length + 1}`,
      text: 'New operational scenario question...',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0,
      explanation: 'Detailed meteorological explanation for the correct protocol.',
      category: 'Operational Meteorology',
      difficulty: 'Medium'
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, idx) => idx !== index));
  };

  const handlePublishAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an assessment title.');
      return;
    }

    const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

    const createdAsm: Partial<Assessment> = {
      title,
      code,
      courseId: selectedCourse?.id,
      courseTitle: selectedCourse?.title,
      department: currentUser.department,
      timeLimitMinutes: Number(timeLimitMinutes),
      passingPercentage: Number(passingPercentage),
      totalMarks: questions.length * 5,
      questions
    };

    addNewAssessment(createdAsm);
    setPublishedAssessment(createdAsm as Assessment);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">MCQ Assessment & Questionnaire Builder</h1>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Exam Authoring
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Formulate timed scenario evaluations, configure passing criteria, and validate candidate readiness.
          </p>
        </div>
      </div>

      {publishedAssessment ? (
        <div className="bg-white rounded-3xl p-8 border border-purple-200 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
            <CheckCircle size={36} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">MCQ Assessment Published Successfully!</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            <strong>{publishedAssessment.title}</strong> is now live in the National Assessment Center. Trainees can take it to earn official certifications.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveTab('MCQ Assessments');
                startAssessment(publishedAssessment);
              }}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Eye size={15} />
              <span>Test Candidate Experience</span>
            </button>
            <button
              onClick={() => {
                setPublishedAssessment(null);
                setTitle('');
                setCode(`EVAL-MET-${Math.floor(100 + Math.random() * 900)}`);
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Create Another Exam
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePublishAssessment} className="space-y-6">
          {/* Assessment Meta Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              1. Assessment Parameters & Linked Course
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. National Certification Test: Doppler Radar & Severe Storm SOPs"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assessment Code
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
                  Linked Course
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title.slice(0, 35)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Time Limit (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Passing Percentage (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Questions Builder */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  2. MCQ Questions & Explanations ({questions.length})
                </h3>
                <p className="text-xs text-slate-500">Design multiple choice options and designate the correct answer index.</p>
              </div>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((q, qIdx) => (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      Question #{qIdx + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Question Scenario / Text
                    </label>
                    <textarea
                      rows={2}
                      value={q.text}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIdx].text = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                    />
                  </div>

                  {/* 4 Options */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      Options (Select the Radio Button for the Correct Answer)
                    </label>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct_${q.id}`}
                          checked={q.correctIndex === oIdx}
                          onChange={() => {
                            const updated = [...questions];
                            updated[qIdx].correctIndex = oIdx;
                            setQuestions(updated);
                          }}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-slate-500 w-4">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[qIdx].options[oIdx] = e.target.value;
                            setQuestions(updated);
                          }}
                          className={`flex-1 px-3 py-1.5 rounded-lg border text-xs ${
                            q.correctIndex === oIdx ? 'border-emerald-500 bg-emerald-50/50 font-bold text-emerald-950' : 'border-slate-200 bg-white'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Scientific Explanation (Displayed after candidate submission)
                    </label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIdx].explanation = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
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
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Save size={16} />
              <span>Publish Assessment</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

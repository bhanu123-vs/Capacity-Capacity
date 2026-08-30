import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Flag, 
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Assessment, MCQQuestion } from '../../types';
import confetti from 'canvas-confetti';

export const AssessmentQuizView: React.FC = () => {
  const { 
    assessments, 
    activeAssessment, 
    startAssessment, 
    closeAssessment, 
    submitAssessmentAttempt,
    openCertificateModal
  } = useApp();

  // Test Session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [testResult, setTestResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    timeSpent: number;
    certGenerated?: any;
  } | null>(null);
  const [showReviewMode, setShowReviewMode] = useState(false);

  // Initialize test
  const handleLaunchTest = (asm: Assessment) => {
    startAssessment(asm);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setSecondsRemaining(asm.timeLimitMinutes * 60);
    setIsTestActive(true);
    setTestResult(null);
    setShowReviewMode(false);
  };

  // Timer countdown
  useEffect(() => {
    if (!isTestActive || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestActive, secondsRemaining]);

  const currentAssessment = activeAssessment || assessments[0];
  const questions: MCQQuestion[] = currentAssessment?.questions || [];
  const activeQuestion: MCQQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (optIndex: number) => {
    if (!activeQuestion) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: optIndex
    }));
  };

  const toggleFlagQuestion = (qId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleSubmitTest = () => {
    if (!currentAssessment) return;

    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const marksPerQuestion = currentAssessment.totalMarks / (questions.length || 1);
    const score = Math.round(correctCount * marksPerQuestion);
    const percentage = Math.round((correctCount / (questions.length || 1)) * 100);
    const passed = percentage >= currentAssessment.passingPercentage;
    const timeSpent = (currentAssessment.timeLimitMinutes * 60) - secondsRemaining;

    // Submit to store
    const cert = submitAssessmentAttempt(
      currentAssessment.id,
      selectedAnswers,
      score,
      currentAssessment.totalMarks,
      percentage,
      passed,
      timeSpent
    );

    setTestResult({
      score,
      total: currentAssessment.totalMarks,
      percentage,
      passed,
      timeSpent,
      certGenerated: cert
    });

    setIsTestActive(false);

    if (passed) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // If no test is running, show assessments list
  if (!isTestActive && !testResult) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">National MCQ Assessments</h1>
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Evaluation Center
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Standardized timed competency examinations for IMD radar officers, meteorologists, and operational scientists.
            </p>
          </div>
        </div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessments.map((asm) => {
            const bestAttempt = asm.userAttempts && asm.userAttempts.length > 0 
              ? asm.userAttempts.reduce((max, curr) => curr.percentage > max.percentage ? curr : max, asm.userAttempts[0])
              : null;

            return (
              <div
                key={asm.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {asm.code}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {asm.department}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {asm.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Course: <span className="font-semibold text-slate-700">{asm.courseTitle}</span>
                  </p>

                  <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Questions</span>
                      <p className="text-sm font-extrabold text-slate-800">{asm.questions.length}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Time Limit</span>
                      <p className="text-sm font-extrabold text-slate-800">{asm.timeLimitMinutes} Mins</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Pass Mark</span>
                      <p className="text-sm font-extrabold text-slate-800">{asm.passingPercentage}%</p>
                    </div>
                  </div>

                  {/* Previous Attempt Indicator */}
                  {bestAttempt && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
                      <span className="text-emerald-800 font-medium">
                        Last Attempt: <strong className="font-bold">{bestAttempt.percentage}% Score</strong> ({bestAttempt.score}/{bestAttempt.totalMarks})
                      </span>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {bestAttempt.passed ? 'PASSED' : 'NEEDS RETAKE'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleLaunchTest(asm)}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText size={16} />
                    <span>{bestAttempt ? 'Retake Examination' : 'Start Timed Assessment'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // If Test Result screen is shown
  if (testResult && !isTestActive) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg text-center space-y-5">
          <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-md ${
            testResult.passed 
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
              : 'bg-gradient-to-br from-amber-500 to-red-600 text-white'
          }`}>
            {testResult.passed ? <Award size={40} /> : <AlertCircle size={40} />}
          </div>

          <div>
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              testResult.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {testResult.passed ? 'Assessment Passed • Certified' : 'Assessment Incomplete • Retry'}
            </span>

            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              {testResult.passed ? 'Congratulations! Competency Verified.' : 'Keep Practicing to Meet Benchmark'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1">
              {testResult.passed
                ? 'Your operational readiness score qualifies for the official MoES / IMD National Qualification Credential.'
                : `You scored ${testResult.percentage}%. The required pass mark is ${currentAssessment.passingPercentage}%. Review explanations below and retake.`}
            </p>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-lg mx-auto">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold">Total Score</span>
              <p className="text-xl font-extrabold text-slate-900">{testResult.score}/{testResult.total}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold">Percentage</span>
              <p className={`text-xl font-extrabold ${testResult.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                {testResult.percentage}%
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold">Time Spent</span>
              <p className="text-xl font-extrabold text-slate-900">{formatTimer(testResult.timeSpent)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {testResult.certGenerated && (
              <button
                onClick={() => openCertificateModal(testResult.certGenerated)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all"
              >
                <Award size={16} />
                <span>View & Print Official Certificate</span>
              </button>
            )}

            <button
              onClick={() => setShowReviewMode(!showReviewMode)}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <FileText size={16} />
              <span>{showReviewMode ? 'Hide Detailed Review' : 'Review All Answers & Explanations'}</span>
            </button>

            <button
              onClick={() => handleLaunchTest(currentAssessment)}
              className="px-5 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Retake Examination</span>
            </button>
          </div>
        </div>

        {/* Detailed Question Review Accordion / List */}
        {showReviewMode && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">
              Comprehensive Operational Question Breakdown
            </h3>

            <div className="space-y-6">
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border ${
                      isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-red-200 bg-red-50/40'
                    } space-y-3`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-slate-700 font-mono">Q{idx + 1}.</span>
                        <h4 className="font-bold text-sm text-slate-900">{q.text}</h4>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 ${
                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {isCorrect ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    {/* Options list */}
                    <div className="space-y-1.5 pl-6">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = userAns === oIdx;
                        const isRightOption = q.correctIndex === oIdx;

                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-between ${
                              isRightOption
                                ? 'bg-emerald-100/80 border-emerald-300 text-emerald-950 font-bold'
                                : isSelected
                                ? 'bg-red-100/80 border-red-300 text-red-950 line-through'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <span>{opt}</span>
                            {isRightOption && <span className="text-[10px] text-emerald-700 font-bold uppercase">Correct Answer</span>}
                            {isSelected && !isRightOption && <span className="text-[10px] text-red-700 font-bold uppercase">Your Choice</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Scientific explanation */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-700">
                      <span className="font-bold text-blue-700 uppercase tracking-wider mr-1">
                        Operational Explanation:
                      </span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Assessment Test Screen
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Test Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
            {currentAssessment.code}
          </span>
          <h2 className="text-lg font-extrabold text-white mt-1">
            {currentAssessment.title}
          </h2>
          <p className="text-xs text-slate-400">
            Question {currentQuestionIndex + 1} of {questions.length} • Category: {activeQuestion?.category}
          </p>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 self-start sm:self-auto">
          <Clock size={20} className={secondsRemaining < 180 ? 'text-red-400 animate-pulse' : 'text-blue-400'} />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Time Remaining</span>
            <span className={`text-base font-mono font-bold ${secondsRemaining < 180 ? 'text-red-400' : 'text-white'}`}>
              {formatTimer(secondsRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Examination Layout: Question Card + Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Active Question */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 flex flex-col justify-between min-h-[420px]">
          {activeQuestion && (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
                  Question {currentQuestionIndex + 1}
                </span>

                <button
                  onClick={() => toggleFlagQuestion(activeQuestion.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    flaggedQuestions[activeQuestion.id]
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'text-slate-500 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Flag size={13} className={flaggedQuestions[activeQuestion.id] ? 'fill-amber-600 text-amber-600' : ''} />
                  <span>{flaggedQuestions[activeQuestion.id] ? 'Flagged for Review' : 'Flag Question'}</span>
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {activeQuestion.text}
              </h3>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {activeQuestion.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[activeQuestion.id] === optIdx;

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white font-bold text-xs' : 'border-slate-300'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-xs sm:text-sm leading-snug">{option}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-slate-700 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>Next Question</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                <CheckCircle size={16} />
                <span>Submit & Finalize Exam</span>
              </button>
            )}
          </div>
        </div>

        {/* Right 1 Col: Question Palette & Fast Jump */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Question Palette
          </h4>

          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
            {questions.map((q, qIdx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isFlagged = flaggedQuestions[q.id];
              const isCurrent = qIdx === currentQuestionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(qIdx)}
                  className={`w-9 h-9 rounded-xl font-mono text-xs font-bold relative transition-all ${
                    isCurrent
                      ? 'ring-2 ring-blue-600 bg-blue-600 text-white shadow-xs'
                      : isFlagged
                      ? 'bg-amber-100 text-amber-900 border border-amber-400'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {qIdx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300"></span>
              <span>Answered ({Object.keys(selectedAnswers).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-400"></span>
              <span>Flagged ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-slate-100"></span>
              <span>Remaining ({questions.length - Object.keys(selectedAnswers).length})</span>
            </div>
          </div>

          <button
            onClick={handleSubmitTest}
            className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
          >
            Finish Exam
          </button>
        </div>
      </div>
    </div>
  );
};

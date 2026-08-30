import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  Download, 
  Printer, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  QrCode, 
  Sparkles,
  Calendar,
  User,
  Share2,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Certificate } from '../../types';

export const CertificatesView: React.FC = () => {
  const { certificates, openCertificateModal, verifyCertificateByNumber } = useApp();
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ searched: boolean; cert: Certificate | null }>({
    searched: false,
    cert: null
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationInput.trim()) return;
    const cert = verifyCertificateByNumber(verificationInput);
    setVerificationResult({
      searched: true,
      cert
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">National Certificates Vault</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {certificates.length} Verified Credentials
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Government of India & MoES tamper-evident meteorological competency certificates with digital signature.
          </p>
        </div>
      </div>

      {/* Verification Tool Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-6 rounded-3xl text-white shadow-md border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <ShieldCheck size={20} />
          <h2 className="text-sm sm:text-base font-bold text-white">Public Certificate Authenticity Verifier</h2>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Any meteorological station, airport ATC authority, or university can independently verify credentials by entering the unique certificate alphanumeric ID below.
        </p>

        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <input
            type="text"
            value={verificationInput}
            onChange={(e) => setVerificationInput(e.target.value)}
            placeholder="e.g. MOES-IMD-2024-RAD-8842"
            className="flex-1 px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <Search size={14} />
            <span>Verify ID</span>
          </button>
        </form>

        {/* Verification Result Box */}
        {verificationResult.searched && (
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs mt-3">
            {verificationResult.cert ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span className="font-bold text-white text-sm">Official Record Verified & Valid</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Issued to <strong className="text-white">{verificationResult.cert.traineeName}</strong> ({verificationResult.cert.traineeId}) on {verificationResult.cert.issueDate} with Grade {verificationResult.cert.grade}.
                  </p>
                </div>
                <button
                  onClick={() => openCertificateModal(verificationResult.cert!)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs self-start sm:self-auto"
                >
                  View Certificate
                </button>
              </div>
            ) : (
              <div className="text-amber-300 flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-400" />
                <span>Certificate ID not found in the national registry database. Please check for typographical errors.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/5 rounded-full pointer-events-none"></div>

            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                    <Award size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {cert.certificateNumber}
                    </span>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  Grade {cert.grade} ({cert.scorePercentage}%)
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                {cert.courseTitle}
              </h3>

              <div className="space-y-1 mt-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <User size={13} className="text-slate-400" />
                  <span>Recipient: <strong className="text-slate-800">{cert.traineeName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-slate-400" />
                  <span>Conferred on: {cert.issueDate}</span>
                </div>
              </div>

              {/* Mastered Skills Chips */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Skills Validated:
                </p>
                <div className="flex flex-wrap gap-1">
                  {cert.skillsMastered.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => openCertificateModal(cert)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <FileCheck size={16} />
                <span>View Full Certificate</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Modal for Official Printable Certificate
export const CertificateModal: React.FC<{ cert: Certificate; onClose: () => void }> = ({ cert, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl space-y-6 relative max-h-[95vh] overflow-y-auto">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between no-print border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500">ID: {cert.certificateNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Printer size={15} />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* The Official Printed Certificate Body */}
        <div className="p-8 sm:p-12 border-8 border-double border-amber-600/60 rounded-2xl bg-radial from-amber-50/30 via-white to-amber-50/10 text-center relative overflow-hidden shadow-inner">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <Award size={400} className="text-slate-900" />
          </div>

          {/* Header */}
          <div className="relative z-10 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-slate-500 font-serif">
              Government of India • Ministry of Earth Sciences
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900 font-certificate tracking-wide">
              INDIA METEOROLOGICAL DEPARTMENT
            </h2>
            <div className="w-24 h-0.5 bg-amber-500 mx-auto my-2"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
              National Meteorological Training & Capacity Building Directorate
            </p>
          </div>

          {/* Certificate Title */}
          <div className="my-6 relative z-10 space-y-1">
            <p className="text-xs text-slate-500 italic">This is to officially certify that</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif decoration-amber-500 underline underline-offset-8">
              {cert.traineeName}
            </h3>
            <p className="text-xs font-mono text-slate-600 pt-2">
              Trainee Officer ID: <strong>{cert.traineeId}</strong> | {cert.traineeDepartment}
            </p>
          </div>

          {/* Achievement Description */}
          <div className="my-6 relative z-10 space-y-2 max-w-xl mx-auto">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              has successfully completed the comprehensive advanced curriculum and demonstrated evaluated competency with a distinction grade of <strong className="text-blue-900 font-extrabold">{cert.grade} ({cert.scorePercentage}%)</strong> in:
            </p>
            <h4 className="text-base sm:text-lg font-bold text-blue-950 font-serif bg-blue-50/80 p-2.5 rounded-xl border border-blue-100">
              {cert.courseTitle}
            </h4>
          </div>

          {/* Skills Mastered */}
          <div className="my-4 relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Verified Competency Domains
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {cert.skillsMastered.map((s, idx) => (
                <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="mt-10 pt-6 border-t border-slate-200 relative z-10 grid grid-cols-3 items-end text-xs">
            {/* Instructor Signature */}
            <div className="text-center space-y-1">
              <p className="font-serif italic text-base text-blue-950">{cert.instructorName}</p>
              <div className="w-32 h-px bg-slate-300 mx-auto"></div>
              <p className="font-bold text-slate-800 text-[11px]">{cert.instructorTitle}</p>
              <p className="text-[10px] text-slate-400">Course Lead Faculty</p>
            </div>

            {/* Official Center Seal & QR */}
            <div className="text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-amber-600/80 bg-amber-100/50 flex flex-col items-center justify-center text-amber-900 shadow-xs mb-1">
                <Award size={20} className="text-amber-700" />
                <span className="text-[7px] font-extrabold uppercase tracking-tighter">OFFICIAL SEAL</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">MoES/IMD Verified</span>
            </div>

            {/* Director Signature */}
            <div className="text-center space-y-1">
              <p className="font-serif italic text-base text-blue-950">{cert.directorName}</p>
              <div className="w-32 h-px bg-slate-300 mx-auto"></div>
              <p className="font-bold text-slate-800 text-[11px]">{cert.directorTitle}</p>
              <p className="text-[10px] text-slate-400">Director General (IMD)</p>
            </div>
          </div>

          {/* Footnote ID */}
          <div className="mt-6 text-center text-[10px] font-mono text-slate-400 relative z-10">
            Certificate ID: {cert.certificateNumber} | Issued: {cert.issueDate}
          </div>
        </div>
      </div>
    </div>
  );
};

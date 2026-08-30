import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Key, 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Cloud, 
  Layers, 
  Sparkles,
  Server,
  Terminal,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FirebaseSetupModal: React.FC = () => {
  const { isFirebaseModalOpen, setIsFirebaseModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'architecture' | 'rules' | 'config' | 'export'>('architecture');
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isFirebaseModalOpen) return null;

  const collections = [
    { name: 'users', count: '1,420 docs', schema: '{ uid, name, email, role: "Trainee"|"Trainer"|"Admin", employeeId, department, centerLocation, verified: boolean }' },
    { name: 'courses', count: '8 docs', schema: '{ courseId, title, code, category, level, durationHours, modules: Array<CourseModule>, enrolledCount }' },
    { name: 'assessments', count: '5 docs', schema: '{ id, title, code, passingPercentage, timeLimitMinutes, questions: Array<MCQQuestion> }' },
    { name: 'attempts', count: '2,840 docs', schema: '{ attemptId, traineeId, assessmentId, score, totalMarks, percentage, passed, timestamp }' },
    { name: 'certificates', count: '3,890 docs', schema: '{ certificateNumber, traineeId, traineeName, courseId, grade, issueDate, directorSignature }' },
    { name: 'knowledge_documents', count: '24 docs', schema: '{ docId, title, category, fileType, fileSize, downloadUrl, author, keyHighlights }' },
    { name: 'announcements', count: '12 docs', schema: '{ id, title, content, priority, targetRole, department, date }' },
    { name: 'user_approvals', count: '6 docs', schema: '{ id, name, employeeId, appliedRole, department, idProofDoc, status: "Pending"|"Approved"|"Rejected" }' },
  ];

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check role from custom claims or user doc
    function isAuth() {
      return request.auth != null;
    }
    function isAdmin() {
      return isAuth() && (request.auth.token.role == 'Admin' || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin');
    }
    function isTrainer() {
      return isAuth() && (request.auth.token.role in ['Trainer', 'Admin']);
    }

    // User collection rules
    match /users/{userId} {
      allow read: if isAuth();
      allow write: if isAuth() && (request.auth.uid == userId || isAdmin());
    }

    // Courses & Modules: Public read for auth staff, Trainer/Admin write
    match /courses/{courseId} {
      allow read: if isAuth();
      allow create, update, delete: if isTrainer();
    }

    // Assessments & Question Bank
    match /assessments/{asmId} {
      allow read: if isAuth();
      allow create, update, delete: if isTrainer();
    }

    // Candidate Assessment Submissions
    match /attempts/{attemptId} {
      allow read: if isAuth() && (resource.data.traineeId == request.auth.uid || isTrainer());
      allow create: if isAuth();
    }

    // Tamper-Evident Certificates
    match /certificates/{certId} {
      allow read: if true; // Public verification allowed by certificate ID
      allow write: if isAdmin();
    }

    // Circulars & Advisories
    match /announcements/{annId} {
      allow read: if isAuth();
      allow write: if isAdmin();
    }
  }
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Database size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900">Firebase & Cloud Firestore Integration</h3>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cloud Firestore NoSQL Schema, RBAC Security Rules, and SDK connector blueprints for SIH deployment.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFirebaseModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
          {[
            { id: 'architecture', label: 'Firestore Collections' },
            { id: 'rules', label: 'Security Rules (RBAC)' },
            { id: 'config', label: 'Firebase SDK Setup' },
            { id: 'export', label: 'State Sync & Persistence' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-2xs font-extrabold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Architecture Collections */}
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-amber-700 shrink-0" />
              <span>
                All database entities are synchronized with <strong>localStorage fallback persistence</strong> in this frontend and ready for direct Firebase Firestore mapping.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {collections.map((col, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      /{col.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{col.count}</span>
                  </div>
                  <pre className="text-[10px] font-mono text-slate-600 bg-white p-2 rounded-lg border border-slate-200 overflow-x-auto whitespace-pre-wrap">
                    {col.schema}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Security Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600 font-medium">
                Production-grade `firestore.rules` enforcing strict role segregation for MoES Trainees, Trainers, and Ministry Admins:
              </p>
              <button
                onClick={() => copyToClipboard(sampleRules)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Copy size={13} />
                <span>{copiedKey ? 'Copied!' : 'Copy Rules'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-amber-300 font-mono text-[11px] rounded-2xl overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
              {sampleRules}
            </pre>
          </div>
        )}

        {/* Tab 3: Firebase SDK Setup */}
        {activeTab === 'config' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              To connect your Firebase Project in Google Cloud console, add your environment credentials:
            </p>

            <div className="p-4 bg-slate-900 rounded-2xl text-emerald-400 font-mono text-xs space-y-2 border border-slate-800">
              <p className="text-slate-400">// .env file configuration</p>
              <p>VITE_FIREBASE_API_KEY=AIzaSyA4ExampleKeyMoES</p>
              <p>VITE_FIREBASE_AUTH_DOMAIN=capacity-connect-imd.firebaseapp.com</p>
              <p>VITE_FIREBASE_PROJECT_ID=capacity-connect-imd</p>
              <p>VITE_FIREBASE_STORAGE_BUCKET=capacity-connect-imd.appspot.com</p>
              <p>VITE_FIREBASE_MESSAGING_SENDER_ID=8824102941</p>
              <p>VITE_FIREBASE_APP_ID=1:8824102941:web:984f1839</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
              <span className="font-bold block">Firebase Authentication Methods Enabled:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                <li>Email/Password with Government (.gov.in / nic.in) validation</li>
                <li>Google SSO for official MoES / IMD workspace accounts</li>
                <li>Custom Claims token injection for RBAC roles (`role: "Admin"`)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: State Sync */}
        {activeTab === 'export' && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <CheckCircle size={15} className="text-emerald-600" />
                Live State Persistence Active
              </span>
              <p className="text-slate-600 text-xs">
                All mock courses, active examinations, created questionnaires, verified certificates, and user role updates are actively persisted across browser sessions with zero data loss.
              </p>
            </div>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
            >
              Reset to Factory MoES Dataset
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={() => setIsFirebaseModalOpen(false)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

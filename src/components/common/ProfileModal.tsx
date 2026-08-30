import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Building2, 
  MapPin, 
  BadgeCheck, 
  Shield, 
  GraduationCap, 
  Award, 
  LogOut, 
  Database,
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const ProfileModal: React.FC = () => {
  const { 
    isProfileModalOpen, 
    setIsProfileModalOpen, 
    currentUser, 
    setCurrentUser, 
    role, 
    setRole, 
    authUser, 
    logoutWithFirebase,
    setIsAuthModalOpen,
    setIsFirebaseModalOpen
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [department, setDepartment] = useState(currentUser.department);
  const [centerLocation, setCenterLocation] = useState(currentUser.centerLocation);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isProfileModalOpen) return null;

  const handleSaveProfile = () => {
    setCurrentUser(prev => ({
      ...prev,
      name,
      department,
      centerLocation
    }));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditing(false);
    }, 1200);
  };

  const handleLogout = async () => {
    await logoutWithFirebase();
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UserIcon size={20} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Officer Profile</h3>
              <p className="text-xs text-slate-500">Ministry of Earth Sciences Identity & Credentials</p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-slate-900 truncate">{currentUser.name}</h4>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-extrabold rounded-full">
                {role}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">ID: {currentUser.employeeId}</p>
          </div>
        </div>

        {/* Firebase Authentication Status Card */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-1.5">
          <div className="flex items-center justify-between font-bold text-blue-900">
            <span className="flex items-center gap-1.5">
              <Database size={15} className="text-blue-600" />
              Firebase Account Link:
            </span>
            <span className="text-[10px] bg-blue-100 px-2 py-0.5 rounded text-blue-800 font-mono">
              {authUser ? 'AUTHENTICATED' : 'DEMO/GUEST'}
            </span>
          </div>
          <p className="text-slate-600 text-[11px]">
            {authUser ? (
              <>Signed in with UID: <span className="font-mono text-slate-800">{authUser.uid}</span>. Role <span className="font-bold text-blue-700">{role}</span> is synced with Cloud Firestore (<code className="text-[10px] bg-white px-1 py-0.5 rounded">users/{authUser.uid}</code>).</>
            ) : (
              <>Running in preview demo mode. Sign in or register with email to test your live Firestore persistence.</>
            )}
          </p>
          {!authUser && (
            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="mt-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[11px] transition-colors"
            >
              Sign In / Register with Firebase
            </button>
          )}
        </div>

        {/* Profile Info or Edit form */}
        {isEditing ? (
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Location / Center</label>
              <input
                type="text"
                value={centerLocation}
                onChange={(e) => setCenterLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            {savedSuccess && (
              <p className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle size={14} /> Profile updated successfully!
              </p>
            )}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 flex items-center gap-2">
                <Building2 size={15} /> Department
              </span>
              <span className="font-semibold text-slate-800 truncate max-w-[220px]">{currentUser.department}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 flex items-center gap-2">
                <MapPin size={15} /> Station / RMC
              </span>
              <span className="font-semibold text-slate-800">{currentUser.centerLocation}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 flex items-center gap-2">
                <Clock size={15} /> Joined Date
              </span>
              <span className="font-semibold text-slate-800">{currentUser.joinedDate}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-colors text-center"
              >
                Edit Details
              </button>
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setIsFirebaseModalOpen(true);
                }}
                className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 rounded-xl font-bold transition-colors flex items-center gap-1.5"
              >
                <Database size={14} />
                <span>DB Schema</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Bell, 
  Database, 
  Menu, 
  X, 
  Shield, 
  Award,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface NavbarProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  mobileMenuOpen: externalMobileMenuOpen, 
  setMobileMenuOpen: externalSetMobileMenuOpen 
}) => {
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const mobileMenuOpen = externalMobileMenuOpen ?? internalMobileMenuOpen;
  const setMobileMenuOpen = externalSetMobileMenuOpen ?? setInternalMobileMenuOpen;

  const { 
    role, 
    currentUser, 
    unreadAnnouncementsCount,
    setIsNotificationDrawerOpen,
    setIsProfileModalOpen,
    setIsFirebaseModalOpen,
    authUser,
    logoutWithFirebase
  } = useApp();

  // Role portal styling config
  const roleDisplay = {
    Trainee: {
      title: 'Trainee Portal',
      subtitle: 'Officer Learning & Assessment',
      icon: Award,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
      dotColor: 'bg-blue-500'
    },
    Trainer: {
      title: 'Trainer Portal',
      subtitle: 'Senior Faculty & Content Authoring',
      icon: GraduationCap,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200/80',
      dotColor: 'bg-teal-500'
    },
    Admin: {
      title: 'Directorate Console',
      subtitle: 'Central MoES Administration',
      icon: Shield,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200/80',
      dotColor: 'bg-purple-500'
    }
  }[role] || {
    title: 'Trainee Portal',
    subtitle: 'Officer Learning & Assessment',
    icon: Award,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dotColor: 'bg-blue-500'
  };

  const RoleIcon = roleDisplay.icon;

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Ministry Top Ribbon */}
      <div className="bg-slate-950 text-slate-300 text-[11px] px-4 sm:px-8 py-1.5 flex justify-between items-center border-b border-slate-850">
        <div className="flex items-center gap-2 font-medium">
          <span className="font-bold text-amber-400 tracking-wide">GOVERNMENT OF INDIA</span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline">Ministry of Earth Sciences (MoES)</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-blue-400">India Meteorological Department</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 font-mono">
            capacity-connect-f929b
          </span>
          <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {authUser ? 'AUTHENTICATED SESSION' : 'GUEST SESSION'}
          </span>
        </div>
      </div>

      {/* Main Clean Navigation Bar */}
      <div className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white">
        {/* Left: Brand & Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 mr-1 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              CAPACITY <span className="text-blue-600">CONNECT</span>
            </span>
          </div>
        </div>

        {/* Center: Official Dedicated Officer Portal Badge (Non-clickable, Enforces Role Isolation) */}
        <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full border shadow-xs bg-slate-50 border-slate-200">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${roleDisplay.badgeColor}`}>
            <RoleIcon size={15} />
          </div>
          <div className="text-left pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-900 leading-none">
                {roleDisplay.title}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${roleDisplay.dotColor}`}></span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium leading-none block mt-0.5">
              {roleDisplay.subtitle}
            </span>
          </div>
        </div>

        {/* Right Tools & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Firebase Database Drawer Trigger */}
          <button
            onClick={() => setIsFirebaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            title="Database & Storage Blueprint"
          >
            <Database size={14} className="text-blue-600" />
            <span className="hidden sm:inline">Firebase</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadAnnouncementsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadAnnouncementsCount}
              </span>
            )}
          </button>

          {/* Profile Button */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left cursor-pointer"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white rounded-full"></span>
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-blue-600 font-semibold">
                {role}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {/* Direct Sign Out / Switch Role button */}
          <button
            onClick={logoutWithFirebase}
            title="Sign Out / Switch Role"
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Dedicated Portal Header */}
      <div className="md:hidden px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RoleIcon size={16} className="text-blue-600" />
          <span className="text-xs font-bold text-slate-800">{roleDisplay.title}</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
          {role}
        </span>
      </div>
    </header>
  );
};

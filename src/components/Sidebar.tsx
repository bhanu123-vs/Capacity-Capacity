import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Search, 
  TrendingUp, 
  Upload, 
  ShieldCheck, 
  Users, 
  Bell, 
  Target,
  FileQuestion,
  BarChart3,
  ExternalLink,
  Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface SidebarProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { 
    role, 
    activeTab, 
    setActiveTab, 
    enrolledCourses, 
    assessments, 
    certificates, 
    pendingApprovals,
    unreadAnnouncementsCount,
    setIsFirebaseModalOpen
  } = useApp();

  const pendingCount = pendingApprovals.filter(p => p.status === 'Pending').length;

  const menuConfig: Record<UserRole, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: string | number; badgeColor?: string }[]> = {
    Trainee: [
      { label: 'Dashboard', icon: LayoutDashboard },
      { label: 'AI Doubt Solver', icon: Bot, badge: 'AI', badgeColor: 'bg-indigo-100 text-indigo-700' },
      { label: 'My Courses', icon: BookOpen, badge: `${enrolledCourses.length}`, badgeColor: 'bg-blue-100 text-blue-800' },
      { label: 'MCQ Assessments', icon: FileText, badge: `${assessments.length}`, badgeColor: 'bg-purple-100 text-purple-800' },
      { label: 'Certificates', icon: CheckCircle, badge: `${certificates.length}`, badgeColor: 'bg-emerald-100 text-emerald-800' },
      { label: 'Knowledge Library', icon: Search },
      { label: 'Competency Map', icon: Target },
    ],
    Trainer: [
      { label: 'Dashboard', icon: LayoutDashboard },
      { label: 'AI Doubt Solver', icon: Bot, badge: 'AI', badgeColor: 'bg-indigo-100 text-indigo-700' },
      { label: 'Create Content', icon: Upload, badge: 'New', badgeColor: 'bg-emerald-100 text-emerald-800' },
      { label: 'Questionnaires', icon: FileQuestion, badge: `${assessments.length}`, badgeColor: 'bg-blue-100 text-blue-800' },
      { label: 'Trainee Analytics', icon: BarChart3 },
      { label: 'Knowledge Library', icon: Search },
    ],
    Admin: [
      { label: 'Dashboard', icon: LayoutDashboard },
      { label: 'User Approval', icon: ShieldCheck, badge: pendingCount > 0 ? `${pendingCount}` : undefined, badgeColor: 'bg-amber-500 text-white' },
      { label: 'Role Management', icon: Users },
      { label: 'Global Statistics', icon: TrendingUp },
      { label: 'Announcements', icon: Bell, badge: unreadAnnouncementsCount > 0 ? `${unreadAnnouncementsCount}` : undefined, badgeColor: 'bg-red-500 text-white' },
    ]
  };

  const currentMenu = menuConfig[role] || menuConfig.Trainee;

  const handleSelectTab = (tabName: string) => {
    setActiveTab(tabName);
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-30
        w-64 bg-white border-r border-slate-200 flex flex-col p-5 space-y-4 shrink-0
        transition-transform duration-300 ease-in-out min-h-[calc(100vh-6rem)]
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Navigation Items */}
        <div className="flex-1 space-y-1">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4 px-2">
            Main Navigation
          </p>

          <div className="space-y-1">
            {currentMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => handleSelectTab(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={19} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                    <span className="text-sm">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Official Partner Badge */}
        <div className="mt-auto p-4 bg-slate-900 rounded-2xl text-white">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Official Partner</p>
          <p className="text-sm font-bold mt-0.5">Ministry of Earth Sciences</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-blue-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              System Active
            </div>
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className="text-[10px] text-slate-300 hover:text-white underline font-mono flex items-center gap-1"
            >
              <span>DB Sync</span>
              <ExternalLink size={10} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

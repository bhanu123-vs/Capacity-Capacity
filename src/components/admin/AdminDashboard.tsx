import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Bell, 
  Radio, 
  ArrowRight,
  Database,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    pendingApprovals, 
    setActiveTab, 
    setIsFirebaseModalOpen,
    announcements
  } = useApp();

  const pendingCount = pendingApprovals.filter(p => p.status === 'Pending').length;

  const centerReadiness = [
    { name: 'RMC New Delhi (Northern Zone)', count: 240, progress: 92, status: 'High Readiness' },
    { name: 'RMC Kolkata (Eastern & Coastal Zone)', count: 210, progress: 88, status: 'High Readiness' },
    { name: 'RMC Mumbai (Western Offshore Zone)', count: 195, progress: 85, status: 'Optimal' },
    { name: 'RMC Chennai (Southern Bay of Bengal Zone)', count: 230, progress: 94, status: 'High Readiness' },
    { name: 'RMC Guwahati (North-Eastern Terrains)', count: 145, progress: 76, status: 'Developing' },
    { name: 'RMC Nagpur (Central Inlands Zone)', count: 120, progress: 80, status: 'Optimal' },
  ];

  return (
    <div className="space-y-8">
      {/* Minimal Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Central Administration: {currentUser.name}
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">
            National capacity governance, user approvals, and operational readiness metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('User Approval')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ShieldCheck size={15} />
            <span>Review Approvals ({pendingCount})</span>
          </button>
          <button
            onClick={() => setIsFirebaseModalOpen(true)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Database size={15} className="text-blue-600" />
            <span>Firebase & Schema</span>
          </button>
        </div>
      </header>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Officers</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-blue-600">1,420</span>
            <span className="text-xs text-emerald-600 font-bold">Verified</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Requests</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-amber-600">{pendingCount.toString().padStart(2, '0')}</span>
            <span className="text-xs text-amber-600 font-semibold">Action needed</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Radar Stations</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-teal-600">37 / 37</span>
            <span className="text-xs text-teal-600 font-medium">100% Online</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificates Issued</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-indigo-600">3,890</span>
            <span className="text-xs text-blue-600 font-bold">QR Verified</span>
          </div>
        </div>
      </div>

      {/* Center-wise Readiness Heatmap & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: Regional Center Training Readiness */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
                Regional Meteorological Centre (RMC) Readiness
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('Global Statistics')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {centerReadiness.map((center, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{center.name}</span>
                    <span className="text-[11px] text-slate-400 ml-2">({center.count} personnel)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      center.status === 'High Readiness' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {center.status}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{center.progress}%</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${center.progress >= 90 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                    style={{ width: `${center.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Pending User Registrations Quick View */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Pending Approvals</h3>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingCount} Pending
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingApprovals.filter(p => p.status === 'Pending').slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                      {item.appliedRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{item.centerLocation}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('User Approval')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Open Approval Desk
            </button>
          </div>

          {/* Quick Broadcast Widget */}
          <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-blue-400" />
              <h4 className="font-bold text-sm">Official Announcements</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {announcements.length} circulars currently active across nationwide trainee and faculty feeds.
            </p>
            <button
              onClick={() => setActiveTab('Announcements')}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/10 transition-colors"
            >
              Manage Circulars
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

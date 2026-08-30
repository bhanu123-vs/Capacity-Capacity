import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Globe2, 
  Download, 
  ShieldCheck, 
  Activity, 
  Users, 
  Award, 
  Radio, 
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalStatisticsView: React.FC = () => {
  const departmentStats = [
    { name: 'Radar & Doppler Operations', count: 420, percent: 92, color: 'bg-blue-600' },
    { name: 'Numerical Weather Prediction (NWP)', count: 310, percent: 84, color: 'bg-emerald-600' },
    { name: 'Cyclone Warning Division (RSMC)', count: 280, percent: 96, color: 'bg-amber-500' },
    { name: 'Satellite Meteorology (INSAT-3D/3DS)', count: 250, percent: 88, color: 'bg-purple-600' },
    { name: 'Aviation Meteorological Services', count: 190, percent: 79, color: 'bg-sky-500' },
    { name: 'Agrometeorological Advisory (AAS)', count: 160, percent: 85, color: 'bg-teal-500' }
  ];

  const zoneReadiness = [
    { zone: 'Northern Meteorological Zone (RMC Delhi)', readiness: 94, certified: 380 },
    { zone: 'Eastern & Bay of Bengal Zone (RMC Kolkata)', readiness: 91, certified: 340 },
    { zone: 'Western & Arabian Sea Zone (RMC Mumbai)', readiness: 89, certified: 310 },
    { zone: 'Southern Peninsular Zone (RMC Chennai)', readiness: 95, certified: 410 },
    { zone: 'North-Eastern Terrains Zone (RMC Guwahati)', readiness: 82, certified: 220 },
    { zone: 'Central Inlands Zone (RMC Nagpur)', readiness: 87, certified: 195 },
  ];

  const handleDownloadDossier = () => {
    alert('Generating Official MoES National Meteorological Capacity Dossier (PDF)...\nReady for submission to Ministry of Earth Sciences & Smart India Hackathon Jury.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">National Capacity & Global Statistics</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              MoES Executive Summary
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Aggregated institutional benchmarks, regional compliance indexes, and Doppler radar readiness metrics.
          </p>
        </div>

        <button
          onClick={handleDownloadDossier}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs self-start sm:self-auto"
        >
          <Download size={15} />
          <span>Download Executive Dossier</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Training Hours</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">18,450 hrs</p>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">+14% YoY surge</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Doppler Radars</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">37 Stations</p>
          <span className="text-[11px] text-slate-500 block mt-1">100% staff covered</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certificates Conferred</span>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">3,890</p>
          <span className="text-[11px] text-slate-500 block mt-1">Tamper-evident verification</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Exam Score</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">87.6%</p>
          <span className="text-[11px] text-slate-500 block mt-1">Exceeds 75% MoES benchmark</span>
        </div>
      </div>

      {/* Charts / Visual Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departmental Training Coverage */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-600" />
              <h3 className="font-extrabold text-base text-slate-900">Departmental Competency Coverage</h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Active Cycle</span>
          </div>

          <div className="space-y-4 pt-2">
            {departmentStats.map((dep, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{dep.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{dep.count} Officers</span>
                    <span className="font-bold font-mono text-slate-900">{dep.percent}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dep.color}`}
                    style={{ width: `${dep.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Zone Operational Readiness */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Globe2 size={18} className="text-emerald-600" />
              <h3 className="font-extrabold text-base text-slate-900">Regional Centre Operational Readiness</h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">6 National Zones</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {zoneReadiness.map((zone, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-xs text-slate-900">{zone.zone}</p>
                  <p className="text-[11px] text-slate-500">{zone.certified} certified meteorological scientists</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    {zone.readiness}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

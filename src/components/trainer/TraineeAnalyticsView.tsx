import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  TrendingUp, 
  Users, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Filter, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TraineeAnalyticsView: React.FC = () => {
  const { traineeAnalytics } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCenter, setSelectedCenter] = useState<string>('All');

  const centers = ['All', 'RMC New Delhi', 'RMC Kolkata', 'MC Srinagar', 'MC Thiruvananthapuram', 'CWC Bhubaneswar', 'MC Ahmedabad'];

  const filteredTrainees = traineeAnalytics.filter(t => {
    if (selectedCenter !== 'All' && t.center !== selectedCenter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.center.toLowerCase().includes(q) ||
        t.weakDomain.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['ID,Name,Center,Courses Completed,In Progress,Average Score,Status,Weak Domain\n'];
    const rows = traineeAnalytics.map(t => 
      `${t.id},"${t.name}","${t.center}",${t.coursesCompleted},${t.inProgress},${t.avgScore}%,"${t.status}","${t.weakDomain}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IMD_Trainee_Competency_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Trainee Competency & Batch Analytics</h1>
            <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Pan-India Monitoring
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time performance tracking, average assessment scores, and domain gap indicators for meteorological personnel.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs self-start sm:self-auto"
        >
          <Download size={15} />
          <span>Export Analytics (CSV)</span>
        </button>
      </div>

      {/* Analytics Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Proficiency Center</span>
          <p className="text-xl font-extrabold text-slate-900 mt-1">RMC Kolkata (94% Avg)</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp size={12} />
            +6% improvement this cycle
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Critical Weakness Domain</span>
          <p className="text-xl font-extrabold text-amber-600 mt-1">Radar De-Aliasing & Flood Routing</p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Recommended: Issue refresher module
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Pass Ratio</span>
          <p className="text-xl font-extrabold text-blue-600 mt-1">87.4% Certified</p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across 37 Regional centers
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trainee name, regional centre, or weak domain..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {centers.map((cnt) => (
            <button
              key={cnt}
              onClick={() => setSelectedCenter(cnt)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCenter === cnt
                  ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cnt}
            </button>
          ))}
        </div>
      </div>

      {/* Trainees Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Trainee Officer</th>
                <th className="py-3.5 px-4">Center Station</th>
                <th className="py-3.5 px-4">Courses (Done/Active)</th>
                <th className="py-3.5 px-4">Avg Score</th>
                <th className="py-3.5 px-4">Readiness Status</th>
                <th className="py-3.5 px-4">Weak Domain / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTrainees.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                        <p className="text-[11px] text-slate-400">Last active: {t.lastActive}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-slate-700 font-medium">
                    {t.center}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-600">{t.coursesCompleted}</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-600">{t.inProgress} active</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-extrabold text-sm text-slate-900">{t.avgScore}%</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      t.status === 'Top Performer' || t.status === 'Excellent'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'Needs Support'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {t.status}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    {t.weakDomain === 'None' ? (
                      <span className="text-emerald-600 text-xs flex items-center gap-1">
                        <CheckCircle size={13} />
                        All Benchmarks Met
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                          {t.weakDomain}
                        </span>
                        <button
                          onClick={() => alert(`Assigned refresher module to ${t.name} on ${t.weakDomain}`)}
                          className="text-[10px] font-bold text-blue-600 hover:underline whitespace-nowrap"
                        >
                          Send Module
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

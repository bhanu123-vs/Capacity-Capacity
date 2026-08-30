import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCog, 
  Key, 
  Lock, 
  Check, 
  X, 
  Sparkles, 
  Building, 
  Save, 
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RoleManagementView: React.FC = () => {
  const { allStaffUsers, updateUserRole } = useApp();

  const [permissionsMatrix, setPermissionsMatrix] = useState({
    'Trainee': {
      viewCourses: true,
      takeAssessments: true,
      downloadCerts: true,
      createCourses: false,
      authorAssessments: false,
      viewBatchAnalytics: false,
      approveUsers: false,
      broadcastCirculars: false,
      manageSystem: false,
    },
    'Trainer': {
      viewCourses: true,
      takeAssessments: true,
      downloadCerts: true,
      createCourses: true,
      authorAssessments: true,
      viewBatchAnalytics: true,
      approveUsers: false,
      broadcastCirculars: false,
      manageSystem: false,
    },
    'Admin': {
      viewCourses: true,
      takeAssessments: true,
      downloadCerts: true,
      createCourses: true,
      authorAssessments: true,
      viewBatchAnalytics: true,
      approveUsers: true,
      broadcastCirculars: true,
      manageSystem: true,
    }
  });

  const togglePermission = (role: 'Trainee' | 'Trainer' | 'Admin', permKey: string) => {
    setPermissionsMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permKey]: !(prev[role] as any)[permKey]
      }
    }));
  };

  const permissionLabels = [
    { key: 'viewCourses', label: 'Access Course Catalog & Slide Decks' },
    { key: 'takeAssessments', label: 'Take Timed MCQ Examinations' },
    { key: 'downloadCerts', label: 'Claim & Verify Digital Certificates' },
    { key: 'createCourses', label: 'Author Courses & Upload Curriculum' },
    { key: 'authorAssessments', label: 'Design MCQ Questionnaires' },
    { key: 'viewBatchAnalytics', label: 'Inspect Trainee Analytics & Radar Scores' },
    { key: 'approveUsers', label: 'Approve / Reject Staff Applications' },
    { key: 'broadcastCirculars', label: 'Broadcast Official MoES Bulletins' },
    { key: 'manageSystem', label: 'Full System & DB Administrative Control' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Role-Based Access Control (RBAC) & Privileges</h1>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Security Matrix
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure system permissions across Trainee Officers, Faculty Trainers, and Central Directorate Administrators.
          </p>
        </div>
      </div>

      {/* RBAC Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key size={18} className="text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">Privilege & Authority Matrix</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Live Granular RBAC</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">System Capability</th>
                <th className="py-3 px-4 text-center">Trainee Officer</th>
                <th className="py-3 px-4 text-center">Faculty Trainer</th>
                <th className="py-3 px-4 text-center">Central Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {permissionLabels.map((perm) => (
                <tr key={perm.key} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-800">
                    {perm.label}
                  </td>
                  {(['Trainee', 'Trainer', 'Admin'] as const).map((role) => {
                    const isGranted = (permissionsMatrix[role] as any)[perm.key];
                    return (
                      <td key={role} className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => togglePermission(role, perm.key)}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            isGranted
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {isGranted ? <Check size={14} className="stroke-[3]" /> : <X size={14} />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Directory with Role Switcher */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">National Meteorological Staff Directory</h3>
          </div>
          <span className="text-xs text-slate-500">{allStaffUsers.length} Active Personnel</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allStaffUsers.map((staff) => (
            <div
              key={staff.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{staff.name}</span>
                  <span className="font-mono text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {staff.employeeId}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{staff.email} • {staff.department}</p>
              </div>

              <div>
                <select
                  value={staff.role}
                  onChange={(e) => updateUserRole(staff.id, e.target.value as any)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Trainee">Trainee</option>
                  <option value="Trainer">Trainer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

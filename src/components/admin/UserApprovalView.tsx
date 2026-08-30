import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  FileCheck, 
  ShieldAlert, 
  UserCheck, 
  Building, 
  Mail, 
  Calendar, 
  Filter,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PendingUserApproval } from '../../types';

export const UserApprovalView: React.FC = () => {
  const { pendingApprovals, approveUser, rejectUser } = useApp();
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedUser, setInspectedUser] = useState<PendingUserApproval | null>(null);

  const filteredList = pendingApprovals.filter(user => {
    if (filterStatus !== 'All' && user.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.employeeId.toLowerCase().includes(q) ||
        user.centerLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApprove = (id: string) => {
    approveUser(id);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Please enter rejection reason (e.g. Invalid Employee ID or unverified center affiliation):');
    if (reason) {
      rejectUser(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Officer Verification & RBAC Approval Desk</h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {pendingApprovals.filter(p => p.status === 'Pending').length} Pending Action
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Validate government credentials, verify employee IDs, and grant authorized system roles.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, employee ID, center, or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                filterStatus === status
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status} ({pendingApprovals.filter(p => status === 'All' ? true : p.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 relative"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {req.employeeId}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  req.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : req.status === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {req.status}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                {req.name}
              </h3>

              <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Requested Role:</span>
                  <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded">
                    {req.appliedRole}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Building size={13} className="text-slate-400" />
                  <span>{req.department}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Station:</span>
                  <span className="text-slate-800 font-semibold">{req.centerLocation}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar size={13} className="text-slate-400" />
                  <span>Applied: {req.appliedDate}</span>
                </p>
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">ID Proof:</span> {req.idProofDoc}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setInspectedUser(req)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Inspect Application Details"
              >
                <Eye size={15} />
              </button>

              {req.status === 'Pending' ? (
                <>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="flex-1 py-2 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <XCircle size={14} />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve</span>
                  </button>
                </>
              ) : (
                <div className="flex-1 text-center py-2 text-xs font-semibold text-slate-400 bg-slate-50 rounded-xl">
                  Application Finalized ({req.status})
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Details Inspection Modal */}
      {inspectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {inspectedUser.employeeId}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{inspectedUser.name}</h3>
              </div>
              <button
                onClick={() => setInspectedUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p><strong className="text-slate-900">Official Email:</strong> {inspectedUser.email}</p>
                <p><strong className="text-slate-900">Applied Role:</strong> {inspectedUser.appliedRole}</p>
                <p><strong className="text-slate-900">Department:</strong> {inspectedUser.department}</p>
                <p><strong className="text-slate-900">Regional Station:</strong> {inspectedUser.centerLocation}</p>
                <p><strong className="text-slate-900">Submission Timestamp:</strong> {inspectedUser.appliedDate}</p>
                <p><strong className="text-slate-900">Verification Document:</strong> {inspectedUser.idProofDoc}</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-900">
                <p className="font-bold flex items-center gap-1 mb-1">
                  <UserCheck size={14} />
                  <span>MoES Government Verification Checklist</span>
                </p>
                <ul className="space-y-1 list-disc pl-4 text-[11px]">
                  <li>NIC / Gov.in domain verified</li>
                  <li>Mausam Bhavan staff ledger checked</li>
                  <li>Authorized for Doppler Radar & NWP Model ingestion</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setInspectedUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              {inspectedUser.status === 'Pending' && (
                <button
                  onClick={() => {
                    handleApprove(inspectedUser.id);
                    setInspectedUser(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  Approve Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Bell, X, Check, ExternalLink, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotificationDrawerOpen, 
    setIsNotificationDrawerOpen, 
    announcements, 
    markAnnouncementAsRead,
    role
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  const filteredAnnouncements = announcements.filter(
    a => a.targetRole === 'All' || a.targetRole === role
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Bulletins & Advisories</h3>
              <p className="text-xs text-slate-500">Official MoES & IMD Notifications</p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No new circulars or notices for your role.
            </div>
          ) : (
            filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className={`p-4 rounded-2xl border transition-all ${
                  ann.isRead 
                    ? 'bg-slate-50 border-slate-200 text-slate-600' 
                    : 'bg-white border-blue-200 shadow-2xs text-slate-900 ring-1 ring-blue-500/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ann.priority === 'Urgent' 
                      ? 'bg-red-100 text-red-700' 
                      : ann.priority === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {ann.priority} Priority
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
                </div>

                <h4 className="font-bold text-xs mb-1">{ann.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">{ann.content}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-[10px]">
                  <span className="text-slate-400 font-medium">By: {ann.author}</span>
                  {!ann.isRead && (
                    <button
                      onClick={() => markAnnouncementAsRead(ann.id)}
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                    >
                      <Check size={12} /> Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

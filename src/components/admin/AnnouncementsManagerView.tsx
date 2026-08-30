import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Filter, 
  Megaphone, 
  Calendar, 
  Users,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';

export const AnnouncementsManagerView: React.FC = () => {
  const { announcements, createAnnouncement, deleteAnnouncement, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Announcement['priority']>('High');
  const [targetRole, setTargetRole] = useState<Announcement['targetRole']>('all');
  const [department, setDepartment] = useState('Central Directorate');
  const [broadcastDone, setBroadcastDone] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please provide announcement title and content.');
      return;
    }

    createAnnouncement({
      title,
      content,
      priority,
      targetRole,
      department,
      author: currentUser.name
    });

    setTitle('');
    setContent('');
    setBroadcastDone(true);
    setTimeout(() => setBroadcastDone(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">National Advisory & Circulars Dispatcher</h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {announcements.length} Active Circulars
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish high-priority operational directives, mandatory pre-cyclone training schedules, and system alerts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Broadcast Form */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Megaphone size={18} className="text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">Publish New Circular</h3>
          </div>

          {broadcastDone && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle size={15} />
              <span>Circular broadcasted nationwide!</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Circular Subject *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mandatory Pre-Monsoon Radar Calibration"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="Urgent">Urgent (Red)</option>
                  <option value="High">High (Amber)</option>
                  <option value="Normal">Normal (Blue)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Target Audience
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="all">All Personnel</option>
                  <option value="Trainee">Trainees Only</option>
                  <option value="Trainer">Faculty / Trainers</option>
                  <option value="Admin">Admins Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Issuing Directorate / Wing
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Directives & Message Body *
              </label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Details of the operational mandate..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Send size={14} />
              <span>Broadcast Nationwide</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Live Feed of Broadcasts */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900">Active Official Circulars Feed</h3>
            <span className="text-xs text-slate-400 font-semibold">{announcements.length} Published</span>
          </div>

          <div className="space-y-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        item.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : item.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Target: {item.targetRole === 'all' ? 'All Roles' : item.targetRole}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.date}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 pt-1">
                      {item.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => deleteAnnouncement(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Circular"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  {item.content}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Author: <strong className="text-slate-600">{item.author}</strong> ({item.department})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

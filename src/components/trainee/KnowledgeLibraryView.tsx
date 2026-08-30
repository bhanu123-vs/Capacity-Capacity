import React, { useState } from 'react';
import { 
  Search, 
  BookMarked, 
  Download, 
  FileText, 
  Tag, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  Filter,
  Layers,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KnowledgeDocument } from '../../types';

export const KnowledgeLibraryView: React.FC = () => {
  const { documents, openDocumentPreview } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocModal, setActiveDocModal] = useState<KnowledgeDocument | null>(null);

  const categories = ['All', 'Cyclone SOPs', 'Radar & Doppler', 'Satellite Datasets', 'MoES Guidelines', 'Weather Forecasting'];

  const filteredDocs = documents.filter(doc => {
    if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">MoES Knowledge & Research Repository</h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {documents.length} Authoritative Resources
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official operational Standard Operating Procedures (SOPs), satellite RGB product guides, radar technical manuals, and climate atlases.
          </p>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title, SOP keyword, or tag (e.g. Cyclone, INSAT-3DS)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {doc.fileType}
                </span>
                <span className="text-slate-400 font-medium text-[11px]">
                  {doc.fileSize} • {doc.downloadsCount} downloads
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 leading-snug">
                {doc.title}
              </h3>

              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {doc.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {doc.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setActiveDocModal(doc)}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye size={14} />
                <span>Read Document</span>
              </button>
              <button
                onClick={() => alert(`Downloading official document: ${doc.title}`)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Download Resource"
              >
                <Download size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Reader Modal */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                  {activeDocModal.category} • {activeDocModal.fileType}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  {activeDocModal.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Published by {activeDocModal.author} ({activeDocModal.department}) • {activeDocModal.uploadDate}
                </p>
              </div>
              <button
                onClick={() => setActiveDocModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Key Highlights */}
            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-2">
              <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-600" />
                Operational Key Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeDocModal.keyHighlights.map((hl, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Document Content */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
                Full Executive Content & Protocol
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
                <p>{activeDocModal.description}</p>
                <p>{activeDocModal.contentSummary}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-mono">
                Official MoES Document • {activeDocModal.fileSize}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveDocModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert(`Official file "${activeDocModal.title}" is saved.`);
                    setActiveDocModal(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5"
                >
                  <Download size={14} />
                  <span>Download Full PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

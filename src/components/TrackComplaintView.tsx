import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  AlertTriangle,
  ArrowRight,
  FileText
} from 'lucide-react';
import { Complaint } from '../types/complaint';

interface TrackComplaintViewProps {
  complaints: Complaint[];
  initialSearchId?: string;
  onNotify?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const TrackComplaintView: React.FC<TrackComplaintViewProps> = ({
  complaints,
  initialSearchId = '',
  onNotify
}) => {
  const [searchId, setSearchId] = useState(initialSearchId);
  const [searchedId, setSearchedId] = useState(initialSearchId);

  const foundComplaint = searchedId.trim()
    ? complaints.find(c => c.id.toUpperCase() === searchedId.trim().toUpperCase())
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchId.trim().toUpperCase();
    if (!clean) {
      onNotify?.('error', 'Search Input Empty', 'Please enter a valid complaint reference ID (e.g. VX-2026-1001).');
      return;
    }
    setSearchedId(clean);
    const item = complaints.find(c => c.id.toUpperCase() === clean);
    if (item) {
      onNotify?.('success', 'Ticket Found', `Loaded latest status: ${item.status}`);
    } else {
      onNotify?.('error', 'Ticket Not Found', `No complaint registered with ID "${clean}".`);
    }
  };

  const handleQuickSelect = (id: string) => {
    setSearchId(id);
    setSearchedId(id);
    const item = complaints.find(c => c.id.toUpperCase() === id.toUpperCase());
    if (item) {
      onNotify?.('info', 'Loaded Sample Ticket', `${item.id}: ${item.title}`);
    }
  };

  // Determine stage (1 to 4)
  const getStage = (complaint: Complaint) => {
    if (complaint.status === 'Resolved') return 4;
    if (complaint.status === 'In Progress') return 3;
    return 2; // Pending = Stage 2 (Submitted & Categorized)
  };

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          <Search className="w-3.5 h-3.5" />
          Sri Venkateswara College Grievance Tracker
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Complaint
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Enter your unique reference ID to verify real-time routing, active technician updates, and resolution status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
          <div className="relative flex-1 flex items-center pl-3">
            <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Complaint ID (e.g. VX-2026-1001)..."
              className="w-full text-sm font-mono tracking-wide focus:outline-none uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Quick Select Preset IDs for immediate testability */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-slate-500">Try quick sample IDs from campus:</span>
        <div className="flex flex-wrap gap-2">
          {complaints.slice(0, 5).map(c => (
            <button
              key={c.id}
              onClick={() => handleQuickSelect(c.id)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                searchedId.toUpperCase() === c.id.toUpperCase()
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.id} ({c.status})
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {searchedId && !foundComplaint && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Ticket Found with ID &quot;{searchedId}&quot;
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Please double-check the ID format (e.g., <span className="font-mono font-medium">VX-2026-1001</span>). You can also click any of the sample tickets above or lodge a new complaint.
          </p>
        </div>
      )}

      {foundComplaint && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-mono text-indigo-700">
                  {foundComplaint.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  foundComplaint.priority === 'High' ? 'bg-rose-100 text-rose-800' :
                  foundComplaint.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {foundComplaint.priority} Priority
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {foundComplaint.title}
              </h2>
            </div>

            <div className="text-right sm:text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                foundComplaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                foundComplaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {foundComplaint.status === 'Resolved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {foundComplaint.status === 'In Progress' && <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" />}
                {foundComplaint.status === 'Pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                {foundComplaint.status}
              </span>
              <div className="text-[11px] text-slate-400 mt-1">
                Last updated {new Date(foundComplaint.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* 4-Stage Visual Lifecycle Stepper */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Resolution Lifecycle
            </h3>
            {(() => {
              const stage = getStage(foundComplaint);
              return (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                    stage >= 1 ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="font-bold flex items-center justify-between">
                      <span>1. Submitted</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-[11px] text-slate-500">Logged in portal</p>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                    stage >= 2 ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="font-bold flex items-center justify-between">
                      <span>2. AI Categorized</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-[11px] text-slate-500">Assigned: {foundComplaint.category}</p>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                    stage >= 3 ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="font-bold flex items-center justify-between">
                      <span>3. In Progress</span>
                      {stage >= 3 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">Cell staff acting</p>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                    stage >= 4 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="font-bold flex items-center justify-between">
                      <span>4. Resolved</span>
                      {stage >= 4 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">Case closed</p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Detailed Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Responsible Department</span>
              <div className="text-sm font-bold text-slate-900">
                {foundComplaint.department}
              </div>
              <div className="text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Location: {foundComplaint.location || 'SVCE Campus'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Submitter Details</span>
              <div className="text-sm font-semibold text-slate-900">
                {foundComplaint.name} ({foundComplaint.role})
              </div>
              <div className="text-slate-500">
                Logged on: {new Date(foundComplaint.createdAt).toLocaleDateString()} at {new Date(foundComplaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Original Complaint Narrative
            </span>
            <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
              {foundComplaint.description}
            </p>
          </div>

          {/* Resolution Notes / Technician Remarks */}
          {foundComplaint.resolutionNotes && (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1 text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Department Resolution &amp; Action Notes
              </span>
              <p className="text-emerald-800 leading-relaxed">
                {foundComplaint.resolutionNotes}
              </p>
            </div>
          )}

          {/* Similar Complaint Notice if Flagged */}
          {foundComplaint.possibleDuplicateOf && foundComplaint.possibleDuplicateOf.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Linked to Existing Complaint Group
              </div>
              <p className="text-amber-800 text-[11px]">
                Similar issues were reported in this facility ({foundComplaint.possibleDuplicateOf.join(', ')}). The estate department is consolidating technicians to resolve all related rooms at once.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

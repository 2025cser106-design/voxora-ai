import React, { useState, useMemo } from 'react';
import { 
  Complaint, 
  ComplaintStatus, 
  Category, 
  Priority 
} from '../types/complaint';
import { dbService } from '../services/db';
import { 
  Search, 
  Filter, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  RefreshCcw, 
  ChevronRight, 
  X, 
  Eye, 
  Copy, 
  FileText, 
  Building2, 
  User, 
  Mail, 
  MapPin, 
  Sparkles,
  BarChart2,
  Calendar,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface AdminDashboardViewProps {
  complaints: Complaint[];
  onRefresh: () => void;
  onNotify?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  complaints,
  onRefresh,
  onNotify
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState<boolean>(false);

  // Selected complaint for drawer/modal
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Stats calculation
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const highPriorityCount = complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved').length;

  // Category counts for Chart
  const categoriesList: Category[] = [
    'Wi-Fi',
    'Laboratory',
    'Classroom',
    'Sanitation',
    'Hostel',
    'Transport',
    'Maintenance',
    'Other'
  ];

  const categoryDistribution = useMemo(() => {
    return categoriesList.map(cat => {
      const count = complaints.filter(c => c.category === cat).length;
      const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      return { category: cat, count, percentage };
    });
  }, [complaints, totalCount]);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter(item => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchText = (
          item.id + ' ' +
          item.title + ' ' +
          item.name + ' ' +
          item.email + ' ' +
          (item.location || '') + ' ' +
          item.department
        ).toLowerCase();
        if (!matchText.includes(q)) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      // Duplicates toggle
      if (showDuplicatesOnly && (!item.possibleDuplicateOf || item.possibleDuplicateOf.length === 0)) {
        return false;
      }

      return true;
    });
  }, [complaints, searchQuery, selectedCategory, selectedPriority, selectedStatus, showDuplicatesOnly]);

  // Handle live status change from row dropdown or detail view
  const handleStatusChange = async (id: string, newStatus: ComplaintStatus, notes?: string) => {
    setIsUpdatingStatus(true);
    try {
      await dbService.updateComplaintStatus(id, newStatus, notes);
      onRefresh();
      if (activeComplaint && activeComplaint.id === id) {
        setActiveComplaint({
          ...activeComplaint,
          status: newStatus,
          resolutionNotes: notes !== undefined ? notes : activeComplaint.resolutionNotes,
          updatedAt: new Date().toISOString()
        });
      }
      onNotify?.('success', 'Status Updated', `Ticket ${id} marked as ${newStatus}.`);
    } catch (err) {
      console.error('Failed to update complaint status:', err);
      onNotify?.('error', 'Update Failed', 'Could not update complaint status in storage.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleOpenDetail = (c: Complaint) => {
    setActiveComplaint(c);
    setEditNotes(c.resolutionNotes || '');
  };

  const resetAllData = () => {
    if (confirm('Reset complaints to Sri Venkateswara College default prototype records?')) {
      dbService.resetToSampleData();
      onRefresh();
      setActiveComplaint(null);
      onNotify?.('info', 'Data Reset', 'Restored initial SVCE Tirupati prototype complaints.');
    }
  };

  return (
    <div className="space-y-8 py-8 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Administrative Control Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Grievance Management Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Real-time complaint tracking, auto-department dispatch, and duplicate triage for SVCE Tirupati.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 text-xs font-medium shadow-xs hover:bg-slate-50 transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
          <button
            onClick={resetAllData}
            title="Reset to default SVCE prototype complaints"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Prototype Data</span>
          </button>
        </div>
      </div>

      {/* 5 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="text-xs font-medium text-slate-500">Total Registered</div>
          <div className="text-3xl font-black text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-500">All campus tickets</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/90 bg-amber-50/20 shadow-xs space-y-2">
          <div className="text-xs font-medium text-amber-700 flex items-center justify-between">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
          <div className="text-[11px] text-amber-700/80">Requires cell action</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200/90 bg-blue-50/20 shadow-xs space-y-2">
          <div className="text-xs font-medium text-blue-700 flex items-center justify-between">
            <span>In Progress</span>
            <RefreshCcw className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-blue-600">{inProgressCount}</div>
          <div className="text-[11px] text-blue-700/80">Technician assigned</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/90 bg-emerald-50/20 shadow-xs space-y-2">
          <div className="text-xs font-medium text-emerald-700 flex items-center justify-between">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{resolvedCount}</div>
          <div className="text-[11px] text-emerald-700/80">Closed issues</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200/90 bg-rose-50/30 shadow-xs space-y-2 col-span-2 sm:col-span-1">
          <div className="text-xs font-medium text-rose-700 flex items-center justify-between">
            <span>High Priority</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600">{highPriorityCount}</div>
          <div className="text-[11px] text-rose-700/80">Immediate safety/ops</div>
        </div>
      </div>

      {/* Category Breakdown Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Complaints Volume by College Category
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {totalCount} total cases analyzed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {categoryDistribution.map(({ category, count, percentage }) => (
            <div key={category} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{category}</span>
                <span className="font-mono text-slate-500">{count} ({percentage}%)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    category === 'Wi-Fi' ? 'bg-indigo-600' :
                    category === 'Maintenance' ? 'bg-rose-500' :
                    category === 'Sanitation' ? 'bg-cyan-500' :
                    category === 'Hostel' ? 'bg-amber-500' :
                    category === 'Transport' ? 'bg-emerald-500' :
                    category === 'Laboratory' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.max(percentage, 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID (e.g. VX-2026-1001), keywords, submitter name, location..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categoriesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Priority */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Duplicate Filter Toggle */}
            <button
              onClick={() => setShowDuplicatesOnly(!showDuplicatesOnly)}
              className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 ${
                showDuplicatesOnly 
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Flagged Duplicates</span>
            </button>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(selectedCategory !== 'all' || selectedPriority !== 'all' || selectedStatus !== 'all' || searchQuery || showDuplicatesOnly) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Filtering:</span>
            {selectedCategory !== 'all' && <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Category: {selectedCategory}</span>}
            {selectedPriority !== 'all' && <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Priority: {selectedPriority}</span>}
            {selectedStatus !== 'all' && <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Status: {selectedStatus}</span>}
            {showDuplicatesOnly && <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded">Duplicates Only</span>}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedPriority('all');
                setSelectedStatus('all');
                setShowDuplicatesOnly(false);
              }}
              className="text-indigo-600 hover:underline ml-auto font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="lg:hidden px-4 py-2 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>← Swipe horizontally to view status &amp; actions →</span>
          <span className="font-semibold text-indigo-600">{filteredComplaints.length} tickets</span>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Title &amp; Submitter</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Status &amp; Action</th>
                <th className="py-3.5 px-4">Logged</th>
                <th className="py-3.5 px-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 space-y-2">
                    <p className="text-sm font-medium">No complaints match your active filters.</p>
                    <p className="text-xs text-slate-400">Try adjusting your search query or reset filters.</p>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((item) => {
                  const isHigh = item.priority === 'High';
                  const isMed = item.priority === 'Medium';
                  const isResolved = item.status === 'Resolved';
                  const hasDuplicates = item.possibleDuplicateOf && item.possibleDuplicateOf.length > 0;

                  return (
                    <tr 
                      key={item.id}
                      className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDetail(item)}
                    >
                      {/* Ticket ID & Duplicate Flag */}
                      <td className="py-3.5 px-4 align-top font-mono font-bold text-indigo-700 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <span>{item.id}</span>
                          {hasDuplicates && (
                            <span 
                              title={`Flagged as possible duplicate of ${item.possibleDuplicateOf.join(', ')}`}
                              className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-sans font-medium"
                            >
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Duplicate Flag
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Title & Submitter */}
                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{item.name} ({item.role})</span>
                          <span>·</span>
                          <span className="truncate">{item.location || 'Campus'}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className="font-medium text-slate-800">
                          {item.category}
                        </span>
                      </td>

                      {/* Priority Badge: High = red, Medium = orange/amber, Low = green */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            isHigh ? 'bg-rose-500' :
                            isMed ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <span className={`font-semibold ${
                            isHigh ? 'text-rose-600' :
                            isMed ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 align-top max-w-[160px]">
                        <span className="text-slate-600 line-clamp-1 text-[11px]" title={item.department}>
                          {item.department}
                        </span>
                      </td>

                      {/* Status Dropdown - Immediate update to Firestore / localStorage */}
                      <td 
                        className="py-3.5 px-4 align-top whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={item.status}
                          disabled={isUpdatingStatus}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as ComplaintStatus)}
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                            item.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : item.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 align-top text-slate-500 whitespace-nowrap text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      {/* View Action */}
                      <td className="py-3.5 px-4 align-top text-center">
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View Full Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredComplaints.length} of {totalCount} total grievances</span>
          <span className="text-[11px]">Click any row for full ticket history and duplicate match analysis.</span>
        </div>
      </div>

      {/* Complaint Detail Modal / Drawer */}
      {activeComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-indigo-700 text-sm">
                  {activeComplaint.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  activeComplaint.priority === 'High' ? 'bg-rose-100 text-rose-800' :
                  activeComplaint.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {activeComplaint.priority} Priority
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  activeComplaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                  activeComplaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {activeComplaint.status}
                </span>
              </div>
              <button
                onClick={() => setActiveComplaint(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Title & Submitter Info */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {activeComplaint.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {activeComplaint.name} ({activeComplaint.role})
                  </span>
                  <span>·</span>
                  <a 
                    href={`mailto:${activeComplaint.email}`}
                    className="flex items-center gap-1 text-indigo-600 hover:underline"
                    title={`Email ${activeComplaint.name}`}
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{activeComplaint.email}</span>
                  </a>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {activeComplaint.location || 'SVCE Campus'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Detailed Complaint Description
                </span>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line text-sm">
                  {activeComplaint.description}
                </p>
              </div>

              {/* Routing & Assignment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-xs text-slate-500 block">Classified Category</span>
                  <div className="text-sm font-bold text-indigo-700 mt-1">
                    {activeComplaint.category}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-xs text-slate-500 block">Assigned College Department</span>
                  <div className="text-sm font-bold text-slate-800 mt-1">
                    {activeComplaint.department}
                  </div>
                </div>
              </div>

              {/* Possible Duplicates Warning Box */}
              {activeComplaint.possibleDuplicateOf && activeComplaint.possibleDuplicateOf.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Jaccard Lexical Similarity: Flagged as Possible Duplicate</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    This ticket shares keywords or locations with existing active complaint(s):
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeComplaint.possibleDuplicateOf.map((matchId) => {
                      const matchedItem = complaints.find(c => c.id === matchId);
                      return (
                        <div key={matchId} className="bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-800">
                          <span className="font-mono font-bold text-indigo-700">{matchId}</span>
                          {matchedItem && (
                            <span className="text-slate-600 block text-[11px] truncate max-w-xs">
                              {matchedItem.title}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-amber-700 italic">
                    Note: Never auto-rejected. Administrators can merge resolution updates across linked tickets.
                  </p>
                </div>
              )}

              {/* Status Update & Resolution Notes */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                  Update Resolution Notes &amp; Status
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Electrician dispatched; replaced faulty circuit breaker in Block 2."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Change Status:</span>
                    {(['Pending', 'In Progress', 'Resolved'] as ComplaintStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(activeComplaint.id, st, editNotes)}
                        disabled={isUpdatingStatus}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          activeComplaint.status === st
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleStatusChange(activeComplaint.id, activeComplaint.status, editNotes)}
                    disabled={isUpdatingStatus}
                    className="px-4 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
              <span>Logged: {new Date(activeComplaint.createdAt).toLocaleString()}</span>
              <button
                onClick={() => setActiveComplaint(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

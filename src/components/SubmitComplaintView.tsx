import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  ArrowRight, 
  RefreshCw, 
  Building2, 
  User, 
  Mail, 
  MapPin, 
  FileText,
  Clock,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Complaint, Role, Category, Priority } from '../types/complaint';
import { processComplaint } from '../logic/processor';
import { dbService } from '../services/db';

interface SubmitComplaintViewProps {
  complaints: Complaint[];
  onComplaintSubmitted: (newComplaint: Complaint) => void;
  onTrackComplaint: (id: string) => void;
}

export const SubmitComplaintView: React.FC<SubmitComplaintViewProps> = ({
  complaints,
  onComplaintSubmitted,
  onTrackComplaint
}) => {
  // Form fields
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('Student');
  const [email, setEmail] = useState('');
  const [departmentYear, setDepartmentYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Live pre-flight analysis preview as user types
  const liveAnalysis = (title.trim().length > 3 || description.trim().length > 5)
    ? processComplaint(title, description, location, complaints)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please provide a valid college or personal email address.');
      return;
    }
    if (!title.trim() || title.length < 5) {
      setValidationError('Please enter a descriptive complaint title (minimum 5 characters).');
      return;
    }
    if (!description.trim() || description.length < 15) {
      setValidationError('Please provide clear details in the description (minimum 15 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Run AI categorization, prioritization and duplicate detection
      const analysis = processComplaint(title, description, location, complaints);

      // Generate unique ID: VX-2026-XXXX
      const randomFourDigits = Math.floor(1000 + Math.random() * 9000);
      const uniqueId = `VX-2026-${randomFourDigits}`;

      const newComplaint: Complaint = {
        id: uniqueId,
        name: name.trim(),
        role,
        email: email.trim(),
        departmentYear: departmentYear.trim() || (role === 'Student' ? 'General' : 'Faculty Member'),
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || 'SVCE Campus',
        category: analysis.category,
        priority: analysis.priority,
        department: analysis.department,
        status: 'Pending',
        possibleDuplicateOf: analysis.possibleDuplicates.map(d => d.id),
        similarityScore: analysis.possibleDuplicates.length > 0 ? analysis.possibleDuplicates[0].similarity : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to Database (Firestore + localStorage mirror)
      await dbService.addComplaint(newComplaint);
      onComplaintSubmitted(newComplaint);
      setSubmittedComplaint(newComplaint);
    } catch (err) {
      console.error(err);
      setValidationError('An error occurred while logging the complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setDepartmentYear('');
    setTitle('');
    setDescription('');
    setLocation('');
    setSubmittedComplaint(null);
    setValidationError('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // If submitted, show the confirmation card
  if (submittedComplaint) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
          {/* Header */}
          <div className="text-center space-y-3 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Complaint Successfully Registered
            </h2>
            <p className="text-sm text-slate-500">
              Voxora AI has processed and routed your grievance for Sri Venkateswara College of Engineering.
            </p>
          </div>

          {/* Unique ID Highlight */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Unique Tracking Reference ID
              </span>
              <div className="text-3xl font-black font-mono text-indigo-700 tracking-tight mt-1">
                {submittedComplaint.id}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Save this ID to monitor live progress and updates anytime.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(submittedComplaint.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 font-medium text-xs shadow-xs transition-all active:scale-95"
            >
              {copiedId ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* AI Decision Card Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-xs text-slate-500 block">Classified Category</span>
              <span className="text-lg font-bold text-indigo-700 mt-1 block">
                {submittedComplaint.category}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Auto-detected keywords</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-xs text-slate-500 block">Priority Level</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-3 h-3 rounded-full ${
                  submittedComplaint.priority === 'High' ? 'bg-rose-500' :
                  submittedComplaint.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <span className={`text-lg font-bold ${
                  submittedComplaint.priority === 'High' ? 'text-rose-600' :
                  submittedComplaint.priority === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {submittedComplaint.priority} Priority
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">Automated triage rank</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-xs text-slate-500 block">Assigned Department</span>
              <span className="text-sm font-bold text-slate-800 mt-1 block line-clamp-2">
                {submittedComplaint.department}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Direct escalation queue</span>
            </div>
          </div>

          {/* Similar Complaint / Duplicate Warning Flag if any */}
          {submittedComplaint.possibleDuplicateOf && submittedComplaint.possibleDuplicateOf.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notice: Similar Active Complaint Already on File</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Our Jaccard similarity engine found matching grievance report(s) (
                {submittedComplaint.possibleDuplicateOf.map((matchId, i) => (
                  <span key={matchId} className="font-mono font-bold text-amber-950">
                    {i > 0 ? ', ' : ''}{matchId}
                  </span>
                ))}
                ). Your complaint has still been safely logged and tagged for the administrator to link or resolve together.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={resetForm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Submit Another Grievance</span>
            </button>

            <button
              onClick={() => onTrackComplaint(submittedComplaint.id)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
            >
              <span>Track Resolution Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      {/* Title & Guidelines */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          Sri Venkateswara College of Engineering
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Lodge a Campus Complaint
        </h1>
        <p className="text-slate-600 text-sm">
          Please provide accurate details. Voxora AI will scan keywords to classify category, calculate urgency, and dispatch directly to the college cell.
        </p>
      </div>

      {validationError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kagathi Kiranmayee"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Campus Role <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-xl bg-slate-100 p-1">
                {(['Student', 'Faculty', 'Staff'] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      role === r
                        ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@svce.edu.in"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Department / Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Department / Year (Optional)
              </label>
              <input
                type="text"
                value={departmentYear}
                onChange={(e) => setDepartmentYear(e.target.value)}
                placeholder="e.g. CSE - 3rd Year or ECE Dept"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Complaint Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Complaint Title / Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Wi-Fi network not connecting in CSE Block 2 3rd floor"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Campus Location (Optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Block 2, Room 304, Godavari Hostel, or Bus Route 14"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, equipment involved, frequency, and whether there is any safety hazard..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <p className="text-[11px] text-slate-500">
              Tip: Use descriptive terms (e.g., &quot;sparking&quot;, &quot;leaking&quot;, &quot;projector&quot;, &quot;bus delayed&quot;) to trigger automatic urgent priority routing.
            </p>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing with Voxora AI...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Grievance to College Cell</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live AI Pre-Flight Classifier Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live AI Pre-Flight Classifier
              </h3>
            </div>

            {liveAnalysis ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-500 block">Identified Category:</span>
                  <div className="font-bold text-sm text-indigo-700 mt-0.5">
                    {liveAnalysis.category}
                  </div>
                  {liveAnalysis.detectedKeywords.length > 0 && (
                    <div className="text-[11px] text-slate-500 mt-1">
                      Matched: <span className="font-medium text-slate-700">{liveAnalysis.detectedKeywords.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block">Priority Recommendation:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      liveAnalysis.priority === 'High' ? 'bg-rose-500' :
                      liveAnalysis.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <span className={`font-bold text-sm ${
                      liveAnalysis.priority === 'High' ? 'text-rose-600' :
                      liveAnalysis.priority === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {liveAnalysis.priority} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {liveAnalysis.priorityReason}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block">Destination Cell:</span>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {liveAnalysis.department}
                  </div>
                </div>

                {liveAnalysis.possibleDuplicates.length > 0 && (
                  <div className="pt-2 border-t border-amber-200/70 bg-amber-50/60 p-2.5 rounded-lg text-amber-900">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Possible Duplicate Found</span>
                    </div>
                    <div className="text-[11px] mt-1 text-amber-800">
                      Matches <span className="font-mono font-bold">{liveAnalysis.possibleDuplicates[0].id}</span> ({liveAnalysis.possibleDuplicates[0].similarity}% lexical similarity).
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-500 space-y-2 py-4 text-center">
                <Info className="w-6 h-6 text-slate-400 mx-auto" />
                <p>Type your complaint title and details to see live categorization and priority estimation.</p>
              </div>
            )}
          </div>

          {/* Student Policy Note */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 text-xs text-slate-500 space-y-1.5">
            <div className="font-semibold text-slate-700">Sri Venkateswara College Grievance SLA</div>
            <p className="leading-relaxed">
              • High Priority (Safety/Hazards): Handled within 4 to 12 hours.<br />
              • Medium Priority: Resolved within 24 to 48 hours.<br />
              • Low Priority: Addressed in regular maintenance cycles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

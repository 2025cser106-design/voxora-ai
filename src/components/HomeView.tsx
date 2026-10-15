import React, { useState } from 'react';
import { 
  Send, 
  LayoutDashboard, 
  Sparkles, 
  ShieldAlert, 
  CopyCheck, 
  Activity, 
  ArrowRight, 
  Wifi, 
  FlaskConical, 
  GraduationCap, 
  Droplet, 
  Home as HomeIcon, 
  Bus, 
  Wrench,
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { processComplaint } from '../logic/processor';
import { Complaint } from '../types/complaint';

interface HomeViewProps {
  onNavigate: (tab: 'submit' | 'dashboard' | 'track' | 'about') => void;
  complaints: Complaint[];
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, complaints }) => {
  // Live demo interactive state
  const [demoText, setDemoText] = useState('Exposed live electrical switch sparking near Physics Lab 2');
  const demoResult = processComplaint('Demo', demoText, 'Lab Block', complaints);

  const samplePrompts = [
    'Wi-Fi not working on 3rd floor CSE block since morning',
    'Fire hazard! Sparking wire and smoke in chemical storage room',
    'College bus route 14 delayed by 40 minutes at Chandragiri',
    'Drinking water cooler leaking and washroom taps dry in hostel wing B'
  ];

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const pending = complaints.filter(c => c.status === 'Pending').length;

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-8 sm:p-14 shadow-2xl border border-indigo-900/50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Sri Venkateswara College of Engineering, Tirupati
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            VOXORA AI
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-2">
              Your Voice, Our Priority.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Campus grievances regarding Wi-Fi downtime, classroom equipment, laboratory instruments, sanitation, hostel facilities, college buses, and electrical maintenance shouldn't get lost in manual paper registers. Voxora AI automatically categorizes, prioritizes, and routes complaints to the exact college department in seconds.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('submit')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit a Complaint</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-300" />
              <span>Admin Dashboard</span>
            </button>
          </div>

          {/* Quick Real-Time Metrics */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-2xl font-bold text-white">{total}</div>
              <div className="text-slate-400">Total Grievances</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{pending}</div>
              <div className="text-slate-400">Pending Review</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{inProgress}</div>
              <div className="text-slate-400">Under Action</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{resolved}</div>
              <div className="text-slate-400">Resolved Cases</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Features Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How Voxora AI Streamlines Campus Grievances
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Engineered specifically for SVCE Tirupati to replace disorganized complaint registers with automated, transparent workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Smart Complaint Classification
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automatically scans keywords across Wi-Fi, Labs, Classrooms, Sanitation, Hostels, Transport, and Maintenance to instantly route the ticket to the responsible department cell.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-indigo-600 flex items-center gap-1">
              <span>Zero manual sorting delay</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Priority Recommendation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Identifies urgent emergency triggers (exposed live wires, fire, water leaks, severe health hazards) to flag <span className="font-semibold text-rose-600">High Priority</span> for instant resolution before standard tickets.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-rose-600 flex items-center gap-1">
              <span>Safety first protocol</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <CopyCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Similar Complaint Warning
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Applies Jaccard lexical similarity analysis against existing tickets. Detects duplicate reports from multiple students for the same issue without rejecting any submission.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-amber-600 flex items-center gap-1">
              <span>Prevents duplicate work</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Complaint Tracking Dashboard
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students receive a unique reference ID (e.g. <span className="font-mono text-xs font-medium text-slate-800">VX-2026-1001</span>) to monitor real-time department assignment, technician updates, and resolution status.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span>End-to-end transparency</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Rule-Based Sorter Tester */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Interactive Test Bench
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Test Voxora AI Classification in Real-Time
            </h3>
            <p className="text-sm text-slate-600">
              Type any campus issue or pick a scenario below to watch the NLP rule engine prioritize and route in real time.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 font-mono">
            Modular processor.js
          </span>
        </div>

        {/* Quick chip presets */}
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setDemoText(prompt)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-left"
            >
              &quot;{prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt}&quot;
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">Enter sample complaint description:</label>
          <input
            type="text"
            value={demoText}
            onChange={(e) => setDemoText(e.target.value)}
            placeholder="e.g., Water leakage in girls hostel washroom or projector not working..."
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Live Analysis Output */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 uppercase tracking-wide block">Detected Category</span>
            <div className="text-base font-bold text-indigo-700 mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              {demoResult.category}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Keywords: {demoResult.detectedKeywords.join(', ') || 'General classification'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 uppercase tracking-wide block">Recommended Priority</span>
            <div className="text-base font-bold mt-1 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                demoResult.priority === 'High' ? 'bg-rose-500' :
                demoResult.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              <span className={
                demoResult.priority === 'High' ? 'text-rose-600' :
                demoResult.priority === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
              }>
                {demoResult.priority} Priority
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {demoResult.priorityReason}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 uppercase tracking-wide block">Responsible Department</span>
            <div className="text-base font-bold text-slate-800 mt-1">
              {demoResult.department}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Automatic campus dispatch routing
            </span>
          </div>
        </div>
      </section>

      {/* College Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Campus Grievance Domains Covered</h3>
            <p className="text-sm text-slate-500">Comprehensive coverage across all academic &amp; residential facilities at SVCE Tirupati</p>
          </div>
          <button
            onClick={() => onNavigate('submit')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Report an issue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center gap-2">
            <Wifi className="w-6 h-6 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-800">Wi-Fi &amp; LAN</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center gap-2">
            <FlaskConical className="w-6 h-6 text-purple-600" />
            <span className="text-xs font-semibold text-slate-800">Laboratories</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-semibold text-slate-800">Classrooms</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center gap-2">
            <Droplet className="w-6 h-6 text-cyan-600" />
            <span className="text-xs font-semibold text-slate-800">Sanitation</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center gap-2">
            <HomeIcon className="w-6 h-6 text-amber-600" />
            <span className="text-xs font-semibold text-slate-800">Hostels</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center gap-2">
            <Bus className="w-6 h-6 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-800">Transport</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center gap-2">
            <Wrench className="w-6 h-6 text-rose-600" />
            <span className="text-xs font-semibold text-slate-800">Maintenance</span>
          </div>
        </div>
      </section>
    </div>
  );
};

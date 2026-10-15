import React from 'react';
import { 
  Building2, 
  Users, 
  Award, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  Code2,
  Workflow,
  CheckCircle2
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const teamMembers = [
    {
      name: 'Marupeddi Harshini',
      role: 'Team Lead & NLP Architecture',
      initials: 'MH',
      bg: 'from-blue-600 to-indigo-600'
    },
    {
      name: 'Nainar Roshini',
      role: 'Frontend UI/UX & Workflow Design',
      initials: 'NR',
      bg: 'from-indigo-600 to-purple-600'
    },
    {
      name: 'Kagathi Kiranmayee',
      role: 'Database & Similarity Engine Lead',
      initials: 'KK',
      bg: 'from-purple-600 to-pink-600'
    },
    {
      name: 'Desa Sunsitha',
      role: 'System Integration & Triage Logic',
      initials: 'DS',
      bg: 'from-blue-600 to-cyan-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-12">
      {/* College & Project Title Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          Sri Venkateswara College of Engineering, Tirupati
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About Voxora AI &amp; Team RESLOVIX
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Developed to solve College Problem Statement <span className="font-bold text-indigo-700">A4</span>: Designing an automated, AI-driven grievance sorting, priority evaluation, and department routing system for higher education campuses.
        </p>
      </div>

      {/* Project Meta Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/50 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Official Project Brief
            </span>
            <div className="text-2xl font-black mt-0.5">Problem Statement A4</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Team Identification</span>
            <span className="font-mono text-xl font-bold text-blue-300">RESLOVIX</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-1">
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Institution</span>
            <p className="font-semibold text-white text-sm">Sri Venkateswara College of Engineering (SVCE)</p>
            <p className="text-slate-400">Tirupati, Andhra Pradesh, India</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Key Objective</span>
            <p className="font-semibold text-white text-sm">AI Sorter &amp; Prioritizer</p>
            <p className="text-slate-400">Eliminate manual paper logs and triage delays</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Target Deployment</span>
            <p className="font-semibold text-white text-sm">Firebase Hosting + Firestore</p>
            <p className="text-slate-400">Multi-device responsive prototype</p>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Meet Team RESLOVIX</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">B.Tech Engineering Innovators</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <div 
              key={member.name}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col items-center text-center space-y-3 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${member.bg} flex items-center justify-center text-white text-lg font-black shadow-md`}>
                {member.initials}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                <p className="text-[11px] font-medium text-indigo-600">{member.role}</p>
                <p className="text-[11px] text-slate-400">SVCE Tirupati</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Architecture & Algorithm Explanation */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Workflow className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">
            How Voxora AI Works (Algorithm Architecture)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Rule-Based Categorizer</h3>
            <p>
              Tokenizes input text, filters standard English stopwords, and evaluates hits against curated college dictionaries (Wi-Fi, Laboratories, Classrooms, Sanitation, Hostels, Transport, Maintenance).
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Priority Triaging Engine</h3>
            <p>
              Inspects critical hazard markers (fire, electric shock, sparking, water overflow, personal safety). High hazards are immediately elevated above routine operational requests.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Jaccard Similarity Detection</h3>
            <p>
              Computes lexical set overlap <span className="font-mono text-slate-800">|A ∩ B| / |A ∪ B|</span> with location weight boosts. If similarity exceeds the threshold, it alerts the administrator without discarding the student&apos;s ticket.
            </p>
          </div>
        </div>
      </div>

      {/* College Campus Impact Note */}
      <div className="border border-indigo-100 bg-indigo-50/50 rounded-2xl p-6 text-xs text-indigo-950 space-y-2">
        <div className="font-bold text-indigo-900 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          Campus Impact at Sri Venkateswara College of Engineering
        </div>
        <p className="leading-relaxed">
          By deploying Voxora AI, administrative cells at SVCE Tirupati can cut grievance resolution turnaround times from days to hours. Students obtain guaranteed transparency through unique reference IDs, while college authorities receive clean, structured analytics to guide campus estate investments.
        </p>
      </div>
    </div>
  );
};

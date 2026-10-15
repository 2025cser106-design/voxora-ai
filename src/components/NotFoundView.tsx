import React from 'react';
import { FileQuestion, ArrowLeft, Search, Phone, Mail } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface NotFoundViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-sm">
        <FileQuestion className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold tracking-widest text-indigo-600 uppercase">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Grievance Page Not Found
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The requested complaint view, ticket record, or navigation link does not exist or has been relocated within the SVCE Tirupati grievance system.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-105 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </button>

        <button
          onClick={() => onNavigate('track')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Track a Complaint</span>
        </button>
      </div>

      {/* College helpline */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2 pt-4 mt-8">
        <span className="font-semibold text-slate-900 block">Need urgent campus assistance?</span>
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
          <a href="tel:+918772288888" className="inline-flex items-center gap-1.5 text-indigo-600 hover:underline font-medium">
            <Phone className="w-3.5 h-3.5" />
            <span>+91 877 228 8888</span>
          </a>
          <span>·</span>
          <a href="mailto:grievances@svce.edu.in" className="inline-flex items-center gap-1.5 text-indigo-600 hover:underline font-medium">
            <Mail className="w-3.5 h-3.5" />
            <span>grievances@svce.edu.in</span>
          </a>
        </div>
      </div>
    </div>
  );
};

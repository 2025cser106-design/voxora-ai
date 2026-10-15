import React, { useState } from 'react';
import { 
  Building2, 
  Send, 
  LayoutDashboard, 
  Search, 
  Info, 
  Cloud, 
  Menu, 
  X,
  AlertCircle,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';

export type ActiveTab = 'home' | 'submit' | 'dashboard' | 'track' | 'about' | 'deployment' | 'not-found';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingCount: number;
  highPriorityCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
  highPriorityCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'home', label: 'Home', icon: <Building2 className="w-4 h-4" /> },
    { id: 'submit', label: 'Submit Complaint', icon: <Send className="w-4 h-4" /> },
    { 
      id: 'dashboard', 
      label: 'Admin Dashboard', 
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: pendingCount,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { id: 'track', label: 'Track Complaint', icon: <Search className="w-4 h-4" /> },
    { id: 'about', label: 'About & Team', icon: <Info className="w-4 h-4" /> },
    { id: 'deployment', label: 'Firebase Deploy', icon: <Cloud className="w-4 h-4" /> }
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 w-full">
      {/* College affiliation top bar with clickable phone and email */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          {/* College Identity */}
          <div className="flex flex-wrap items-center gap-2 font-medium tracking-wide">
            <span className="font-semibold text-blue-200">Sri Venkateswara College of Engineering, Tirupati</span>
            <span className="text-slate-500 hidden sm:inline">·</span>
            <span className="text-slate-300 hidden sm:inline">Problem Statement ID: A4</span>
            <span className="text-slate-500 hidden sm:inline">·</span>
            <span className="bg-blue-500/25 text-blue-200 px-2 py-0.5 rounded text-[11px] font-mono">Team RESLOVIX</span>
          </div>

          {/* Clickable Phone, Email & High Priority Indicator */}
          <div className="flex flex-wrap items-center gap-3 text-slate-300 text-[11px]">
            {/* Clickable Helpline Phone */}
            <a 
              href="tel:+918772288888" 
              className="flex items-center gap-1 text-slate-300 hover:text-blue-300 transition-colors focus-visible:outline-indigo-400"
              title="Call SVCE Campus Helpline"
            >
              <Phone className="w-3 h-3 text-blue-400 shrink-0" />
              <span>+91 877 228 8888</span>
            </a>

            <span className="text-slate-600">|</span>

            {/* Clickable Grievance Email */}
            <a 
              href="mailto:grievances@svce.edu.in" 
              className="flex items-center gap-1 text-slate-300 hover:text-blue-300 transition-colors focus-visible:outline-indigo-400"
              title="Email SVCE Grievance Cell"
            >
              <Mail className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate max-w-[150px] sm:max-w-none">grievances@svce.edu.in</span>
            </a>

            {highPriorityCount > 0 && (
              <>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-rose-300 font-semibold animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  {highPriorityCount} Urgent
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Clickable Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group select-none focus-visible:outline-indigo-600 rounded-lg p-1 -ml-1 transition-transform active:scale-95 cursor-pointer border-none bg-transparent"
          aria-label="Voxora AI Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <span className="font-black text-lg tracking-tight">VX</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                VOXORA AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                SVCE Tirupati
              </span>
            </div>
            <p className="text-xs text-slate-500 -mt-0.5 hidden sm:block">
              Your Voice, Our Priority
            </p>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50/90 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-indigo-600 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-3 pb-6 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>
              );
            })}

            {/* Quick Mobile Contact Links */}
            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block px-2">
                Emergency &amp; Campus Contacts
              </span>
              <a
                href="tel:+918772288888"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 bg-slate-50 hover:bg-slate-100"
              >
                <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Call Helpline: +91 877 228 8888</span>
              </a>
              <a
                href="mailto:grievances@svce.edu.in"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 bg-slate-50 hover:bg-slate-100"
              >
                <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Email: grievances@svce.edu.in</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

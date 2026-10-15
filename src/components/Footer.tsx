import React from 'react';
import { Building2, Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-20 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand & SVCE info */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-white font-bold text-base hover:text-indigo-400 transition-colors cursor-pointer text-left border-none bg-transparent p-0"
              aria-label="Voxora AI Home"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-xs font-black shadow-md">
                VX
              </div>
              <span className="font-extrabold tracking-tight">VOXORA AI</span>
            </button>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-Powered College Complaint Sorter and Prioritizer for Sri Venkateswara College of Engineering (SVCE), Tirupati.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Problem Statement ID: A4 · Team RESLOVIX
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer border-none bg-transparent p-0"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('submit');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer border-none bg-transparent p-0"
                >
                  Lodge Grievance
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer border-none bg-transparent p-0"
                >
                  Admin Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('track');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer border-none bg-transparent p-0"
                >
                  Track Resolution
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer border-none bg-transparent p-0"
                >
                  About Team &amp; SVCE
                </button>
              </li>
            </ul>
          </div>

          {/* Clickable Campus Contact Info */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Campus Contact &amp; Support
            </h4>
            <div className="space-y-2 text-xs">
              {/* Clickable Phone Number */}
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <a
                    href="tel:+918772288888"
                    className="text-slate-300 hover:text-white transition-colors block font-medium"
                    title="Call SVCE Helpline"
                  >
                    +91 877 228 8888
                  </a>
                  <span className="text-[10px] text-slate-500">College Central Helpdesk</span>
                </div>
              </div>

              {/* Clickable Secondary Phone Number */}
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <a
                    href="tel:+918772288889"
                    className="text-slate-300 hover:text-white transition-colors block font-medium"
                    title="Call Student Grievance Cell"
                  >
                    +91 877 228 8889
                  </a>
                  <span className="text-[10px] text-slate-500">Student Welfare Cell</span>
                </div>
              </div>

              {/* Clickable Email Address */}
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <a
                    href="mailto:grievances@svce.edu.in"
                    className="text-slate-300 hover:text-white transition-colors block font-medium"
                    title="Email SVCE Grievances"
                  >
                    grievances@svce.edu.in
                  </a>
                  <span className="text-[10px] text-slate-500">Official Grievance Inbox</span>
                </div>
              </div>

              {/* Campus Address */}
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-slate-400 text-[11px] leading-tight">
                  Karakambadi Road, Tirupati, Andhra Pradesh 517507
                </span>
              </div>
            </div>
          </div>

          {/* Team Credits */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Team RESLOVIX
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Marupeddi Harshini<br />
              Nainar Roshini<br />
              Kagathi Kiranmayee<br />
              Desa Sunsitha
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveTab('deployment');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
              >
                <span>Firebase Hosting Specs</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Dynamic Year */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {currentYear} Sri Venkateswara College of Engineering, Tirupati. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setActiveTab('deployment');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-300 cursor-pointer border-none bg-transparent p-0"
            >
              Firestore &amp; Hosting Rules
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-300 cursor-pointer border-none bg-transparent p-0"
            >
              System Architecture
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setActiveTab('not-found');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-300 cursor-pointer border-none bg-transparent p-0"
              title="Test custom 404 page"
            >
              Custom 404
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

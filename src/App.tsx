/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { SubmitComplaintView } from './components/SubmitComplaintView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { TrackComplaintView } from './components/TrackComplaintView';
import { AboutView } from './components/AboutView';
import { DeploymentModal } from './components/DeploymentModal';
import { NotFoundView } from './components/NotFoundView';
import { Footer } from './components/Footer';
import { dbService } from './services/db';
import { Complaint } from './types/complaint';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [trackId, setTrackId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Show Toast notification helper
  const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, type, title, message }]);

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync document page title with active tab
  useEffect(() => {
    const titles: Record<ActiveTab, string> = {
      home: 'Voxora AI – Your Voice, Our Priority | SVCE Tirupati',
      submit: 'Lodge a Complaint | Voxora AI – SVCE Tirupati',
      dashboard: 'Admin Dashboard | Voxora AI – SVCE Tirupati',
      track: 'Track Grievance Status | Voxora AI – SVCE Tirupati',
      about: 'About Team RESLOVIX & SVCE | Voxora AI',
      deployment: 'Firebase Hosting Specs & Rules | Voxora AI',
      'not-found': '404 - Page Not Found | Voxora AI'
    };
    document.title = titles[activeTab] || 'Voxora AI – SVCE Tirupati';
  }, [activeTab]);

  // Load complaints from dbService (Firestore with localStorage fallback)
  const loadComplaints = useCallback(async () => {
    try {
      const data = await dbService.getComplaints();
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      showToast('error', 'Sync Failed', 'Could not retrieve latest campus complaints from storage.');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  // Handle complaint submission
  const handleComplaintSubmitted = (newComplaint: Complaint) => {
    setComplaints(prev => [newComplaint, ...prev.filter(c => c.id !== newComplaint.id)]);
    showToast(
      'success',
      'Complaint Successfully Logged',
      `Reference ${newComplaint.id} assigned to ${newComplaint.department}.`
    );
  };

  // Switch to track tab directly
  const handleTrackComplaint = (id: string) => {
    setTrackId(id);
    setActiveTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const highPriorityCount = complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800 w-full overflow-x-hidden">
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'success'
                ? 'bg-white border-emerald-200 text-emerald-950'
                : toast.type === 'error'
                ? 'bg-white border-rose-200 text-rose-950'
                : 'bg-white border-blue-200 text-blue-950'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-slate-900 text-xs">{toast.title}</div>
              {toast.message && (
                <div className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveTab(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pendingCount={pendingCount}
        highPriorityCount={highPriorityCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Initializing Voxora AI Engine...</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                onNavigate={handleNavigate}
                complaints={complaints}
              />
            )}

            {activeTab === 'submit' && (
              <SubmitComplaintView
                complaints={complaints}
                onComplaintSubmitted={handleComplaintSubmitted}
                onTrackComplaint={handleTrackComplaint}
              />
            )}

            {activeTab === 'dashboard' && (
              <AdminDashboardView
                complaints={complaints}
                onRefresh={loadComplaints}
                onNotify={showToast}
              />
            )}

            {activeTab === 'track' && (
              <TrackComplaintView
                complaints={complaints}
                initialSearchId={trackId}
                onNotify={showToast}
              />
            )}

            {activeTab === 'about' && (
              <AboutView />
            )}

            {activeTab === 'deployment' && (
              <DeploymentModal onNotify={showToast} />
            )}

            {activeTab === 'not-found' && (
              <NotFoundView onNavigate={handleNavigate} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

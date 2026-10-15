import React, { useState } from 'react';
import { 
  Cloud, 
  Terminal, 
  Shield, 
  Key, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  FileCode, 
  FolderTree,
  AlertCircle,
  Database
} from 'lucide-react';

interface DeploymentModalProps {
  onNotify?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({ onNotify }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onNotify?.('success', 'Snippet Copied', 'Copied to system clipboard.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleFirebaseConfig = `// firebase-config.js
// Replace these placeholders with your Firebase project credentials:
const firebaseConfig = {
  apiKey: "AIzaSyYourApiKeyHere1234567890",
  authDomain: "voxora-ai-svce.firebaseapp.com",
  projectId: "voxora-ai-svce",
  storageBucket: "voxora-ai-svce.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Export config for modular Firestore initialization
export default firebaseConfig;
`;

  const sampleFirestoreRules = `// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Prototype Rules for Sri Venkateswara College of Engineering (Voxora AI)
    // Allows read & write access during prototype testing
    match /complaints/{complaintId} {
      allow read, create: if true;
      allow update: if true; // In production, restrict to authenticated administrative staff
      allow delete: if false; // Protect complaint audit trail
    }
  }
}`;

  const sampleFirebaseJson = `{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules"
  }
}`;

  const cliCommands = `# 1. Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# 2. Login to your Google / Firebase Account
firebase login

# 3. Initialize Firebase in this project directory
# Select: Firestore and Hosting
firebase init

# 4. Deploy your website and rules to Firebase Hosting
firebase deploy
`;

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-10">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          <Cloud className="w-4 h-4" />
          Deployment Guide &amp; Architecture
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Deploying Voxora AI to Firebase Hosting
        </h1>
        <p className="text-sm text-slate-600">
          Step-by-step instructions and production files to deploy Sri Venkateswara College of Engineering&apos;s grievance portal to Google Firebase Hosting and Cloud Firestore.
        </p>
      </div>

      {/* Step by Step Guide */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-600" />
          Step-by-Step Setup Instructions
        </h2>

        <div className="space-y-6 text-sm">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-bold text-slate-900">Create a Firebase Project &amp; Web App</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Open <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-medium inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-3 h-3" /></a>, click <strong>Add Project</strong>, name it (e.g., <code>voxora-ai-svce</code>), and register a Web App under Project Settings to obtain your credentials.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-bold text-slate-900">Enable Cloud Firestore Database in Test Mode</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                In the Firebase Console left navigation, select <strong>Firestore Database</strong> &gt; <strong>Create Database</strong>. Choose <strong>Test Mode</strong> (or use the provided rules below) and pick a regional location (e.g. <code>asia-south1</code> for India).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-bold text-slate-900">Paste Credentials into <code>firebase-config.js</code></h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Copy your <code>apiKey</code>, <code>projectId</code>, <code>appId</code> etc. from the console into <code>firebase-config.js</code>. If Firebase keys are not provided or network is offline, the app automatically falls back to browser <code>localStorage</code> seamlessly.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-bold text-slate-900">Deploy via Firebase CLI</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Install the Firebase CLI and run <code>firebase deploy</code> from your terminal:
              </p>
              <div className="relative mt-2">
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                  {cliCommands}
                </pre>
                <button
                  onClick={() => handleCopy('cli', cliCommands)}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-sans transition-colors flex items-center gap-1"
                >
                  {copiedKey === 'cli' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'cli' ? 'Copied' : 'Copy Commands'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Snippets & Configuration Files */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-indigo-600" />
          Configuration &amp; Security Files
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* firebase-config.js */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-800">
                public/js/firebase-config.js
              </span>
              <button
                onClick={() => handleCopy('config', sampleFirebaseConfig)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                {copiedKey === 'config' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-950 text-slate-300 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56">
              {sampleFirebaseConfig}
            </pre>
          </div>

          {/* firestore.rules */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-800">
                firestore.rules
              </span>
              <button
                onClick={() => handleCopy('rules', sampleFirestoreRules)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                {copiedKey === 'rules' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-950 text-slate-300 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56">
              {sampleFirestoreRules}
            </pre>
          </div>
        </div>

        {/* firebase.json */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-800">
              firebase.json
            </span>
            <button
              onClick={() => handleCopy('json', sampleFirebaseJson)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              {copiedKey === 'json' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-slate-950 text-slate-300 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto">
            {sampleFirebaseJson}
          </pre>
        </div>
      </div>

      {/* Future Authentication Enhancement Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <Shield className="w-4 h-4 text-indigo-600" />
          <span>Future Enhancement Note: Firebase Authentication for SVCE Administrators</span>
        </div>
        <p className="leading-relaxed">
          For the production release, college administrative roles (Dean of Infrastructure, Chief Hostel Warden, IT Cell Head) can be authenticated via <strong>Firebase Authentication</strong> using college email addresses (e.g., <code>@svce.edu.in</code>). Once enabled, the <code>firestore.rules</code> file can restrict complaint status modification and internal resolution notes strictly to authenticated college staff, while allowing students to lodge and track without mandatory login barriers.
        </p>
      </div>
    </div>
  );
};

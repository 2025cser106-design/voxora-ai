/**
 * Voxora AI – Sri Venkateswara College of Engineering, Tirupati
 * firebase-config.js
 * 
 * Replace the placeholder values below with your Firebase Web App credentials
 * obtained from the Firebase Console (Project Settings -> General -> Your apps -> Web app).
 * 
 * If you leave these placeholders as-is, Voxora AI will automatically fall back
 * to browser localStorage so the entire prototype remains 100% functional offline!
 */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if credentials have been replaced with real project keys
function isFirebaseConfigured() {
  return (
    firebaseConfig &&
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("YOUR_API_KEY") &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes("your-project-id")
  );
}

// Make globally accessible in vanilla browser environment
window.firebaseConfig = firebaseConfig;
window.isFirebaseConfigured = isFirebaseConfigured;

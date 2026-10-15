/**
 * Voxora AI – Sri Venkateswara College of Engineering, Tirupati
 * db.js – Database Layer (Firestore Modular SDK v10 via CDN with localStorage Fallback)
 */

const LOCAL_STORAGE_KEY = 'voxora_svce_complaints';

// Initial SVCE campus seed complaints
const DEFAULT_SVCE_DATA = [
  {
    id: 'VX-2026-1001',
    name: 'K. Sai Varun',
    role: 'Student',
    email: 'saivarun.cse22@svce.edu.in',
    departmentYear: 'CSE - 3rd Year',
    title: 'Wi-Fi completely unreachable in CSE Block 2 3rd Floor',
    description: 'The access points in CSE Block-2 floor 3 show "Connected without internet" since 9 AM today. Students unable to access college portal or run cloud IDEs.',
    location: 'Block 2, Floor 3, Room 304',
    category: 'Wi-Fi',
    priority: 'Medium',
    department: 'IT / Network Cell',
    status: 'In Progress',
    possibleDuplicateOf: [],
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    resolutionNotes: 'PoE Switch in rack 3B being replaced by campus IT team.'
  },
  {
    id: 'VX-2026-1002',
    name: 'Dr. P. Ramesh Babu',
    role: 'Faculty',
    email: 'pramesh@svce.edu.in',
    departmentYear: 'ECE Department',
    title: 'Sparking exposed electrical wire near Seminar Hall 1 AC unit',
    description: 'Electric shock hazard! There is an exposed switch wire with visible spark sounds right above the seminar hall doorway. Urgent maintenance needed before the afternoon lecture.',
    location: 'Main Academic Block, Seminar Hall 1',
    category: 'Maintenance',
    priority: 'High',
    department: 'Maintenance Dept. (Estate & Electrical)',
    status: 'Pending',
    possibleDuplicateOf: [],
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  },
  {
    id: 'VX-2026-1003',
    name: 'V. Sneha Latha',
    role: 'Student',
    email: 'sneha.ece23@svce.edu.in',
    departmentYear: 'ECE - 2nd Year',
    title: 'Water cooler leaking and dirty washroom area on ECE 1st floor',
    description: 'The drinking water cooler has severe leakage causing standing water in the corridor. Also washroom taps are leaking and bins are overflowing with foul smell.',
    location: 'ECE Block, 1st Floor East Wing',
    category: 'Sanitation',
    priority: 'High',
    department: 'Housekeeping Department',
    status: 'Pending',
    possibleDuplicateOf: [],
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
  },
  {
    id: 'VX-2026-1004',
    name: 'T. Hemanth Kumar',
    role: 'Student',
    email: 'hemanth.mech@svce.edu.in',
    departmentYear: 'Mechanical - 4th Year',
    title: 'Bus Route 14 arriving 40 minutes late regularly at Chandragiri stop',
    description: 'College bus 14 repeatedly arrives at 8:45 AM instead of 8:05 AM, making more than 35 students late for first period labs and internal tests.',
    location: 'Bus Route 14 (Chandragiri to Campus)',
    category: 'Transport',
    priority: 'Medium',
    department: 'Transport Office',
    status: 'Resolved',
    possibleDuplicateOf: [],
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    resolutionNotes: 'Transport supervisor adjusted the driver schedule and deployed a backup bus.'
  },
  {
    id: 'VX-2026-1005',
    name: 'M. Divya',
    role: 'Student',
    email: 'divya.hostel@svce.edu.in',
    departmentYear: 'AI & DS - 2nd Year',
    title: 'No hot water in Godavari Girls Hostel 2nd floor geyser',
    description: 'The central geyser switch is tripping continuously in Block B 2nd floor. Students have no warm water for morning baths.',
    location: 'Godavari Hostel, Wing B, 2nd Floor',
    category: 'Hostel',
    priority: 'Medium',
    department: 'Hostel Warden Office',
    status: 'In Progress',
    possibleDuplicateOf: [],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    resolutionNotes: 'Electrician replacing the heating coil and MCB fuse.'
  }
];

class VoxoraDB {
  constructor() {
    this.firestore = null;
    this.isFirestoreReady = false;
    this.initLocalStorage();
  }

  initLocalStorage() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SVCE_DATA));
    }
  }

  async initFirestore() {
    if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
      try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js');
        const app = initializeApp(window.firebaseConfig);
        this.firestore = getFirestore(app);
        this.isFirestoreReady = true;
        console.log('Voxora AI: Connected to live Firebase Firestore.');
      } catch (err) {
        console.warn('Firebase Firestore initialization failed, using localStorage:', err);
        this.isFirestoreReady = false;
      }
    } else {
      console.log('Voxora AI: Running in offline prototype mode via localStorage.');
    }
  }

  async getComplaints() {
    if (this.isFirestoreReady && this.firestore) {
      try {
        const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js');
        const q = query(collection(this.firestore, 'complaints'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        if (list.length > 0) return list;
      } catch (e) {
        console.warn('Error reading from Firestore, using localStorage fallback:', e);
      }
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SVCE_DATA;
    } catch {
      return DEFAULT_SVCE_DATA;
    }
  }

  async getComplaintById(id) {
    const list = await this.getComplaints();
    return list.find(c => c.id.toUpperCase() === id.trim().toUpperCase()) || null;
  }

  async saveComplaint(complaint) {
    if (this.isFirestoreReady && this.firestore) {
      try {
        const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js');
        await setDoc(doc(this.firestore, 'complaints', complaint.id), complaint);
      } catch (e) {
        console.warn('Failed saving to Firestore, saving to localStorage:', e);
      }
    }

    // Always mirror to localStorage
    const current = await this.getComplaints();
    const updated = [complaint, ...current.filter(c => c.id !== complaint.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return complaint;
  }

  async updateStatus(id, newStatus, notes) {
    if (this.isFirestoreReady && this.firestore) {
      try {
        const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js');
        await updateDoc(doc(this.firestore, 'complaints', id), {
          status: newStatus,
          updatedAt: new Date().toISOString(),
          ...(notes ? { resolutionNotes: notes } : {})
        });
      } catch (e) {
        console.warn('Failed updating Firestore:', e);
      }
    }

    const current = await this.getComplaints();
    let updatedItem = null;
    const updated = current.map(item => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          resolutionNotes: notes !== undefined ? notes : item.resolutionNotes
        };
        return updatedItem;
      }
      return item;
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updatedItem;
  }

  resetData() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SVCE_DATA));
    return DEFAULT_SVCE_DATA;
  }
}

window.voxoraDB = new VoxoraDB();
window.voxoraDB.initFirestore();

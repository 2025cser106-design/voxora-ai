import { Complaint, ComplaintStatus } from '../types/complaint';

const STORAGE_KEY = 'voxora_svce_complaints';
const FIREBASE_CONFIG_KEY = 'voxora_firebase_config';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Initial realistic seed complaints for Sri Venkateswara College of Engineering (SVCE Tirupati)
const INITIAL_SVCE_COMPLAINTS: Complaint[] = [
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
    department: 'IT & Campus Network Cell',
    status: 'In Progress',
    possibleDuplicateOf: [],
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    resolutionNotes: 'Network engineers are replacing the PoE switch in rack 3B.'
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
    department: 'Estate, Electrical & Civil Works',
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
    department: 'Housekeeping & Sanitation Department',
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
    department: 'College Transport Office',
    status: 'Resolved',
    possibleDuplicateOf: [],
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    resolutionNotes: 'Transport supervisor adjusted the driver schedule and deployed a backup 45-seater bus.'
  },
  {
    id: 'VX-2026-1005',
    name: 'M. Divya',
    role: 'Student',
    email: 'divya.hostel@svce.edu.in',
    departmentYear: 'AI & DS - 2nd Year',
    title: 'No hot water in Godavari Girls Hostel 2nd floor geyser',
    description: 'The central geyser switch is tripping continuously in Block B 2nd floor. In the chilly morning students have no warm water for bathing.',
    location: 'Godavari Hostel, Wing B, 2nd Floor',
    category: 'Hostel',
    priority: 'Medium',
    department: 'Hostel Administration & Chief Warden Office',
    status: 'In Progress',
    possibleDuplicateOf: [],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    resolutionNotes: 'Electrician called to inspect heating coil and MCB fuse.'
  },
  {
    id: 'VX-2026-1006',
    name: 'Prof. K. Murali',
    role: 'Faculty',
    email: 'kmurali@svce.edu.in',
    departmentYear: 'IT Department',
    title: 'Projector display flickering and HDMI port loose in Room 205',
    description: 'The overhead Epson projector keeps losing signal every few minutes during slide presentations. Cable or HDMI port needs repair.',
    location: 'Civil & IT Block, Classroom 205',
    category: 'Classroom',
    priority: 'Medium',
    department: 'Academic Infrastructure & Maintenance',
    status: 'Resolved',
    possibleDuplicateOf: [],
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    resolutionNotes: 'Replaced ceiling HDMI cable and projector adapter.'
  },
  {
    id: 'VX-2026-1007',
    name: 'R. Rajesh',
    role: 'Student',
    email: 'rajesh.cse@svce.edu.in',
    departmentYear: 'CSE - 3rd Year',
    title: 'Slow internet and router disconnects in Room 304 Block 2',
    description: 'Internet connection is completely broken in room 304, cannot even open college marks portal.',
    location: 'Block 2, Floor 3, Room 304',
    category: 'Wi-Fi',
    priority: 'Medium',
    department: 'IT & Campus Network Cell',
    status: 'Pending',
    possibleDuplicateOf: ['VX-2026-1001'],
    similarityScore: 78,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  }
];

class DatabaseService {
  private useFirestore: boolean = false;
  private firebaseDbInstance: any = null;

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SVCE_COMPLAINTS));
    }
  }

  public getStoredFirebaseConfig(): FirebaseConfig | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public saveFirebaseConfig(config: FirebaseConfig) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
  }

  public async getComplaints(): Promise<Complaint[]> {
    // If Firebase configured, try fetching from Firestore
    if (this.firebaseDbInstance) {
      try {
        const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
        const q = query(collection(this.firebaseDbInstance, 'complaints'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const docs: Complaint[] = [];
        snapshot.forEach((doc: any) => {
          docs.push({ id: doc.id, ...doc.data() } as Complaint);
        });
        if (docs.length > 0) return docs;
      } catch (err) {
        console.warn('Firestore fetch failed, falling back to localStorage:', err);
      }
    }

    // Default & LocalStorage fallback
    if (typeof window === 'undefined') return INITIAL_SVCE_COMPLAINTS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SVCE_COMPLAINTS));
        return INITIAL_SVCE_COMPLAINTS;
      }
      return JSON.parse(data) as Complaint[];
    } catch {
      return INITIAL_SVCE_COMPLAINTS;
    }
  }

  public async getComplaintById(id: string): Promise<Complaint | null> {
    const list = await this.getComplaints();
    const cleanId = id.trim().toUpperCase();
    return list.find(c => c.id.toUpperCase() === cleanId) || null;
  }

  public async addComplaint(complaint: Complaint): Promise<Complaint> {
    // Try Firestore if connected
    if (this.firebaseDbInstance) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(this.firebaseDbInstance, 'complaints', complaint.id), complaint);
      } catch (err) {
        console.warn('Firestore write failed, falling back to localStorage:', err);
      }
    }

    // Always update localStorage mirror
    const current = await this.getComplaints();
    const updated = [complaint, ...current.filter(c => c.id !== complaint.id)];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return complaint;
  }

  public async updateComplaintStatus(
    id: string,
    status: ComplaintStatus,
    resolutionNotes?: string
  ): Promise<Complaint | null> {
    let target: Complaint | null = null;
    const current = await this.getComplaints();
    const updated = current.map(item => {
      if (item.id === id) {
        target = {
          ...item,
          status,
          updatedAt: new Date().toISOString(),
          resolutionNotes: resolutionNotes !== undefined ? resolutionNotes : item.resolutionNotes
        };
        return target;
      }
      return item;
    });

    if (this.firebaseDbInstance && target) {
      try {
        const { doc, updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(this.firebaseDbInstance, 'complaints', id), {
          status,
          updatedAt: new Date().toISOString(),
          ...(resolutionNotes ? { resolutionNotes } : {})
        });
      } catch (err) {
        console.warn('Firestore update failed:', err);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    return target;
  }

  public resetToSampleData(): Complaint[] {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SVCE_COMPLAINTS));
    }
    return INITIAL_SVCE_COMPLAINTS;
  }
}

export const dbService = new DatabaseService();

export type Role = 'Student' | 'Faculty' | 'Staff';

export type Category =
  | 'Wi-Fi'
  | 'Laboratory'
  | 'Classroom'
  | 'Sanitation'
  | 'Hostel'
  | 'Transport'
  | 'Maintenance'
  | 'Other';

export type Priority = 'High' | 'Medium' | 'Low';

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface Complaint {
  id: string;
  name: string;
  role: Role;
  email: string;
  departmentYear?: string;
  title: string;
  description: string;
  location?: string;
  category: Category;
  priority: Priority;
  department: string;
  status: ComplaintStatus;
  possibleDuplicateOf: string[];
  similarityScore?: number;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
}

export interface ProcessingResult {
  category: Category;
  priority: Priority;
  department: string;
  detectedKeywords: string[];
  priorityReason: string;
  possibleDuplicates: Array<{
    id: string;
    title: string;
    similarity: number;
  }>;
}

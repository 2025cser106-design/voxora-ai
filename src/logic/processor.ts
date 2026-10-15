import { Category, Priority, ProcessingResult, Complaint } from '../types/complaint';

// Category keyword mappings for Sri Venkateswara College of Engineering (SVCE Tirupati)
export const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  'Wi-Fi': [
    'wifi', 'wi-fi', 'internet', 'network', 'router', 'lan', 'bandwidth',
    'connectivity', 'signal', 'ethernet', 'slow net', 'hotspot', 'portal', 'ip address'
  ],
  'Laboratory': [
    'lab', 'laboratory', 'computer', 'pc', 'monitor', 'keyboard', 'mouse',
    'equipment', 'apparatus', 'oscilloscope', 'multimeter', 'chemical', 'microscope',
    'software', 'matlab', 'pycharm', 'linux', 'cad', 'instrument', 'ups', 'terminal'
  ],
  'Classroom': [
    'classroom', 'class', 'projector', 'bench', 'desk', 'podium', 'mic',
    'microphone', 'speaker', 'board', 'blackboard', 'whiteboard', 'marker',
    'smartboard', 'fan', 'tube light', 'ac', 'air conditioner', 'hall', 'lecture'
  ],
  'Sanitation': [
    'toilet', 'washroom', 'restroom', 'dirty', 'garbage', 'dustbin', 'smell',
    'cleaning', 'water cooler', 'tap', 'leakage', 'flush', 'basin', 'stink',
    'drainage', 'sanitizer', 'waste', 'hygiene'
  ],
  'Hostel': [
    'hostel', 'mess', 'food', 'warden', 'room', 'bed', 'cot', 'curfew',
    'hot water', 'drinking water', 'geyser', 'roommate', 'laundry', 'iron box',
    'mess menu', 'tiffin', 'dinner', 'in-time', 'godavari', 'krishna', 'kaveri'
  ],
  'Transport': [
    'transport', 'bus', 'driver', 'route', 'delay', 'stoppage', 'bus pass',
    'vehicle', 'pickup', 'drop', 'breakdown', 'crowded', 'seat', 'timing',
    'tirupati', 'chandragiri', 'renigunta'
  ],
  'Maintenance': [
    'maintenance', 'lift', 'elevator', 'door', 'window', 'glass', 'switch',
    'wire', 'socket', 'plug', 'power cut', 'generator', 'plumbing', 'civil',
    'carpentry', 'wall', 'crack', 'ceiling', 'water tank'
  ],
  'Other': []
};

// Priority keywords
export const HIGH_PRIORITY_KEYWORDS = [
  'urgent', 'danger', 'dangerous', 'hazard', 'fire', 'electric shock', 'spark',
  'short circuit', 'exposed wire', 'leak', 'no water', 'unsafe', 'harassment',
  'injury', 'accident', 'emergency', 'flooding', 'poisonous', 'broken glass',
  'immediate', 'severe', 'medical', 'critical'
];

export const MEDIUM_PRIORITY_KEYWORDS = [
  'not working', 'broken', 'slow', 'delay', 'faulty', 'damaged', 'flickering',
  'issue', 'problem', 'stuck', 'error', 'disturbing', 'moderate', 'unable to use',
  'offline', 'unusable', 'smelling', 'intermittent'
];

// Department routing map
export const CATEGORY_DEPARTMENT_MAP: Record<Category, string> = {
  'Wi-Fi': 'IT & Campus Network Cell',
  'Laboratory': 'Department Lab In-charge',
  'Classroom': 'Academic Infrastructure & Maintenance',
  'Sanitation': 'Housekeeping & Sanitation Department',
  'Hostel': 'Hostel Administration & Chief Warden Office',
  'Transport': 'College Transport Office',
  'Maintenance': 'Estate, Electrical & Civil Works',
  'Other': 'General Grievance & Student Welfare Cell'
};

// Common English stop words to strip before computing Jaccard similarity
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but',
  'by', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me',
  'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she',
  'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until',
  'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
  'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Tokenize string into a set of clean words
 */
export function extractKeywords(text: string): Set<string> {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
  const tokens = normalized.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(tokens);
}

/**
 * Calculate Jaccard similarity between two token sets: |A ∩ B| / |A ∪ B|
 */
export function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionCount++;
    }
  }
  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

/**
 * Main AI rule-based processor that categorizes, prioritizes, maps to department,
 * and detects possible duplicate complaints against existing database records.
 */
export function processComplaint(
  title: string,
  description: string,
  location: string = '',
  existingComplaints: Complaint[] = []
): ProcessingResult {
  const combinedText = `${title} ${description} ${location}`.toLowerCase();
  const tokens = extractKeywords(combinedText);

  // 1. Category Detection
  let bestCategory: Category = 'Other';
  let maxCategoryHits = 0;
  const detectedKeywords: string[] = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Category, string[]][]) {
    let hits = 0;
    for (const kw of keywords) {
      if (combinedText.includes(kw)) {
        hits += 1;
        if (!detectedKeywords.includes(kw)) {
          detectedKeywords.push(kw);
        }
      }
    }
    if (hits > maxCategoryHits) {
      maxCategoryHits = hits;
      bestCategory = category;
    }
  }

  // 2. Priority Recommendation
  let priority: Priority = 'Low';
  let priorityReason = 'Standard resolution queue (No high hazard or operational stoppage detected)';

  // Check High Priority first
  for (const kw of HIGH_PRIORITY_KEYWORDS) {
    if (combinedText.includes(kw)) {
      priority = 'High';
      priorityReason = `Urgent trigger detected: "${kw}". Flagged for immediate escalation.`;
      break;
    }
  }

  // Check Medium Priority if not high
  if (priority === 'Low') {
    for (const kw of MEDIUM_PRIORITY_KEYWORDS) {
      if (combinedText.includes(kw)) {
        priority = 'Medium';
        priorityReason = `Functional impairment trigger detected: "${kw}". Standard SLA applied.`;
        break;
      }
    }
  }

  // 3. Department Suggestion
  const department = CATEGORY_DEPARTMENT_MAP[bestCategory];

  // 4. Similar Complaint / Duplicate Detection
  const SIMILARITY_THRESHOLD = 0.22; // 22% keyword overlap in category or 30% global
  const possibleDuplicates: Array<{ id: string; title: string; similarity: number }> = [];

  for (const existing of existingComplaints) {
    const existingTokens = extractKeywords(`${existing.title} ${existing.description} ${existing.location || ''}`);
    const similarity = calculateJaccardSimilarity(tokens, existingTokens);

    // Boost similarity slightly if same category and same location
    const sameCat = existing.category === bestCategory;
    const sameLoc = location && existing.location && location.trim().toLowerCase() === existing.location.trim().toLowerCase();
    const effectiveSimilarity = similarity + (sameCat ? 0.08 : 0) + (sameLoc ? 0.1 : 0);

    if (effectiveSimilarity >= SIMILARITY_THRESHOLD) {
      possibleDuplicates.push({
        id: existing.id,
        title: existing.title,
        similarity: Math.min(Math.round(effectiveSimilarity * 100), 99)
      });
    }
  }

  // Sort possible duplicates highest similarity first
  possibleDuplicates.sort((a, b) => b.similarity - a.similarity);

  return {
    category: bestCategory,
    priority,
    department,
    detectedKeywords: detectedKeywords.slice(0, 8),
    priorityReason,
    possibleDuplicates
  };
}

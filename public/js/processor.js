/**
 * Voxora AI – Sri Venkateswara College of Engineering, Tirupati
 * processor.js – Rule-Based AI Complaint Processing Engine
 * 
 * Functions:
 * 1. Category Classification via keyword matching
 * 2. Priority Recommendation (High, Medium, Low) based on safety/hazard triggers
 * 3. Department Routing
 * 4. Duplicate / Similarity Warning using Jaccard Lexical Similarity
 */

const CATEGORY_KEYWORDS = {
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

const HIGH_PRIORITY_KEYWORDS = [
  'urgent', 'danger', 'dangerous', 'hazard', 'fire', 'electric shock', 'spark',
  'short circuit', 'exposed wire', 'leak', 'no water', 'unsafe', 'harassment',
  'injury', 'accident', 'emergency', 'flooding', 'poisonous', 'broken glass',
  'immediate', 'severe', 'medical', 'critical'
];

const MEDIUM_PRIORITY_KEYWORDS = [
  'not working', 'broken', 'slow', 'delay', 'faulty', 'damaged', 'flickering',
  'issue', 'problem', 'stuck', 'error', 'disturbing', 'moderate', 'unable to use',
  'offline', 'unusable', 'smelling', 'intermittent'
];

const CATEGORY_DEPARTMENT_MAP = {
  'Wi-Fi': 'IT / Network Cell',
  'Laboratory': 'Department Lab In-charge',
  'Classroom': 'Maintenance Dept. (Academic Infrastructure)',
  'Sanitation': 'Housekeeping Department',
  'Hostel': 'Hostel Warden Office',
  'Transport': 'Transport Office',
  'Maintenance': 'Maintenance Dept. (Estate & Electrical)',
  'Other': 'General Administration / Grievance Cell'
};

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'all', 'am', 'an', 'and', 'any', 'are',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but',
  'by', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'him',
  'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'just', 'me', 'more', 'most', 'my',
  'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'out',
  'so', 'some', 'such', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these',
  'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with',
  'would', 'you', 'your'
]);

function extractKeywords(text) {
  if (!text) return new Set();
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
  const tokens = normalized.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(tokens);
}

function calculateJaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) intersectionCount++;
  }
  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

/**
 * Main AI complaint processor
 * @param {string} title
 * @param {string} description
 * @param {string} location
 * @param {Array} existingComplaints
 * @returns {Object} { category, priority, department, possibleDuplicates, detectedKeywords, priorityReason }
 */
function processComplaint(title, description, location = '', existingComplaints = []) {
  const combinedText = `${title} ${description} ${location}`.toLowerCase();
  const tokens = extractKeywords(combinedText);

  // 1. Suggest Category via keyword matching
  let bestCategory = 'Other';
  let maxHits = 0;
  const detectedKeywords = [];

  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    let hits = 0;
    for (const kw of kws) {
      if (combinedText.includes(kw)) {
        hits++;
        if (!detectedKeywords.includes(kw)) detectedKeywords.push(kw);
      }
    }
    if (hits > maxHits) {
      maxHits = hits;
      bestCategory = cat;
    }
  }

  // 2. Priority Recommendation
  let priority = 'Low';
  let priorityReason = 'Standard resolution queue';

  for (const kw of HIGH_PRIORITY_KEYWORDS) {
    if (combinedText.includes(kw)) {
      priority = 'High';
      priorityReason = `Urgent hazard keyword detected: "${kw}". Flagged for immediate dispatch.`;
      break;
    }
  }

  if (priority === 'Low') {
    for (const kw of MEDIUM_PRIORITY_KEYWORDS) {
      if (combinedText.includes(kw)) {
        priority = 'Medium';
        priorityReason = `Operational issue keyword detected: "${kw}".`;
        break;
      }
    }
  }

  // 3. Department Suggestion
  const department = CATEGORY_DEPARTMENT_MAP[bestCategory] || 'General Administration';

  // 4. Duplicate / Similarity Warning
  const SIMILARITY_THRESHOLD = 0.22;
  const possibleDuplicates = [];

  for (const existing of existingComplaints) {
    const existingTokens = extractKeywords(`${existing.title} ${existing.description} ${existing.location || ''}`);
    const similarity = calculateJaccardSimilarity(tokens, existingTokens);
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

// Attach to window for vanilla HTML usage
window.VoxoraProcessor = {
  processComplaint,
  extractKeywords,
  calculateJaccardSimilarity,
  CATEGORY_KEYWORDS,
  CATEGORY_DEPARTMENT_MAP
};

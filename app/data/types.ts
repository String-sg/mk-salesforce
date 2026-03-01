// ==========================================
// MKPI Salesforce Edu Cloud - Type Definitions
// ==========================================

// --- User & Role Types ---
export type UserRole = 'teacher_el' | 'teacher_mt' | 'kah' | 'centre_head' | 'peb';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  centreId: string;
  classIds: string[];
  initials: string;
  avatar?: string;
}

// --- Organisation Types ---
export interface MKCentre {
  id: string;
  name: string;
  code: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  level: string; // e.g., "K1", "K2"
  centreId: string;
  teacherIds: string[];
  year: number;
}

// --- Student Types ---
export interface Student {
  id: string;
  name: string;
  nric: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  motherTongue: 'Chinese' | 'Malay' | 'Tamil';
  motherTongueName: string;
  classId: string;
  centreId: string;
}

// --- MKPI Framework Types ---
export interface Indicator {
  id: string;       // e.g., "1.1.1"
  number: string;   // e.g., "1.1"
  descriptor: string;
  helpText?: string;
}

export interface SubDomain {
  id: string;       // e.g., "1.1"
  number: string;   // e.g., "1.1"
  name: string;     // e.g., "Self-Awareness"
  indicators: Indicator[];
}

export interface Domain {
  id: string;       // e.g., "1"
  number: string;   // e.g., "1"
  name: string;     // e.g., "Social and Emotional Competencies"
  subDomains: SubDomain[];
}

// --- Assessment Types ---
export type RatingValue = 'Getting Started' | 'Progressing' | 'Achieving' | null;
export type AssessmentPeriod = 'Mid-Year' | 'End-Year';
export type WorkflowStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Returned';

export interface ReviewComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
  indicatorId?: string; // optional - can be tied to specific indicator
}

export interface Assessment {
  id: string;
  studentId: string;
  studentName: string;
  period: AssessmentPeriod;
  year: number;
  classId: string;
  className: string;
  centreId: string;
  centreName: string;
  status: WorkflowStatus;
  ownerId: string;
  ownerName: string;
  reviewerId?: string;
  reviewerName?: string;
  indicatorValues: Record<string, RatingValue>; // indicatorId -> rating
  overallComments: string;
  mtComments: string;
  annotation?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  approvedAt?: string;
  returnedAt?: string;
  reviewComments: ReviewComment[];
  completionPercentage: number;
}

// --- Task & Event Types ---
export interface Task {
  id: string;
  title: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  priority: 'High' | 'Normal' | 'Low';
  dueDate: string;
  relatedTo: string;
  relatedType: 'Assessment' | 'Student' | 'Report';
  assignedTo: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: 'Deadline' | 'Meeting' | 'Reminder';
}

// --- List View Types ---
export interface ListViewColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
}

export interface ListViewConfig {
  id: string;
  name: string;
  columns: ListViewColumn[];
  filterFn?: (item: Assessment) => boolean;
}

// --- Navigation Types ---
export interface NavTab {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

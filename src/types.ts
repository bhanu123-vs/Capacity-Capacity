export type UserRole = 'Trainee' | 'Trainer' | 'Admin';

export interface UserProfile {
  id: string;
  uid?: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  employeeId: string;
  centerLocation: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  status: 'Active' | 'Pending' | 'Suspended';
  skills: { name: string; level: number; maxLevel: number; category: string }[];
  updatedAt?: string;
}

export interface SlideItem {
  slideNumber: number;
  title: string;
  bulletPoints: string[];
  notes: string;
  diagramPrompt?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  type: 'video' | 'presentation' | 'document' | 'quiz_checkpoint';
  durationMinutes: number;
  videoUrl?: string;
  slides?: SlideItem[];
  documentContent?: string;
  summary: string;
  completed?: boolean;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'Radar Meteorology' | 'Numerical Weather Prediction' | 'Satellite Meteorology' | 'Disaster Management' | 'Agrometeorology' | 'Climatology';
  department: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  enrolledCount: number;
  rating: number;
  instructor: {
    name: string;
    designation: string;
    department: string;
    avatar: string;
  };
  thumbnail: string;
  competenciesCovered: string[];
  modules: CourseModule[];
  completionPercentage?: number;
  isEnrolled?: boolean;
  publishedDate: string;
}

export interface MCQQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Assessment {
  id: string;
  code: string;
  title: string;
  courseId: string;
  courseTitle: string;
  department: string;
  timeLimitMinutes: number;
  passingPercentage: number;
  totalMarks: number;
  questions: MCQQuestion[];
  instructions: string[];
  userAttempts?: {
    attemptId: string;
    date: string;
    score: number;
    totalMarks: number;
    percentage: number;
    passed: boolean;
    timeSpentSeconds: number;
    answers: Record<string, number>; // questionId -> selectedOptionIndex
  }[];
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  courseId: string;
  courseTitle: string;
  courseCode: string;
  traineeName: string;
  traineeId: string;
  traineeDepartment: string;
  issueDate: string;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'Pass';
  scorePercentage: number;
  instructorName: string;
  instructorTitle: string;
  directorName: string;
  directorTitle: string;
  qrCodeData: string;
  skillsMastered: string[];
  verificationUrl: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'Weather Forecasting' | 'Radar & Doppler' | 'Satellite Datasets' | 'MoES Guidelines' | 'Cyclone SOPs' | 'Research Papers';
  fileType: 'PDF' | 'DATASET' | 'SOP' | 'RESEARCH_PAPER' | 'MANUAL';
  fileSize: string;
  author: string;
  department: string;
  uploadDate: string;
  tags: string[];
  downloadsCount: number;
  description: string;
  keyHighlights: string[];
  contentSummary: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'Normal' | 'High' | 'Urgent';
  targetRole: 'All' | 'Trainee' | 'Trainer' | 'Admin';
  targetDepartment: string;
  date: string;
  author: string;
  authorRole: string;
  isRead: boolean;
  linkText?: string;
}

export interface PendingUserApproval {
  id: string;
  name: string;
  email: string;
  appliedRole: UserRole;
  department: string;
  employeeId: string;
  centerLocation: string;
  appliedDate: string;
  qualifications: string;
  stationCode: string;
  idProofNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface CompetencyMetric {
  skill: string;
  domain: string;
  currentLevel: number; // 0 to 100
  requiredLevel: number; // 0 to 100
  status: 'Proficient' | 'Developing' | 'Needs Training';
  lastAssessed: string;
}

export type Role = 'admin' | 'company' | 'intern';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  createdAt?: string;
}

export interface PersonalInfo {
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other' | '';
  fatherName?: string;
  address?: string;
  city?: string;
  state?: string;
  district?: string;
  pincode?: string;
}

export interface AcademicDetails {
  institutionName?: string;
  institutionType?: string;
  stream?: string;
  specialization?: string;
  cgpa?: number;
  passingYear?: number;
  tenthPercent?: number;
  twelfthPercent?: number;
}

export type Category = 'General' | 'OBC' | 'SC' | 'ST' | 'PH';

export type AllocationStatus =
  | 'Not Applied'
  | 'Pending'
  | 'Allocated'
  | 'Accepted'
  | 'Rejected'
  | 'Completed';

export interface InternProfile {
  _id?: string;
  id?: string;
  userId: string | User;
  personalInfo?: PersonalInfo;
  aadharLast4?: string;
  category: Category;
  isPH: boolean;
  academic?: AcademicDetails;
  skills: string[];
  domainInterest: string[];
  locationPreference: string[];
  languages: string[];
  resumeUrl?: string;
  resumeOriginalName?: string;
  resumeParsedSkills?: string[];
  profileCompletionPercent: number;
  allocationStatus: AllocationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyProfile {
  _id?: string;
  id?: string;
  userId: string | User;
  companyName: string;
  registrationNumber?: string;
  sector: string;
  website?: string;
  description?: string;
  employeeCount?: string;
  logo?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  contactPerson?: {
    name?: string;
    designation?: string;
    phone?: string;
  };
  isVerified?: boolean;
  verifiedAt?: string;
}

export interface InternshipSlot {
  _id: string;
  id?: string;
  companyId: string | CompanyProfile;
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  domain: string;
  responsibilities: string[];
  location: {
    city: string;
    state: string;
    isRemote: boolean;
  };
  stipend: number;
  duration: string;
  startDate: string;
  totalSeats: number;
  filledSeats: number;
  eligibility: {
    minCGPA: number;
    streams: string[];
    categories: string[];
  };
  isActive: boolean;
  createdAt?: string;
}

export interface MatchReason {
  skillScore: number;
  locationScore: number;
  academicScore: number;
  domainScore: number;
  quotaCategory: string;
  matchedSkills: string[];
  explanation: string;
}

export interface Allocation {
  _id: string;
  id?: string;
  internId: InternProfile;
  slotId: InternshipSlot;
  companyId: CompanyProfile;
  matchScore: number;
  matchReason: MatchReason;
  status:
    | 'Allocated'
    | 'Accepted by Company'
    | 'Rejected by Company'
    | 'Accepted by Intern'
    | 'Declined by Intern'
    | 'Completed';
  allocatedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  companyFeedback?: string;
  internFeedback?: string;
  internRating?: number;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface EngineLog {
  _id: string;
  runBy: string | User;
  runAt: string;
  totalInterns: number;
  totalSlots: number;
  totalAllocated: number;
  averageMatchScore: number;
  duration: number;
  status: 'Running' | 'Success' | 'Failed';
  errorMessage?: string;
  currentStep: number;
  totalSteps: number;
  stepMessage: string;
}

export interface AdminDashboardData {
  kpis: {
    totalInterns: number;
    totalCompanies: number;
    activeSlots: number;
    totalAllocated: number;
    allocationRate: number;
    avgScore: number;
    verifiedCompanies: number;
    engineRuns: number;
  };
  charts: {
    registrations30d: Array<{ date: string; interns: number; companies: number }>;
    domainDemandSupply: Array<{ domain: string; totalSeats: number; filledSeats: number }>;
    categoryBreakdown: Array<{ category: string; total: number; allocated: number }>;
    scoreDistribution: Array<{ range: string; count: number }>;
    stateWiseCount: Array<{ state: string; count: number }>;
  };
  recentLogs: EngineLog[];
}

export interface Problem {
  id: string;
  title: string;
  category: string;
  domain: string;
  location: string;
  organization: string;
  organizationType: 'Hospital & Healthcare' | 'MSME & Industry' | 'Farmer Producer Org' | 'Municipality / Urban Local Body' | 'Social Enterprise';
  postedTime: string;
  budget: number;
  interestedCount: number;
  skills: string[];
  description: string;
  painPoint: string;
  deliverableType: 'Hardware Prototype' | 'Web & Mobile App' | 'Firmware & Cloud' | 'Full-Stack Solution' | 'Edge AI Model';
  deliverables: string[];
  hardwareProvided?: string;
  timeline: string;
  urgency: 'High (Immediate)' | 'Moderate (Next 30 Days)' | 'Flexible';
  status: 'Open' | 'Under Review' | 'In Progress' | 'Completed';
  mentorName: string;
  mentorTitle: string;
  ownerEmail?: string;
  ownerId?: string;
  ownerName?: string;
  ownerRole?: string;
  ownerTitle?: string;
  ownerOrg?: string;
  ownerDepartment?: string;
  ownerPhone?: string;
  ownerBio?: string;
  ownerCity?: string;
  ownerState?: string;
  ownerVerificationStatus?: 'Verified Official' | 'Institution Verified' | 'Industry Partner';
  ownerResponseTime?: string;
  ownerActiveProjects?: number;
}

export interface ConnectionRequest {
  id: string;
  problemId: string;
  problemTitle: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: 'builder' | 'owner';
  senderInstitution: string;
  senderDegree?: string;
  senderDepartment?: string;
  senderSkills?: string[];
  senderBio?: string;
  senderGithub?: string;
  senderLinkedin?: string;
  senderPhone?: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  intentType: 'interested' | 'have_solution' | 'general_query';
  message: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
  respondedAt?: string;
  chatThreadId?: string;
}

export interface Proposal {
  id: string;
  problemId: string;
  problemTitle: string;
  builderName: string;
  builderRole: string;
  builderInstitution: string;
  solutionSummary: string;
  techStack: string[];
  estimatedWeeks: number;
  teamType: 'Solo' | 'Team of 2' | 'Team of 3-4';
  portfolioUrl?: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Accepted';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'proposal' | 'message' | 'system' | 'update' | 'connection_request';
  connectionRequestId?: string;
}

export interface ChatThread {
  id: string;
  problemId: string;
  problemTitle: string;
  counterpartName: string;
  counterpartRole: string;
  counterpartOrg: string;
  counterpartAvatar: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: 'user' | 'owner';
    text: string;
    timestamp: string;
  }[];
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  assigneeName?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  uploadedBy: string;
  uploaderName?: string;
  uploadedAt: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Project {
  id: string;
  problemId: string;
  title: string;
  ownerId: string;
  ownerName?: string;
  acceptedProposalId: string;
  solverIds: string[];
  solverNames?: string[];
  status: 'planning' | 'in_progress' | 'review' | 'completed';
  milestones: ProjectMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'builder' | 'owner' | 'admin';
  accountType: 'Student Builder / Innovator' | 'Problem Owner / Organization' | 'Platform Administrator';
  institution: string;
  department: string;
  degree: string;
  rollNo: string;
  city: string;
  state: string;
  bio: string;
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  avatarUrl?: string;
  registrationDate: string;
  registrationStatus: 'Verified' | 'Pending Verification';
  idVerificationType: 'College ID Card' | 'Institution Letter' | 'Official Institutional Email';
  idCardVerified: boolean;
  canPostProblems: boolean;
  isLoggedIn: boolean;
}


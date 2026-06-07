// ============================================
// NOVA Community Platform — Type Definitions
// ============================================

// --- Member Levels & Gamification ---

export type MemberLevel = 'explorer' | 'contributor' | 'mentor' | 'core-member';

export interface MemberBadge {
  id: string;
  label: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface ActivityPoints {
  discussionsCreated: number;
  repliesPosted: number;
  eventsJoined: number;
  likesReceived: number;
  total: number;
}

export interface GamificationProfile {
  level: MemberLevel;
  badges: MemberBadge[];
  points: ActivityPoints;
  nextLevelAt: number;
}

// --- NOVA ID System ---

export type ApplicationStatus = 'idle' | 'submitting' | 'pending' | 'approved' | 'rejected';

export type Department =
  | 'CSE'
  | 'IT'
  | 'ECE'
  | 'EEE'
  | 'MECH'
  | 'CIVIL'
  | 'AIDS'
  | 'AIML';

export type YearOfStudy = '1st' | '2nd' | '3rd' | '4th';

export interface NovaIdApplication {
  fullName: string;
  rollNumber: string;
  department: Department;
  year: YearOfStudy;
  collegeEmail: string;
  idCardFileName: string;
  motivation: string;
}

export interface NovaIdProfile {
  novaId: string;
  fullName: string;
  department: Department;
  year: YearOfStudy;
  joinedAt: string;
  status: ApplicationStatus;
  applicationId: string;
  gamification: GamificationProfile;
}

// --- Community Stats ---

export interface CommunityStats {
  members: number;
  discussions: number;
  eventsHosted: number;
  opportunitiesShared: number;
}

// --- Discussions ---

export type DiscussionCategory =
  | 'general'
  | 'hackathons'
  | 'placements'
  | 'ai-ml'
  | 'web-development'
  | 'cybersecurity'
  | 'projects'
  | 'open-source';

export interface DiscussionReply {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: DiscussionCategory;
  createdAt: string;
  replies: DiscussionReply[];
  likes: number;
  isPinned: boolean;
}

// --- Events ---

export type EventType =
  | 'study-circle'
  | 'tech-meetup'
  | 'resume-review'
  | 'mock-interview'
  | 'hackathon-prep'
  | 'open-source-sprint';

export type EventStatus = 'upcoming' | 'live' | 'completed';

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  agenda: string[];
  type: EventType;
  date: string;
  time: string;
  host: string;
  hostNovaId: string;
  participants: number;
  maxParticipants: number;
  status: EventStatus;
  tags: string[];
}

// --- Notifications ---

export type NotificationType =
  | 'event-reminder'
  | 'id-approved'
  | 'discussion-reply'
  | 'new-opportunity'
  | 'badge-earned'
  | 'level-up';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl: string;
}

// --- Moderation ---

export interface PendingIdRequest {
  applicationId: string;
  fullName: string;
  department: Department;
  year: YearOfStudy;
  rollNumber: string;
  motivation: string;
  submittedAt: string;
}

export interface ReportedDiscussion {
  discussionId: string;
  title: string;
  authorName: string;
  reportCount: number;
  reason: string;
}

// --- Community Highlights ---

export interface CommunityHighlight {
  label: string;
  title: string;
  subtitle: string;
  icon: string;
}

// --- Navigation ---

export type CommunityTab =
  | 'dashboard'
  | 'discussions'
  | 'events'
  | 'nova-id'
  | 'notifications'
  | 'moderation';

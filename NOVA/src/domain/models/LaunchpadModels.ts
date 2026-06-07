// ============================================
// Domain Models — Launchpad
// ============================================

import type { YearOfStudy } from './CommunityModels';

// --- Shared ---
export type { YearOfStudy } from './CommunityModels';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// --- Roadmaps ---
export interface RoadmapResource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'tool' | 'docs';
  free: boolean;
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  level: DifficultyLevel;
  duration: string;
  resources: RoadmapResource[];
}

export interface RoadmapDomain {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  nodes: RoadmapNode[];
}

export interface RoadmapProgress {
  [domainId: string]: {
    [nodeId: string]: boolean;
  };
}

// --- Opportunities ---
export type OpportunityCategory =
  | 'hackathon'
  | 'internship'
  | 'workshop'
  | 'conference'
  | 'scholarship'
  | 'open-source';

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  category: OpportunityCategory;
  description: string;
  deadline: string;
  applyUrl: string;
  location: string;
  eligibility: string;
  tags: string[];
  isFeatured: boolean;
}

export type OpportunityStatus = 'open' | 'closing-soon' | 'closed';

// --- Career Navigator ---
export type CareerGoal =
  | 'software-engineer'
  | 'ai-engineer'
  | 'app-developer'
  | 'cybersecurity-engineer'
  | 'data-scientist'
  | 'open-to-explore';

export interface StudentProfile {
  year: YearOfStudy;
  interests: string[];
  careerGoal: CareerGoal;
}

export interface PersonaPreset {
  id: string;
  label: string;
  icon: string;
  profile: StudentProfile;
}

export interface LearningPathItem {
  order: number;
  skill: string;
  why: string;
  timeframe: string;
}

export interface PlanResource {
  title: string;
  url: string;
  type: string;
  reason: string;
}

export interface ProjectIdea {
  title: string;
  description: string;
  skills: string[];
  difficulty: DifficultyLevel;
}

export interface TimelinePhase {
  phase: string;
  focus: string;
  milestones: string[];
}

export interface CareerPlan {
  summary: string;
  learningPath: LearningPathItem[];
  recommendedRoadmap: string;
  suggestedResources: PlanResource[];
  suggestedOpportunities: string[];
  suggestedProjects: ProjectIdea[];
  timeline: TimelinePhase[];
}

export interface SavedCareerPlan {
  profile: StudentProfile;
  plan: CareerPlan;
  savedAt: string;
}

// --- Weekly Challenge ---
export interface WeeklyChallengeData {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  skills: string[];
  estimatedTime: string;
  weekOf: string;
}

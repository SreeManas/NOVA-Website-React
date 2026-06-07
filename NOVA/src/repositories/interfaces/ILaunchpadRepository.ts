// ============================================
// Repository Interfaces — Launchpad
// ============================================

import type { RoadmapDomain, Opportunity, CareerPlan, WeeklyChallengeData } from '../../domain/models/LaunchpadModels';
import type { GenerateCareerPlanDTO } from '../../domain/dtos/LaunchpadDTOs';

export interface ILaunchpadRepository {
  // Roadmaps
  getRoadmaps(): Promise<RoadmapDomain[]>;
  getRoadmapProgress(): Promise<Record<string, Record<string, boolean>>>;
  updateRoadmapProgress(domainId: string, nodeId: string, isCompleted: boolean): Promise<void>;

  // Opportunities
  getOpportunities(): Promise<Opportunity[]>;
  getBookmarkedOpportunities(): Promise<Record<string, boolean>>;
  toggleOpportunityBookmark(id: string): Promise<Record<string, boolean>>;

  // Career Navigator
  generateCareerPlan(dto: GenerateCareerPlanDTO): Promise<CareerPlan>;
  getSavedCareerPlan(): Promise<{ profile: any; plan: CareerPlan; savedAt: string } | null>;
  saveCareerPlan(planData: { profile: any; plan: CareerPlan; savedAt: string }): Promise<void>;

  // Weekly Challenge
  getWeeklyChallenge(): Promise<WeeklyChallengeData>;
}

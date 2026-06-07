// ============================================
// Service Layer — Launchpad
// ============================================

import type { ILaunchpadRepository } from '../repositories/interfaces/ILaunchpadRepository';
import type { RoadmapDomain, Opportunity, CareerPlan, WeeklyChallengeData } from '../domain/models/LaunchpadModels';
import type { GenerateCareerPlanDTO } from '../domain/dtos/LaunchpadDTOs';

export class LaunchpadService {
  constructor(private readonly repository: ILaunchpadRepository) {}

  // --- Roadmaps ---
  async fetchRoadmaps(): Promise<RoadmapDomain[]> {
    return await this.repository.getRoadmaps();
  }

  async fetchRoadmapProgress(): Promise<Record<string, Record<string, boolean>>> {
    return await this.repository.getRoadmapProgress();
  }

  async markNodeComplete(domainId: string, nodeId: string, isCompleted: boolean): Promise<void> {
    await this.repository.updateRoadmapProgress(domainId, nodeId, isCompleted);
  }

  // --- Opportunities ---
  async fetchOpportunities(): Promise<Opportunity[]> {
    // Sort by deadline in a real scenario
    return await this.repository.getOpportunities();
  }

  async fetchBookmarks(): Promise<Record<string, boolean>> {
    return await this.repository.getBookmarkedOpportunities();
  }

  async toggleBookmark(opportunityId: string): Promise<Record<string, boolean>> {
    return await this.repository.toggleOpportunityBookmark(opportunityId);
  }

  // --- Career Navigator ---
  async generatePlan(dto: GenerateCareerPlanDTO): Promise<CareerPlan> {
    if (dto.profile.interests.length === 0) {
      throw new Error('At least one interest is required to generate a plan.');
    }
    return await this.repository.generateCareerPlan(dto);
  }

  async fetchSavedPlan(): Promise<{ profile: any; plan: CareerPlan; savedAt: string } | null> {
    return await this.repository.getSavedCareerPlan();
  }

  async savePlan(profile: any, plan: CareerPlan): Promise<void> {
    await this.repository.saveCareerPlan({ profile, plan, savedAt: new Date().toISOString() });
  }

  // --- Weekly Challenge ---
  async fetchWeeklyChallenge(): Promise<WeeklyChallengeData> {
    return await this.repository.getWeeklyChallenge();
  }
}

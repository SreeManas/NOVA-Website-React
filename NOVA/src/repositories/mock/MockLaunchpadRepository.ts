// ============================================
// Mock Repository — Launchpad
// ============================================

import type { ILaunchpadRepository } from '../interfaces/ILaunchpadRepository';
import type { RoadmapDomain, Opportunity, CareerPlan, WeeklyChallengeData } from '../../domain/models/LaunchpadModels';
import type { GenerateCareerPlanDTO } from '../../domain/dtos/LaunchpadDTOs';
import { simulateDelay, simulateFailure } from '../../core/mockApi';
import { env } from '../../core/env';

// Initial Mock Data
import { roadmapDomains } from '../../configs/roadmapConfig';
import { opportunities } from '../../configs/opportunitiesConfig';
import { weeklyChallenge } from '../../configs/weeklyChallenge';

// Extracted from original useCareerNavigator
const MOCK_CAREER_PLAN: CareerPlan = {
  summary: 'Based on your interest, a path combining fundamentals with project-based learning is recommended.',
  learningPath: [
    { order: 1, skill: 'Foundations & Tooling', why: 'Essential for all modern engineering roles.', timeframe: 'Weeks 1-4' },
    { order: 2, skill: 'Core Concepts', why: 'Building the fundamental theoretical knowledge.', timeframe: 'Weeks 5-10' },
    { order: 3, skill: 'Advanced Projects', why: 'Apply knowledge to real-world scenarios.', timeframe: 'Weeks 11-16' },
  ],
  recommendedRoadmap: 'web-dev',
  suggestedResources: [
    { title: 'Official Documentation', url: '#', type: 'Docs', reason: 'Best source of truth' },
    { title: 'Community Tutorials', url: '#', type: 'Video', reason: 'Practical walk-throughs' },
  ],
  suggestedOpportunities: ['hackathon-1', 'internship-2'],
  suggestedProjects: [
    { title: 'Portfolio Website', description: 'Showcase your skills with a personal site.', skills: ['React', 'CSS'], difficulty: 'beginner' },
    { title: 'API Integration App', description: 'Build an app that consumes a public API.', skills: ['Fetch', 'State Management'], difficulty: 'intermediate' },
  ],
  timeline: [
    { phase: 'Phase 1: Learn', focus: 'Fundamentals', milestones: ['Complete crash course', 'Build 2 mini-projects'] },
    { phase: 'Phase 2: Build', focus: 'Portfolio', milestones: ['Complete main project', 'Deploy to production'] },
  ]
};

export class MockLaunchpadRepository implements ILaunchpadRepository {
  private getStorage<T>(key: string, fallback: T): T {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  }

  // --- Roadmaps ---
  async getRoadmaps(): Promise<RoadmapDomain[]> {
    await simulateDelay(300);
    return roadmapDomains;
  }

  async getRoadmapProgress(): Promise<Record<string, Record<string, boolean>>> {
    await simulateDelay(100);
    return this.getStorage('nova-roadmap-progress', {});
  }

  async updateRoadmapProgress(domainId: string, nodeId: string, isCompleted: boolean): Promise<void> {
    await simulateDelay(200);
    const progress = this.getStorage<Record<string, Record<string, boolean>>>('nova-roadmap-progress', {});
    if (!progress[domainId]) progress[domainId] = {};
    progress[domainId][nodeId] = isCompleted;
    this.setStorage('nova-roadmap-progress', progress);
  }

  // --- Opportunities ---
  async getOpportunities(): Promise<Opportunity[]> {
    await simulateDelay(400);
    return opportunities;
  }

  async getBookmarkedOpportunities(): Promise<Record<string, boolean>> {
    await simulateDelay(150);
    return this.getStorage('nova-opportunity-bookmarks', {});
  }

  async toggleOpportunityBookmark(id: string): Promise<Record<string, boolean>> {
    await simulateDelay(200);
    const current = this.getStorage<Record<string, boolean>>('nova-opportunity-bookmarks', {});
    const updated = { ...current, [id]: !current[id] };
    this.setStorage('nova-opportunity-bookmarks', updated);
    return updated;
  }

  // --- Career Navigator ---
  async generateCareerPlan(_dto: GenerateCareerPlanDTO): Promise<CareerPlan> {
    await simulateDelay(2500); // Simulate AI generation delay
    if (env.enableMockFailures) simulateFailure(0.05, 'AI generation failed due to high load. Please try again.');
    return MOCK_CAREER_PLAN;
  }

  async getSavedCareerPlan(): Promise<{ profile: any; plan: CareerPlan; savedAt: string } | null> {
    await simulateDelay(200);
    return this.getStorage('nova-saved-career-plan', null);
  }

  async saveCareerPlan(planData: { profile: any; plan: CareerPlan; savedAt: string }): Promise<void> {
    await simulateDelay(300);
    this.setStorage('nova-saved-career-plan', planData);
  }

  // --- Weekly Challenge ---
  async getWeeklyChallenge(): Promise<WeeklyChallengeData> {
    await simulateDelay(200);
    return weeklyChallenge;
  }
}

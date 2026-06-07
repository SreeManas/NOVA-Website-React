// ============================================
// Mock Repository — Community
// ============================================
// Simulates a backend database using localStorage for persistence
// and injects artificial network delays to simulate real API calls.

import type { ICommunityRepository } from '../interfaces/ICommunityRepository';
import type { Discussion, CommunityEvent, Notification } from '../../domain/models/CommunityModels';
import type { CreateDiscussionDTO, NovaIdApplicationDTO } from '../../domain/dtos/CommunityDTOs';
import { simulateDelay, simulateFailure } from '../../core/mockApi';
import { env } from '../../core/env';

// Initial Mock Data
import { discussions as initialDiscussions, communityEvents, notifications as initialNotifications } from '../../configs/communityConfig';

export class MockCommunityRepository implements ICommunityRepository {
  private getStorage<T>(key: string, fallback: T): T {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return fallback;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }

  // --- Discussions ---
  async getDiscussions(): Promise<Discussion[]> {
    await simulateDelay(400); // Simulate network latency
    if (env.enableMockFailures) simulateFailure(0.02); // 2% chance of failure for resilience testing

    return this.getStorage<Discussion[]>('nova-discussions', initialDiscussions);
  }

  async createDiscussion(dto: CreateDiscussionDTO): Promise<Discussion> {
    await simulateDelay(600);

    const newDisc: Discussion = {
      id: `disc-${Date.now()}`,
      title: dto.title,
      content: dto.content,
      authorId: 'NOVA245113', // Mock current user
      authorName: 'You',
      category: dto.category,
      createdAt: new Date().toISOString(),
      replies: [],
      likes: 0,
      isPinned: false,
    };

    const current = this.getStorage<Discussion[]>('nova-discussions', initialDiscussions);
    const updated = [newDisc, ...current];
    this.setStorage('nova-discussions', updated);

    return newDisc;
  }

  async likeDiscussion(id: string): Promise<void> {
    await simulateDelay(200);
    const current = this.getStorage<Discussion[]>('nova-discussions', initialDiscussions);
    const updated = current.map(d => (d.id === id ? { ...d, likes: d.likes + 1 } : d));
    this.setStorage('nova-discussions', updated);
  }

  // --- Events ---
  async getEvents(): Promise<CommunityEvent[]> {
    await simulateDelay(300);
    return communityEvents; // Using static mock for events list, assuming no event creation feature yet
  }

  async getJoinedEvents(): Promise<Record<string, boolean>> {
    await simulateDelay(200);
    return this.getStorage<Record<string, boolean>>('nova-joined-events', {});
  }

  async toggleEventJoin(id: string): Promise<Record<string, boolean>> {
    await simulateDelay(300);
    const current = this.getStorage<Record<string, boolean>>('nova-joined-events', {});
    const updated = { ...current, [id]: !current[id] };
    this.setStorage('nova-joined-events', updated);
    return updated;
  }

  async getRemindedEvents(): Promise<Record<string, boolean>> {
    await simulateDelay(200);
    return this.getStorage<Record<string, boolean>>('nova-reminded-events', {});
  }

  async toggleEventRemind(id: string): Promise<Record<string, boolean>> {
    await simulateDelay(300);
    const current = this.getStorage<Record<string, boolean>>('nova-reminded-events', {});
    const updated = { ...current, [id]: !current[id] };
    this.setStorage('nova-reminded-events', updated);
    return updated;
  }

  // --- Notifications ---
  async getNotifications(): Promise<Notification[]> {
    await simulateDelay(200);
    return this.getStorage<Notification[]>('nova-notifications', initialNotifications);
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await simulateDelay(150);
    const current = this.getStorage<Notification[]>('nova-notifications', initialNotifications);
    const updated = current.map(n => (n.id === id ? { ...n, isRead: true } : n));
    this.setStorage('nova-notifications', updated);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await simulateDelay(300);
    const current = this.getStorage<Notification[]>('nova-notifications', initialNotifications);
    const updated = current.map(n => ({ ...n, isRead: true }));
    this.setStorage('nova-notifications', updated);
  }

  // --- NOVA ID ---
  async submitNovaIdApplication(_dto: NovaIdApplicationDTO): Promise<string> {
    await simulateDelay(1500); // Simulate longer processing time for applications
    const appId = `NOVA-APP-${String(Math.floor(Math.random() * 9000) + 1000).padStart(5, '0')}`;
    this.setStorage('nova-app-id', appId);
    return appId;
  }

  async getNovaIdApplicationStatus(): Promise<{ status: string, id: string } | null> {
    await simulateDelay(300);
    const appId = this.getStorage<string | null>('nova-app-id', null);
    if (!appId) return null;
    return { status: 'pending', id: appId };
  }

  // --- Replies ---
  async addReply(discussionId: string, content: string): Promise<any> {
    await simulateDelay(400);
    const reply = {
      id: `reply-${Date.now()}`,
      authorId: 'mock-user',
      authorName: 'You',
      content,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    const current = this.getStorage<Discussion[]>('nova-discussions', initialDiscussions);
    const updated = current.map(d => {
      if (d.id === discussionId) {
        return { ...d, replies: [...d.replies, reply] };
      }
      return d;
    });
    this.setStorage('nova-discussions', updated);
    return reply;
  }

  async likeReply(id: string): Promise<void> {
    await simulateDelay(200);
    const current = this.getStorage<Discussion[]>('nova-discussions', initialDiscussions);
    const updated = current.map(d => ({
      ...d,
      replies: d.replies.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r)
    }));
    this.setStorage('nova-discussions', updated);
  }
}

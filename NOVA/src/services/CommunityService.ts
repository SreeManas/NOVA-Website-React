// ============================================
// Service Layer — Community
// ============================================
// Orchestrates business logic and data access.
// Independent of React, hooks, and UI components.

import type { ICommunityRepository } from '../repositories/interfaces/ICommunityRepository';
import type { Discussion, CommunityEvent, Notification } from '../domain/models/CommunityModels';
import type { CreateDiscussionDTO, NovaIdApplicationDTO } from '../domain/dtos/CommunityDTOs';

export class CommunityService {
  constructor(private readonly repository: ICommunityRepository) {}

  // --- Discussions ---
  async fetchDiscussions(): Promise<Discussion[]> {
    // In a real app, we might perform validation or sorting here before returning to UI
    const discussions = await this.repository.getDiscussions();
    // Sort logic moved from UI to Service: Pinned first, then by date
    return discussions.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async createNewDiscussion(dto: CreateDiscussionDTO): Promise<Discussion> {
    if (!dto.title.trim() || !dto.content.trim()) {
      throw new Error('Title and content are required.');
    }
    return await this.repository.createDiscussion(dto);
  }

  async likeDiscussion(id: string): Promise<void> {
    await this.repository.likeDiscussion(id);
  }

  async addReply(discussionId: string, content: string): Promise<any> {
    if (!content.trim()) throw new Error('Reply content is required.');
    return await this.repository.addReply(discussionId, content);
  }

  async likeReply(id: string): Promise<void> {
    await this.repository.likeReply(id);
  }

  // --- Events ---
  async fetchEvents(): Promise<CommunityEvent[]> {
    return await this.repository.getEvents();
  }

  async fetchUserEventStatus(): Promise<{ joined: Record<string, boolean>; reminded: Record<string, boolean> }> {
    const [joined, reminded] = await Promise.all([
      this.repository.getJoinedEvents(),
      this.repository.getRemindedEvents(),
    ]);
    return { joined, reminded };
  }

  async toggleJoinEvent(eventId: string): Promise<Record<string, boolean>> {
    return await this.repository.toggleEventJoin(eventId);
  }

  async toggleRemindEvent(eventId: string): Promise<Record<string, boolean>> {
    return await this.repository.toggleEventRemind(eventId);
  }

  // --- Notifications ---
  async fetchNotifications(): Promise<Notification[]> {
    return await this.repository.getNotifications();
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.repository.markNotificationAsRead(id);
  }

  async markAllNotificationsRead(): Promise<void> {
    await this.repository.markAllNotificationsAsRead();
  }

  // --- NOVA ID ---
  async submitIdApplication(dto: NovaIdApplicationDTO): Promise<string> {
    // Basic validation could happen here
    if (!dto.collegeEmail.includes('@')) {
      throw new Error('Invalid email format');
    }
    return await this.repository.submitNovaIdApplication(dto);
  }

  async fetchMyApplicationStatus(): Promise<{ status: string, id: string } | null> {
    try {
      return await this.repository.getNovaIdApplicationStatus();
    } catch {
      return null;
    }
  }
}

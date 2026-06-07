// ============================================
// Repository Interfaces
// ============================================

import type { Discussion, CommunityEvent, Notification } from '../../domain/models/CommunityModels';
import type { CreateDiscussionDTO, NovaIdApplicationDTO } from '../../domain/dtos/CommunityDTOs';

/**
 * Interface defining the contract for Community data access.
 * This decouples the service layer from the actual data source (mock vs REST).
 */
export interface ICommunityRepository {
  // Discussions
  getDiscussions(): Promise<Discussion[]>;
  createDiscussion(dto: CreateDiscussionDTO): Promise<Discussion>;
  likeDiscussion(id: string): Promise<void>;
  addReply(discussionId: string, content: string): Promise<any>;
  likeReply(id: string): Promise<void>;

  // Events
  getEvents(): Promise<CommunityEvent[]>;
  getJoinedEvents(): Promise<Record<string, boolean>>;
  toggleEventJoin(id: string): Promise<Record<string, boolean>>;
  
  getRemindedEvents(): Promise<Record<string, boolean>>;
  toggleEventRemind(id: string): Promise<Record<string, boolean>>;

  // Notifications
  getNotifications(): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(): Promise<void>;

  // NOVA ID
  submitNovaIdApplication(dto: NovaIdApplicationDTO): Promise<string>;
  getNovaIdApplicationStatus(): Promise<{ status: string, id: string } | null>;
}

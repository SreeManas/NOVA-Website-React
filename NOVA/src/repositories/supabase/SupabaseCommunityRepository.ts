import { ICommunityRepository } from '../interfaces/ICommunityRepository';
import { 
  Discussion, 
  CommunityEvent, 
  Notification,
  DiscussionCategory,
  EventType,
  EventStatus
} from '../../domain/models/CommunityModels';
import { CreateDiscussionDTO, NovaIdApplicationDTO } from '../../domain/dtos/CommunityDTOs';
import { DiscussionService } from '../../services/supabase/DiscussionService';
import { EventService } from '../../services/supabase/EventService';
import { NotificationService } from '../../services/supabase/NotificationService';
import { NovaIdService } from '../../services/supabase/NovaIdService';
import { supabase } from '../../services/supabase/supabaseClient';

export class SupabaseCommunityRepository implements ICommunityRepository {
  private async getUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized: Must be logged in to perform this action");
    return user.id;
  }

  // --- Discussions ---
  async getDiscussions(): Promise<Discussion[]> {
    const supabaseDiscussions = await DiscussionService.getDiscussions();
    
    return supabaseDiscussions.map(d => ({
      id: d.id,
      title: d.title,
      content: d.content,
      authorId: d.author_id,
      authorName: d.profiles?.full_name || 'Community Member',
      category: d.category as DiscussionCategory,
      createdAt: d.created_at,
      likes: d.likes_count,
      isPinned: d.is_pinned,
      replies: (d.discussion_replies || []).map((r: any) => ({
        id: r.id,
        authorId: r.author_id,
        authorName: r.profiles?.full_name || 'Community Member',
        content: r.content,
        createdAt: r.created_at,
        likes: r.likes_count
      }))
    }));
  }

  async createDiscussion(dto: CreateDiscussionDTO): Promise<Discussion> {
    const userId = await this.getUserId();
    const result = await DiscussionService.createDiscussion({
      title: dto.title,
      content: dto.content,
      category: dto.category as any,
      author_id: userId
    });

    return {
      id: result.id,
      title: result.title,
      content: result.content,
      authorId: result.author_id,
      authorName: 'You',
      category: result.category as DiscussionCategory,
      createdAt: result.created_at,
      likes: result.likes_count,
      isPinned: result.is_pinned,
      replies: []
    };
  }

  async likeDiscussion(id: string): Promise<void> {
    // In a full implementation we'd fetch current likes or use an RPC.
    // For now, optimistic update is handled by the service if we fetch it, but let's just pass 0 
    // and rely on a real RPC in production or refetch.
    const { data } = await supabase.from('discussions').select('likes_count').eq('id', id).single();
    await DiscussionService.likeDiscussion(id, data?.likes_count || 0); 
  }

  async addReply(discussionId: string, content: string): Promise<any> {
    const userId = await this.getUserId();
    const result = await DiscussionService.addReply({
      discussion_id: discussionId,
      author_id: userId,
      content: content
    });

    return {
      id: result.id,
      authorId: result.author_id,
      authorName: result.profiles?.full_name || 'You',
      content: result.content,
      createdAt: result.created_at,
      likes: result.likes_count
    };
  }

  async likeReply(id: string): Promise<void> {
    const { data } = await supabase.from('discussion_replies').select('likes_count').eq('id', id).single();
    await DiscussionService.likeReply(id, data?.likes_count || 0);
  }

  async reportDiscussion(id: string, reason: string): Promise<void> {
    const userId = await this.getUserId();
    const { error } = await supabase
      .from('discussion_reports')
      .insert({ discussion_id: id, user_id: userId, reason });
    if (error) {
      if (error.code === '23505') {
        throw new Error('You have already reported this discussion.');
      }
      throw error;
    }
  }

  // --- Events ---
  async getEvents(): Promise<CommunityEvent[]> {
    const supabaseEvents = await EventService.getEvents();
    
    return supabaseEvents.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      agenda: [],
      type: e.event_type as EventType,
      date: e.date,
      time: e.time,
      host: e.profiles?.full_name || 'Event Host',
      hostNovaId: e.host_id,
      participants: e.event_participants ? e.event_participants.length : 0,
      maxParticipants: e.max_participants,
      status: e.status as EventStatus,
      tags: e.tags || []
    }));
  }

  async getJoinedEvents(): Promise<Record<string, boolean>> {
    try {
      const userId = await this.getUserId();
      const { data, error } = await supabase
        .from('event_participants')
        .select('event_id')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      const joined: Record<string, boolean> = {};
      (data || []).forEach((row: any) => {
        joined[row.event_id] = true;
      });
      return joined;
    } catch {
      // If user is not logged in, fall back to localStorage
      const stored = localStorage.getItem('nova_joined_events');
      return stored ? JSON.parse(stored) : {};
    }
  }

  async toggleEventJoin(id: string): Promise<Record<string, boolean>> {
    const userId = await this.getUserId();
    const joined = await this.getJoinedEvents();
    
    if (joined[id]) {
      await EventService.leaveEvent(id, userId);
    } else {
      await EventService.joinEvent(id, userId);
    }
    
    // Re-fetch from DB to get the true state
    return await this.getJoinedEvents();
  }

  async getRemindedEvents(): Promise<Record<string, boolean>> {
    const stored = localStorage.getItem('nova_reminded_events');
    return stored ? JSON.parse(stored) : {};
  }

  async toggleEventRemind(id: string): Promise<Record<string, boolean>> {
    const reminded = await this.getRemindedEvents();
    if (reminded[id]) {
      delete reminded[id];
    } else {
      reminded[id] = true;
    }
    localStorage.setItem('nova_reminded_events', JSON.stringify(reminded));
    return reminded;
  }

  // --- Notifications ---
  async getNotifications(): Promise<Notification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return []; // Return empty if not logged in
    
    const notifs = await NotificationService.getMyNotifications(user.id);
    return notifs.map(n => ({
      id: n.id,
      type: n.type as any,
      title: n.title,
      message: n.message,
      timestamp: n.created_at,
      isRead: n.is_read || false,
      actionUrl: n.action_url || '#'
    }));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await NotificationService.markAsRead(id);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    const userId = await this.getUserId();
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }

  // --- NOVA ID ---
  async submitNovaIdApplication(dto: NovaIdApplicationDTO): Promise<string> {
    const userId = await this.getUserId();
    let fileUrl = dto.idCardFileName || 'mock-url';

    if (dto.idCardFile) {
      fileUrl = await NovaIdService.uploadIdCard(userId, dto.idCardFile);
    }

    const result = await NovaIdService.submitApplication({
      user_id: userId,
      full_name: dto.fullName,
      roll_number: dto.rollNumber,
      department: dto.department as any,
      year_of_study: dto.year as any,
      college_email: dto.collegeEmail,
      motivation: dto.motivation,
      id_card_url: fileUrl,
      status: 'pending'
    });

    return result.id;
  }

  async getNovaIdApplicationStatus(): Promise<{ status: string, id: string } | null> {
    const userId = await this.getUserId();
    const app = await NovaIdService.getMyApplicationStatus(userId);
    if (!app) return null;
    return { status: app.status, id: app.id };
  }
}

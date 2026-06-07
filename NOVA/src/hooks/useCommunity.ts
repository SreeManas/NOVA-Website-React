// ============================================
// NOVA Community Platform — Async State Management Hook
// ============================================
// Consumes the CommunityService to manage UI state.
// Handles asynchronous data fetching, loading, and error states.

import { useState, useEffect, useCallback, useMemo } from 'react';
import { communityService } from '../core/di';
import { type AsyncState, defaultAsyncState } from '../core/types';
import type {
  CommunityTab,
  ApplicationStatus,
  Discussion,
  DiscussionCategory,
  CommunityEvent,
  Notification,
} from '../domain/models/CommunityModels';
import type { NovaIdApplicationDTO } from '../domain/dtos/CommunityDTOs';

export function useCommunity() {
  // ── Navigation ──
  const [activeTab, setActiveTab] = useState<CommunityTab>('dashboard');

  // ── Async States ──
  const [discussionsState, setDiscussionsState] = useState<AsyncState<Discussion[]>>(defaultAsyncState());
  const [eventsState, setEventsState] = useState<AsyncState<CommunityEvent[]>>(defaultAsyncState());
  const [notificationsState, setNotificationsState] = useState<AsyncState<Notification[]>>(defaultAsyncState());
  
  // Event interaction states (joined/reminded dictionaries)
  const [eventInteractionState, setEventInteractionState] = useState<{ joined: Record<string, boolean>; reminded: Record<string, boolean> }>({ joined: {}, reminded: {} });

  // ── Local UI State ──
  // Discussions
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [discussionFilter, setDiscussionFilter] = useState('all');
  const [discussionSearch, setDiscussionSearch] = useState('');
  const [isCreatingDiscussion, setIsCreatingDiscussion] = useState(false);
  const [createDiscussionError, setCreateDiscussionError] = useState<string | null>(null);

  // Events
  const [eventFilter, setEventFilter] = useState('all');
  const [isInteractingWithEvent, setIsInteractingWithEvent] = useState<Record<string, boolean>>({});

  // NOVA ID
  const [idStatus, setIdStatus] = useState<ApplicationStatus>('idle');
  const [applicationId, setApplicationId] = useState<string>('');
  const [viewAsApproved, setViewAsApproved] = useState(false);

  // ==========================================
  // Data Fetching
  // ==========================================

  const loadDiscussions = useCallback(async () => {
    setDiscussionsState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await communityService.fetchDiscussions();
      setDiscussionsState({ data, loading: false, error: null });
    } catch (err: any) {
      setDiscussionsState(prev => ({ ...prev, loading: false, error: err.message || 'Failed to load discussions' }));
    }
  }, []);

  const loadEventsAndInteractions = useCallback(async () => {
    setEventsState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [events, interactions] = await Promise.all([
        communityService.fetchEvents(),
        communityService.fetchUserEventStatus(),
      ]);
      setEventsState({ data: events, loading: false, error: null });
      setEventInteractionState(interactions);
    } catch (err: any) {
      console.error('Failed to load events:', err);
      setEventsState(prev => ({ ...prev, loading: false, error: err.message || 'Failed to load events' }));
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setNotificationsState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await communityService.fetchNotifications();
      setNotificationsState({ data, loading: false, error: null });
    } catch (err: any) {
      setNotificationsState(prev => ({ ...prev, loading: false, error: err.message || 'Failed to load notifications' }));
    }
  }, []);

  // Initial Load
  useEffect(() => {
    loadDiscussions();
    loadEventsAndInteractions();
    loadNotifications();
    
    // Fetch actual application status from DB
    communityService.fetchMyApplicationStatus().then(statusInfo => {
      if (statusInfo) {
        setIdStatus(statusInfo.status as ApplicationStatus);
        setApplicationId(statusInfo.id);
      }
    });
  }, [loadDiscussions, loadEventsAndInteractions, loadNotifications]);


  // ==========================================
  // Operations (Mutations)
  // ==========================================

  // --- Discussions ---
  const filteredDiscussions = useMemo(() => {
    let result = discussionsState.data || [];
    if (discussionFilter !== 'all') {
      result = result.filter(d => d.category === discussionFilter);
    }
    if (discussionSearch.trim()) {
      const q = discussionSearch.toLowerCase();
      result = result.filter(
        d => d.title.toLowerCase().includes(q) || d.authorName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [discussionsState.data, discussionFilter, discussionSearch]);

  const createDiscussion = async (title: string, category: DiscussionCategory, content: string): Promise<boolean> => {
    setIsCreatingDiscussion(true);
    setCreateDiscussionError(null);
    try {
      const newDisc = await communityService.createNewDiscussion({ title, category, content });
      // Optimistic or real re-fetch. Here we just prepend to current state to avoid full reload delay.
      setDiscussionsState(prev => ({
        ...prev,
        data: [newDisc, ...(prev.data || [])],
      }));
      return true;
    } catch (err: any) {
      setCreateDiscussionError(err.message || 'Failed to create discussion');
      return false;
    } finally {
      setIsCreatingDiscussion(false);
    }
  };

  const likeDiscussion = async (id: string) => {
    try {
      await communityService.likeDiscussion(id);
      loadDiscussions(); // Reload to get updated likes
    } catch (err) {
      console.error(err);
    }
  };

  const addReply = async (discussionId: string, content: string) => {
    try {
      await communityService.addReply(discussionId, content);
      loadDiscussions(); // Reload to fetch new replies
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const likeReply = async (replyId: string) => {
    try {
      await communityService.likeReply(replyId);
      loadDiscussions();
    } catch (err) {
      console.error(err);
    }
  };

  const reportDiscussion = async (id: string, reason: string) => {
    try {
      await communityService.reportDiscussion(id, reason);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // --- Events ---
  const joinEvent = async (id: string) => {
    setIsInteractingWithEvent(prev => ({ ...prev, [id]: true }));
    try {
      const updatedJoined = await communityService.toggleJoinEvent(id);
      setEventInteractionState(prev => ({ ...prev, joined: updatedJoined }));
      // Refresh counts from database
      await loadEventsAndInteractions();
    } catch (err: any) {
      console.error('Failed to join/unjoin event:', err);
      // If RLS blocks the delete (unjoin), tell the user
      if (err.message?.includes('row-level security') || err.message?.includes('policy')) {
        alert('Permission denied. You may need to run the latest RLS migration in your Supabase SQL editor.');
      }
    } finally {
      setIsInteractingWithEvent(prev => ({ ...prev, [id]: false }));
    }
  };

  const remindEvent = async (id: string) => {
    setIsInteractingWithEvent(prev => ({ ...prev, [`remind-${id}`]: true }));
    try {
      const updatedReminded = await communityService.toggleRemindEvent(id);
      setEventInteractionState(prev => ({ ...prev, reminded: updatedReminded }));
    } catch (err) {
      console.error('Failed to set reminder', err);
    } finally {
      setIsInteractingWithEvent(prev => ({ ...prev, [`remind-${id}`]: false }));
    }
  };

  // --- Notifications ---
  const unreadCount = useMemo(
    () => (notificationsState.data || []).filter(n => !n.isRead).length,
    [notificationsState.data]
  );

  const markAsRead = async (id: string) => {
    // Optimistic
    setNotificationsState(prev => ({
      ...prev,
      data: prev.data?.map(n => (n.id === id ? { ...n, isRead: true } : n)) || null,
    }));
    try {
      await communityService.markNotificationRead(id);
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic
    setNotificationsState(prev => ({
      ...prev,
      data: prev.data?.map(n => ({ ...n, isRead: true })) || null,
    }));
    try {
      await communityService.markAllNotificationsRead();
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  // --- NOVA ID ---
  const submitApplication = async (appDto: NovaIdApplicationDTO) => {
    setIdStatus('submitting');
    try {
      const newAppId = await communityService.submitIdApplication(appDto);
      setApplicationId(newAppId);
      setIdStatus('pending');
    } catch (err: any) {
      console.error('Failed to submit application', err);
      alert('Application failed: ' + (err.message || 'Unknown error'));
      setIdStatus('idle');
      // Should ideally expose error to UI
    }
  };

  return {
    activeTab,
    setActiveTab,
    
    // State Objects
    discussionsState,
    eventsState,
    notificationsState,
    
    // Discusssions
    filteredDiscussions,
    selectedDiscussion,
    setSelectedDiscussion,
    discussionFilter,
    setDiscussionFilter,
    discussionSearch,
    setDiscussionSearch,
    fetchDiscussions: loadDiscussions,
    createNewDiscussion: createDiscussion,
    likeDiscussion,
    addReply,
    likeReply,
    reportDiscussion,
    
    // Events
    joinedEvents: eventInteractionState.joined,
    remindedEvents: eventInteractionState.reminded,
    eventFilter,
    setEventFilter,
    joinEvent,
    remindEvent,
    isInteractingWithEvent,
    
    // Notifications
    unreadCount,
    markAsRead,
    markAllAsRead,
    
    // NOVA ID
    idStatus,
    applicationId,
    submitApplication,
    viewAsApproved,
    setViewAsApproved,
    
    // Expose refresh for AddEventModal
    loadEventsAndInteractions,
  };
}

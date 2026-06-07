// ============================================
// NOVA Launchpad — Async Opportunities Hook
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { launchpadService } from '../core/di';
import { type AsyncState, defaultAsyncState } from '../core/types';
import type { Opportunity } from '../domain/models/LaunchpadModels';

export function useOpportunities() {
  const [opportunitiesState, setOpportunitiesState] = useState<AsyncState<Opportunity[]>>(defaultAsyncState());
  const [bookmarksState, setBookmarksState] = useState<AsyncState<Record<string, boolean>>>(defaultAsyncState());

  const loadOpportunities = useCallback(async () => {
    setOpportunitiesState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await launchpadService.fetchOpportunities();
      setOpportunitiesState({ data, loading: false, error: null });
    } catch (error: any) {
      setOpportunitiesState(prev => ({ ...prev, loading: false, error: error.message || 'Failed to fetch opportunities' }));
    }
  }, []);

  const loadBookmarks = useCallback(async () => {
    setBookmarksState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await launchpadService.fetchBookmarks();
      setBookmarksState({ data, loading: false, error: null });
    } catch (error: any) {
      setBookmarksState(prev => ({ ...prev, loading: false, error: error.message || 'Failed to load bookmarks' }));
    }
  }, []);

  useEffect(() => {
    loadOpportunities();
    loadBookmarks();
  }, [loadOpportunities, loadBookmarks]);

  const toggleBookmark = async (id: string) => {
    // Optimistic UI update
    setBookmarksState(prev => {
      const current = prev.data || {};
      return { ...prev, data: { ...current, [id]: !current[id] } };
    });

    try {
      await launchpadService.toggleBookmark(id);
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
      // Revert on failure
      setBookmarksState(prev => {
        const current = prev.data || {};
        return { ...prev, data: { ...current, [id]: !current[id] } };
      });
    }
  };

  return {
    opportunitiesState,
    bookmarksState,
    toggleBookmark,
  };
}

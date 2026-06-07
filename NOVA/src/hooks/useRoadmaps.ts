// ============================================
// NOVA Launchpad — Async Roadmaps Hook
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { launchpadService } from '../core/di';
import { type AsyncState, defaultAsyncState } from '../core/types';
import type { RoadmapDomain } from '../domain/models/LaunchpadModels';

export function useRoadmaps() {
  const [roadmapsState, setRoadmapsState] = useState<AsyncState<RoadmapDomain[]>>(defaultAsyncState());
  const [progressState, setProgressState] = useState<AsyncState<Record<string, Record<string, boolean>>>>(defaultAsyncState());

  const loadRoadmaps = useCallback(async () => {
    setRoadmapsState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await launchpadService.fetchRoadmaps();
      setRoadmapsState({ data, loading: false, error: null });
    } catch (error: any) {
      setRoadmapsState(prev => ({ ...prev, loading: false, error: error.message || 'Failed to fetch roadmaps' }));
    }
  }, []);

  const loadProgress = useCallback(async () => {
    setProgressState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await launchpadService.fetchRoadmapProgress();
      setProgressState({ data, loading: false, error: null });
    } catch (error: any) {
      setProgressState(prev => ({ ...prev, loading: false, error: error.message || 'Failed to load progress' }));
    }
  }, []);

  useEffect(() => {
    loadRoadmaps();
    loadProgress();
  }, [loadRoadmaps, loadProgress]);

  const toggleNodeCompletion = async (domainId: string, nodeId: string) => {
    const isCurrentlyCompleted = progressState.data?.[domainId]?.[nodeId] || false;
    const nextState = !isCurrentlyCompleted;

    // Optimistic Update
    setProgressState(prev => {
      const current = prev.data || {};
      const domainProgress = current[domainId] || {};
      return {
        ...prev,
        data: {
          ...current,
          [domainId]: { ...domainProgress, [nodeId]: nextState }
        }
      };
    });

    try {
      await launchpadService.markNodeComplete(domainId, nodeId, nextState);
    } catch (err) {
      console.error('Failed to update progress', err);
      // Revert optimistic update
      setProgressState(prev => {
        const current = prev.data || {};
        const domainProgress = current[domainId] || {};
        return {
          ...prev,
          data: {
            ...current,
            [domainId]: { ...domainProgress, [nodeId]: isCurrentlyCompleted }
          }
        };
      });
    }
  };

  return {
    roadmapsState,
    progressState,
    toggleNodeCompletion,
  };
}

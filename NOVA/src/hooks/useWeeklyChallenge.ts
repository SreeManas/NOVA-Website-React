// ============================================
// NOVA Launchpad — Async Weekly Challenge Hook
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { launchpadService } from '../core/di';
import { type AsyncState, defaultAsyncState } from '../core/types';
import type { WeeklyChallengeData } from '../domain/models/LaunchpadModels';

export function useWeeklyChallenge() {
  const [challengeState, setChallengeState] = useState<AsyncState<WeeklyChallengeData>>(defaultAsyncState());

  const loadChallenge = useCallback(async () => {
    setChallengeState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await launchpadService.fetchWeeklyChallenge();
      setChallengeState({ data, loading: false, error: null });
    } catch (error: any) {
      setChallengeState(prev => ({ ...prev, loading: false, error: error.message || 'Failed to fetch weekly challenge' }));
    }
  }, []);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  return { challengeState };
}

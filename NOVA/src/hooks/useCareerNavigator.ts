// ============================================
// NOVA Launchpad — Async Career Navigator Hook
// ============================================

import { useState, useEffect } from 'react';
import { launchpadService } from '../core/di';
import type { StudentProfile, YearOfStudy, CareerGoal, CareerPlan, SavedCareerPlan } from '../domain/models/LaunchpadModels';

export function useCareerNavigator() {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Profile State
  const [year, setYear] = useState<YearOfStudy>('1st');
  const [interests, setInterests] = useState<string[]>([]);
  const [careerGoal, setCareerGoal] = useState<CareerGoal>('open-to-explore');

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Result State
  const [plan, setPlan] = useState<CareerPlan | null>(null);
  const [savedPlan, setSavedPlan] = useState<SavedCareerPlan | null>(null);

  // Load saved plan on mount
  useEffect(() => {
    launchpadService.fetchSavedPlan().then(saved => {
      if (saved) setSavedPlan(saved as SavedCareerPlan);
    }).catch(() => {}); // Ignore errors on mount
  }, []);

  const goNext = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const goBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const goToStep = (step: number) => setCurrentStep(step);

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const applyPreset = (profile: StudentProfile) => {
    setYear(profile.year);
    setInterests(profile.interests);
    setCareerGoal(profile.careerGoal);
    goToStep(3);
    generatePlanFromProfile(profile);
  };

  const reset = () => {
    setCurrentStep(0);
    setYear('1st');
    setInterests([]);
    setCareerGoal('open-to-explore');
    setPlan(null);
    setError(null);
  };

  const generatePlanFromProfile = async (profile: StudentProfile) => {
    setIsGenerating(true);
    setError(null);
    setPlan(null);
    
    // Simulate generation stages for UI delight
    setGenerationStatus('Analyzing profile...');
    
    try {
      setTimeout(() => setGenerationStatus('Mapping to industry demands...'), 800);
      setTimeout(() => setGenerationStatus('Curating resources...'), 1600);
      
      const newPlan = await launchpadService.generatePlan({ profile });
      setPlan(newPlan);
    } catch (err: any) {
      setError(err.message || 'Failed to generate plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePlan = () => {
    goToStep(3);
    generatePlanFromProfile({ year, interests, careerGoal });
  };

  const savePlan = async () => {
    if (!plan) return;
    try {
      const profileToSave = { year, interests, careerGoal };
      await launchpadService.savePlan(profileToSave, plan);
      setSavedPlan({ profile: profileToSave, plan, savedAt: new Date().toISOString() });
      // In a real app, maybe show a toast notification here
    } catch (err) {
      console.error('Failed to save plan', err);
    }
  };

  return {
    currentStep,
    year, setYear,
    interests, toggleInterest,
    careerGoal, setCareerGoal,
    isGenerating, generationStatus,
    error,
    plan,
    savedPlan,
    canGenerate: interests.length > 0,
    goNext, goBack, goToStep,
    applyPreset,
    generatePlan,
    savePlan,
    reset,
  };
}

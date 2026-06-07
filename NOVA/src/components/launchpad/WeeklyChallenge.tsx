import React from 'react';
import { useWeeklyChallenge } from '../../hooks/useWeeklyChallenge';

const difficultyColors: Record<string, string> = {
  beginner: '#10b981',
  intermediate: '#8b5cf6',
  advanced: '#ef4444',
};

const WeeklyChallenge: React.FC = (): React.JSX.Element | null => {
  const { challengeState } = useWeeklyChallenge();
  const challenge = challengeState.data;

  if (challengeState.loading || !challenge) return null; // Or a skeleton loader
  
  const color = difficultyColors[challenge.difficulty] || '#8b5cf6';

  return (
    <div className="lp-weekly-challenge">
      <div className="lp-weekly-badge">
        <i className="fas fa-fire" /> Weekly Challenge
      </div>
      <div className="lp-weekly-body">
        <div className="lp-weekly-info">
          <h3 className="lp-weekly-title">{challenge.title}</h3>
          <p className="lp-weekly-desc">{challenge.description}</p>
          <div className="lp-weekly-tags">
            {challenge.skills.map(skill => (
              <span key={skill} className="lp-weekly-skill">{skill}</span>
            ))}
          </div>
        </div>
        <div className="lp-weekly-meta">
          <div className="lp-weekly-meta-item">
            <span className="lp-weekly-meta-label">Difficulty</span>
            <span className="lp-weekly-difficulty" style={{ color }}>
              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
            </span>
          </div>
          <div className="lp-weekly-meta-item">
            <span className="lp-weekly-meta-label">Est. Time</span>
            <span className="lp-weekly-meta-value">{challenge.estimatedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChallenge;

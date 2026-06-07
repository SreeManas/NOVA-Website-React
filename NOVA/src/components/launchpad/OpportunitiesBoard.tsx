import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOpportunities } from '../../hooks/useOpportunities';
import type {
  Opportunity,
  OpportunityCategory,
  OpportunityStatus,
  SavedCareerPlan,
} from '../../domain/models/LaunchpadModels';
import { useAuth } from '../../context/AuthContext';
import AddOpportunityModal from './AddOpportunityModal';

const CATEGORY_CONFIG: Record<OpportunityCategory, { label: string; color: string; icon: string }> = {
  hackathon: { label: 'Hackathon', color: '#8b5cf6', icon: 'fas fa-laptop-code' },
  internship: { label: 'Internship', color: '#10b981', icon: 'fas fa-briefcase' },
  workshop: { label: 'Workshop', color: '#3b82f6', icon: 'fas fa-chalkboard-teacher' },
  conference: { label: 'Conference', color: '#f59e0b', icon: 'fas fa-users' },
  scholarship: { label: 'Scholarship', color: '#ec4899', icon: 'fas fa-award' },
  'open-source': { label: 'Open Source', color: '#ef4444', icon: 'fas fa-code-branch' },
};

const ALL_CATEGORIES: OpportunityCategory[] = ['hackathon', 'internship', 'workshop', 'conference', 'scholarship', 'open-source'];

function getOpportunityStatus(deadline: string): OpportunityStatus {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return 'closed';
  if (daysLeft <= 7) return 'closing-soon';
  return 'open';
}

function formatDeadline(deadline: string): string {
  const date = new Date(deadline);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDaysLeft(deadline: string): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function computeMatchScore(opp: Opportunity, savedPlan: SavedCareerPlan | null): number | null {
  if (!savedPlan) return null;

  const { interests, careerGoal } = savedPlan.profile;
  let score = 0;
  let factors = 0;

  // Interest overlap (check tags against user interests)
  const interestLower = interests.map(i => i.toLowerCase());
  const tagMatches = opp.tags.filter(tag =>
    interestLower.some(interest => tag.includes(interest) || interest.includes(tag))
  ).length;
  score += Math.min(tagMatches / Math.max(interests.length, 1), 1) * 40;
  factors += 40;

  // Career goal relevance
  const goalTagMap: Record<string, string[]> = {
    'software-engineer': ['web', 'javascript', 'software-engineering', 'coding', 'open-source', 'git'],
    'ai-engineer': ['ai', 'machine-learning', 'deep-learning', 'nlp', 'python', 'generative-ai'],
    'app-developer': ['web', 'javascript', 'building', 'product', 'startup'],
    'cybersecurity-engineer': ['cybersecurity', 'ctf', 'hacking', 'networking', 'security'],
    'data-scientist': ['ai', 'machine-learning', 'python', 'data', 'analytics'],
    'open-to-explore': ['beginner-friendly', 'workshops', 'innovation'],
  };
  const goalTags = goalTagMap[careerGoal] || [];
  const goalMatches = opp.tags.filter(tag => goalTags.includes(tag)).length;
  score += Math.min(goalMatches / Math.max(goalTags.length * 0.3, 1), 1) * 40;
  factors += 40;

  // Featured bonus
  if (opp.isFeatured) {
    score += 10;
  }
  factors += 10;

  // Beginner-friendly bonus
  if (opp.tags.includes('beginner-friendly')) {
    score += 10;
  }
  factors += 10;

  return Math.min(Math.round((score / factors) * 100), 99);
}

const OpportunitiesBoard: React.FC = (): React.JSX.Element => {
  const { opportunitiesState, bookmarksState, toggleBookmark } = useOpportunities();
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<OpportunityCategory | 'all'>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Note: we fetch the saved plan from localStorage here for convenience
  const getStorage = <T,>(key: string, fallback: T): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };
  const savedPlan = useMemo(() => getStorage<SavedCareerPlan | null>('nova-saved-career-plan', null), []);

  const filteredOpportunities = useMemo(() => {
    if (!opportunitiesState.data) return [];
    
    let filtered = [...opportunitiesState.data];

    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(opp => opp.category === activeCategory);
    }

    // Bookmarks filter
    if (showBookmarksOnly && bookmarksState.data) {
      filtered = filtered.filter(opp => bookmarksState.data![opp.id]);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(opp =>
        opp.title.toLowerCase().includes(query) ||
        opp.organizer.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query) ||
        opp.tags.some(tag => tag.includes(query))
      );
    }

    // Sort: open first, then closing-soon, then closed. Featured first within each group.
    filtered.sort((a, b) => {
      const statusOrder = { open: 0, 'closing-soon': 1, closed: 2 };
      const aStatus = getOpportunityStatus(a.deadline);
      const bStatus = getOpportunityStatus(b.deadline);
      if (statusOrder[aStatus] !== statusOrder[bStatus]) return statusOrder[aStatus] - statusOrder[bStatus];
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

    return filtered;
  }, [searchQuery, activeCategory, showBookmarksOnly, opportunitiesState.data, bookmarksState.data]);

  const renderStatusBadge = (deadline: string) => {
    const status = getOpportunityStatus(deadline);
    const days = getDaysLeft(deadline);
    const config = {
      open: { label: `${days} days left`, className: 'lp-status-open' },
      'closing-soon': { label: `${days} day${days === 1 ? '' : 's'} left!`, className: 'lp-status-closing' },
      closed: { label: 'Closed', className: 'lp-status-closed' },
    };
    const { label, className } = config[status];
    return <span className={`lp-status-badge ${className}`}>{label}</span>;
  };

  const renderOpportunityCard = (opp: Opportunity, index: number) => {
    const catConfig = CATEGORY_CONFIG[opp.category];
    const status = getOpportunityStatus(opp.deadline);
    const isBookmarked = bookmarksState.data?.[opp.id] === true;
    const matchScore = computeMatchScore(opp, savedPlan);

    return (
      <motion.div
        key={opp.id}
        className={`lp-opp-card ${status === 'closed' ? 'lp-opp-closed' : ''}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <div className="lp-opp-top">
          <span className="lp-opp-category" style={{ backgroundColor: catConfig.color + '22', color: catConfig.color, borderColor: catConfig.color + '44' }}>
            <i className={catConfig.icon} /> {catConfig.label}
          </span>
          <div className="lp-opp-top-right">
            {matchScore !== null && matchScore > 0 && (
              <span className="lp-match-score" title="Match based on your Career Navigator profile">
                {matchScore}% match
              </span>
            )}
            <button
              className={`lp-bookmark-btn ${isBookmarked ? 'lp-bookmarked' : ''}`}
              onClick={() => toggleBookmark(opp.id)}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this opportunity'}
            >
              <i className={isBookmarked ? 'fas fa-heart' : 'far fa-heart'} />
            </button>
          </div>
        </div>

        <h4 className="lp-opp-title">{opp.title}</h4>
        <p className="lp-opp-organizer">{opp.organizer}</p>
        <p className="lp-opp-desc">{opp.description}</p>

        <div className="lp-opp-tags">
          {opp.tags.slice(0, 4).map(tag => (
            <span key={tag} className="lp-opp-tag">{tag}</span>
          ))}
        </div>

        <div className="lp-opp-footer">
          <div className="lp-opp-meta">
            <span><i className="fas fa-map-marker-alt" /> {opp.location}</span>
            <span><i className="fas fa-calendar" /> {formatDeadline(opp.deadline)}</span>
          </div>
          <div className="lp-opp-actions">
            {renderStatusBadge(opp.deadline)}
            {status !== 'closed' && (
              <a href={opp.applyUrl} target="_blank" rel="noopener noreferrer" className="lp-apply-btn">
                Apply <i className="fas fa-external-link-alt" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="lp-opportunities">
      {/* Search and filters */}
      <div className="lp-opp-controls">
        <div className="lp-search-bar">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="lp-search-input"
            aria-label="Search opportunities"
          />
          {searchQuery && (
            <button className="lp-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
              <i className="fas fa-times" />
            </button>
          )}
        </div>
        
        {isAdmin && (
          <button 
            className="lp-pill lp-pill-active" 
            style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}
            onClick={() => setIsAddModalOpen(true)}
          >
            <i className="fas fa-plus" /> Add Opportunity
          </button>
        )}
      </div>

      <div className="lp-filter-row" style={{ marginTop: '1rem' }}>
          <div className="lp-category-pills" role="tablist" aria-label="Filter by category">
            <button
              className={`lp-pill ${activeCategory === 'all' ? 'lp-pill-active' : ''}`}
              onClick={() => setActiveCategory('all')}
              role="tab"
              aria-selected={activeCategory === 'all'}
            >
              All
            </button>
            {ALL_CATEGORIES.map(cat => {
              const config = CATEGORY_CONFIG[cat];
              return (
                <button
                  key={cat}
                  className={`lp-pill ${activeCategory === cat ? 'lp-pill-active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  style={activeCategory === cat ? { backgroundColor: config.color + '22', color: config.color, borderColor: config.color } : undefined}
                >
                  <i className={config.icon} /> {config.label}
                </button>
              );
            })}
          </div>

          <button
            className={`lp-pill lp-bookmark-filter ${showBookmarksOnly ? 'lp-pill-active' : ''}`}
            onClick={() => setShowBookmarksOnly(prev => !prev)}
            aria-pressed={showBookmarksOnly}
          >
            <i className="fas fa-heart" /> Saved
          </button>
        </div>

        {!savedPlan && (
          <div className="lp-match-hint">
            <i className="fas fa-info-circle" />
            <span>Complete your Career Navigator profile to see personalized match scores.</span>
          </div>
        )}

      {/* Results */}
      {opportunitiesState.loading ? (
        <div className="lp-empty-state">
          <div className="cm-loading-spinner" />
          <p>Loading opportunities...</p>
        </div>
      ) : opportunitiesState.error ? (
        <div className="lp-empty-state">
          <i className="fas fa-exclamation-circle" style={{ color: '#ef4444' }} />
          <h3>Failed to load opportunities</h3>
          <p>{opportunitiesState.error}</p>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="lp-empty-state">
          <i className="fas fa-search" />
          <h3>{showBookmarksOnly ? 'No saved opportunities' : 'No opportunities found'}</h3>
          <p>{showBookmarksOnly ? 'Bookmark opportunities to see them here.' : 'Try adjusting your search or filters.'}</p>
        </div>
      ) : (
        <div className="lp-opp-grid">
          {filteredOpportunities.map((opp, i) => renderOpportunityCard(opp, i))}
        </div>
      )}

      <AddOpportunityModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdded={() => {
          // Ideally we would trigger a refresh here, but we are using mock data fetching for opportunities.
          // To see the new opportunity, we would need to refresh the page if we read from Supabase.
          // For now, we just close the modal.
          console.log("Opportunity added to Supabase!");
        }} 
      />
    </div>
  );
};

export default OpportunitiesBoard;

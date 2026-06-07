// ============================================
// NOVA Community — Main Page
// ============================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommunity } from '../hooks/useCommunity';
import { useAuth } from '../context/AuthContext';
import CommunityDashboard from '../components/community/CommunityDashboard';
import NovaIdSystem from '../components/community/NovaIdSystem';
import DiscussionsForum from '../components/community/DiscussionsForum';
import EventsHub from '../components/community/EventsHub';
import NotificationsCenter from '../components/community/NotificationsCenter';
import ModerationDashboard from '../components/community/ModerationDashboard';
import type { CommunityTab } from '../domain/models/CommunityModels';
// communityConfig mock data no longer needed for search — using live Supabase data
import '../components/community/Community.css';

interface NavTab {
  id: CommunityTab;
  label: string;
  icon: string;
}

const TABS: NavTab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
  { id: 'discussions', label: 'Discussions', icon: 'fas fa-comments' },
  { id: 'events', label: 'Events', icon: 'fas fa-calendar-alt' },
  { id: 'nova-id', label: 'NOVA ID', icon: 'fas fa-id-card' },
  { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
  { id: 'moderation', label: 'Moderation', icon: 'fas fa-shield-alt' },
];

// ── Global Search Result ──
interface SearchResult {
  type: 'discussion' | 'event' | 'roadmap';
  title: string;
  subtitle: string;
  icon: string;
  tab: CommunityTab;
}

const Community: React.FC = (): React.JSX.Element => {
  const state = useCommunity();
  const { isAdmin } = useAuth();
  const [globalSearch, setGlobalSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const visibleTabs = useMemo(() => {
    if (isAdmin) return TABS;
    return TABS.filter(t => t.id !== 'moderation');
  }, [isAdmin]);

  const searchResults = useMemo((): SearchResult[] => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    const results: SearchResult[] = [];

    (state.discussionsState.data || []).forEach(d => {
      if (d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q)) {
        results.push({ type: 'discussion', title: d.title, subtitle: `By ${d.authorName} · ${d.replies.length} replies`, icon: 'fas fa-comments', tab: 'discussions' });
      }
    });

    (state.eventsState.data || []).forEach(e => {
      if (e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)) {
        results.push({ type: 'event', title: e.title, subtitle: `${e.time} · ${e.host}`, icon: 'fas fa-calendar', tab: 'events' });
      }
    });

    const roadmapKeywords: Array<{ title: string; desc: string }> = [
      { title: 'Web Development Roadmap', desc: 'HTML, CSS, JS, React, Node.js' },
      { title: 'AI & Machine Learning Roadmap', desc: 'Python, NumPy, PyTorch, TensorFlow' },
      { title: 'Cybersecurity Roadmap', desc: 'Network Security, Ethical Hacking, CTF' },
    ];
    roadmapKeywords.forEach(r => {
      if (r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q)) {
        results.push({ type: 'roadmap', title: r.title, subtitle: r.desc, icon: 'fas fa-map-signs', tab: 'dashboard' });
      }
    });

    return results.slice(0, 8);
  }, [globalSearch, state.discussionsState.data, state.eventsState.data]);

  const renderTab = (): React.ReactNode => {
    switch (state.activeTab) {
      case 'dashboard':
        return <CommunityDashboard onNavigate={state.setActiveTab} unreadCount={state.unreadCount} discussions={state.discussionsState.data || []} events={state.eventsState.data || []} />;
      case 'discussions':
        return (
          <DiscussionsForum

            discussions={state.discussionsState.data || []}
            filteredDiscussions={state.filteredDiscussions}
            selectedDiscussion={state.selectedDiscussion}
            setSelectedDiscussion={state.setSelectedDiscussion}
            discussionFilter={state.discussionFilter}
            setDiscussionFilter={state.setDiscussionFilter}
            discussionSearch={state.discussionSearch}
            setDiscussionSearch={state.setDiscussionSearch}
            createDiscussion={state.createNewDiscussion}
            likeDiscussion={state.likeDiscussion}
            addReply={state.addReply}
            likeReply={state.likeReply}
          />
        );
      case 'events':
        return (
          <EventsHub
            events={state.eventsState.data || []}
            joinedEvents={state.joinedEvents}
            remindedEvents={state.remindedEvents}
            joinEvent={state.joinEvent}
            remindEvent={state.remindEvent}
            eventFilter={state.eventFilter}
            setEventFilter={state.setEventFilter}
            refreshEvents={state.loadEventsAndInteractions}
          />
        );
      case 'nova-id':
        return (
          <NovaIdSystem
            idStatus={state.idStatus}
            applicationId={state.applicationId}
            submitApplication={state.submitApplication}
            viewAsApproved={state.viewAsApproved}
            setViewAsApproved={state.setViewAsApproved}
          />
        );
      case 'notifications':
        return (
          <NotificationsCenter
            notifications={state.notificationsState.data || []}
            unreadCount={state.unreadCount}
            markAsRead={state.markAsRead}
            markAllAsRead={state.markAllAsRead}
          />
        );
      case 'moderation':
        return isAdmin ? <ModerationDashboard /> : <CommunityDashboard onNavigate={state.setActiveTab} unreadCount={state.unreadCount} discussions={state.discussionsState.data || []} events={state.eventsState.data || []} />;
      default:
        return <CommunityDashboard onNavigate={state.setActiveTab} unreadCount={state.unreadCount} discussions={state.discussionsState.data || []} events={state.eventsState.data || []} />;
    }
  };

  return (
    <div className="cm-page">
      {/* Compact Hero */}
      <section className="cm-hero cm-hero-compact">
        <div className="cm-hero-inner">
          <span className="cm-hero-chip">
            <i className="fas fa-globe" /> NOVA Community
          </span>
          <h1 className="cm-hero-title">
            Your <span className="cm-hero-highlight">Student Ecosystem</span>
          </h1>
          {/* Global Search */}
          <div className="cm-global-search-wrap">
            <div className={`cm-global-search ${showSearch ? 'cm-search-focused' : ''}`}>
              <i className="fas fa-search" />
              <input
                type="text"
                placeholder="Search discussions, events, roadmaps…"
                value={globalSearch}
                onChange={e => { setGlobalSearch(e.target.value); setShowSearch(true); }}
                onFocus={() => setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              />
              {globalSearch && (
                <button className="cm-search-x" onClick={() => { setGlobalSearch(''); setShowSearch(false); }}>
                  <i className="fas fa-times" />
                </button>
              )}
            </div>
            {showSearch && searchResults.length > 0 && (
              <div className="cm-search-results">
                {searchResults.map((r, idx) => (
                  <button
                    key={idx}
                    className="cm-search-result"
                    onClick={() => { state.setActiveTab(r.tab); setGlobalSearch(''); setShowSearch(false); }}
                  >
                    <i className={r.icon} />
                    <div>
                      <span className="cm-sr-title">{r.title}</span>
                      <span className="cm-sr-sub">{r.subtitle}</span>
                    </div>
                    <span className="cm-sr-type">{r.type}</span>
                  </button>
                ))}
              </div>
            )}
            {showSearch && globalSearch.trim() && searchResults.length === 0 && (
              <div className="cm-search-results">
                <div className="cm-search-empty">
                  <i className="fas fa-search" />
                  <span>No results for "{globalSearch}"</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <nav className="cm-tab-nav" role="tablist" aria-label="Community sections">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            className={`cm-tab ${state.activeTab === tab.id ? 'cm-tab-active' : ''}`}
            onClick={() => {
              state.setActiveTab(tab.id);
              state.setSelectedDiscussion(null);
            }}
            role="tab"
            aria-selected={state.activeTab === tab.id}
            id={`cm-tab-${tab.id}`}
          >
            <i className={tab.icon} />
            <span>{tab.label}</span>
            {tab.id === 'notifications' && state.unreadCount > 0 && (
              <span className="cm-tab-badge">{state.unreadCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <section className="cm-tab-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
};

export default Community;

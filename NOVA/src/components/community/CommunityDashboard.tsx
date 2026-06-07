// ============================================
// NOVA Community — Dashboard Component
// ============================================
// Improvements: Personalized Welcome, Activity Heatmap,
// Community Journey, Product Storytelling

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabase/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import {
  memberLevels,
} from '../../configs/communityConfig';
import type { CommunityTab, Discussion, CommunityEvent } from '../../domain/models/CommunityModels';

interface DashboardProps {
  onNavigate: (tab: CommunityTab) => void;
  unreadCount: number;
  discussions: Discussion[];
  events: CommunityEvent[];
}

// ── Animated Counter ──

const AnimatedCounter: React.FC<{ target: number; duration?: number }> = ({
  target,
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

// ── Activity Heatmap (GitHub-style) ──

const ActivityHeatmap: React.FC = () => {
  const weeks = 12;
  const days = 7;
  const heatmapData = useMemo(() => {
    const data: number[][] = [];
    for (let w = 0; w < weeks; w++) {
      const week: number[] = [];
      for (let d = 0; d < days; d++) {
        // Since we don't have an activity tracker backend yet, we'll keep it empty 
        // to reflect a new user's real state, rather than generating random mock data.
        week.push(0);
      }
      data.push(week);
    }
    // Optionally light up the last square (today) to show they just logged in!
    data[weeks - 1][days - 1] = 1;
    return data;
  }, []);

  const getColor = (level: number): string => {
    const colors = [
      'rgba(255,255,255,0.04)',
      'rgba(16,185,129,0.2)',
      'rgba(16,185,129,0.4)',
      'rgba(16,185,129,0.6)',
      'rgba(16,185,129,0.85)',
    ];
    return colors[level];
  };

  return (
    <div className="cm-heatmap">
      <div className="cm-heatmap-label">Activity — Last 12 weeks</div>
      <div className="cm-heatmap-grid">
        {heatmapData.map((week, wi) => (
          <div key={wi} className="cm-heatmap-col">
            {week.map((level, di) => (
              <div
                key={di}
                className="cm-heatmap-cell"
                style={{ background: getColor(level) }}
                title={`${level} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="cm-heatmap-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(l => (
          <div key={l} className="cm-heatmap-cell" style={{ background: getColor(l) }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

// ── Stat Items ──

const statItems: Array<{ key: 'members' | 'discussions' | 'eventsHosted' | 'opportunitiesShared'; label: string; icon: string; color: string }> = [
  { key: 'members', label: 'Members', icon: 'fas fa-users', color: '#10b981' },
  { key: 'discussions', label: 'Discussions', icon: 'fas fa-comments', color: '#3b82f6' },
  { key: 'eventsHosted', label: 'Events Hosted', icon: 'fas fa-calendar', color: '#8b5cf6' },
  { key: 'opportunitiesShared', label: 'Opportunities', icon: 'fas fa-bullseye', color: '#f59e0b' },
];

const CommunityDashboard: React.FC<DashboardProps> = ({ onNavigate, unreadCount, discussions, events }) => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ members: 0, discussions: 0, eventsHosted: 0, opportunitiesShared: 0 });
  const [topContributor, setTopContributor] = useState<{ name: string; points: number } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const [membersRes, discRes, eventsRes, oppsRes, topUserRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('discussions').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('opportunities').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('full_name, points_total').order('points_total', { ascending: false }).limit(1).single()
      ]);
      
      // Log any errors that might be silently causing counts to be 0
      if (membersRes.error) console.error('Error fetching members:', membersRes.error);
      if (discRes.error) console.error('Error fetching discussions:', discRes.error);
      if (eventsRes.error) console.error('Error fetching events:', eventsRes.error);
      if (oppsRes.error) console.error('Error fetching opportunities:', oppsRes.error);

      setStats({
        members: membersRes.count || 0,
        discussions: discRes.count || 0,
        eventsHosted: eventsRes.count || 0,
        opportunitiesShared: oppsRes.count || 0,
      });
      if (topUserRes.data) {
        setTopContributor({ name: topUserRes.data.full_name || 'Anonymous', points: topUserRes.data.points_total || 0 });
      }
    };
    fetchStats();
  }, []);

  const trendingDiscussions = [...discussions]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  const upcomingEvents = events
    .filter(e => e.status === 'upcoming')
    .slice(0, 3);

  const currentLevel = memberLevels.find(l => l.id === (profile?.level || 'explorer'));
  const nextEvent = upcomingEvents[0];
  const points = profile?.points_total || 0;
  
  // Example calculation for next level since it's not directly in DB right now
  const nextLevelAt = 1000; 
  const progressPercent = Math.min((points / nextLevelAt) * 100, 100);

  return (
    <div className="cm-dashboard">
      {/* ── Personalized Welcome ── */}
      <motion.section
        className="cm-welcome"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="cm-welcome-main">
          <div className="cm-welcome-avatar">
            <i className="fas fa-user-astronaut" />
            <span className="cm-welcome-level-dot" style={{ background: currentLevel?.color }} />
          </div>
          <div className="cm-welcome-info">
            <h2 className="cm-welcome-greeting">
              Welcome back, <span className="cm-welcome-id">{profile?.full_name || 'Explorer'}</span> 👋
            </h2>
            <div className="cm-welcome-meta">
              <span className="cm-welcome-level" style={{ color: currentLevel?.color }}>
                <i className={currentLevel?.icon ?? ''} /> {currentLevel?.label}
              </span>
              <span className="cm-welcome-points">
                <i className="fas fa-bolt" /> {points} Points
              </span>
              <span className="cm-welcome-badges">
                <i className="fas fa-award" /> 0 Badges
              </span>
            </div>
          </div>
        </div>

        <div className="cm-welcome-cards">
          <div className="cm-welcome-card" onClick={() => onNavigate('events')}>
            <div className="cm-welcome-card-icon" style={{ color: '#8b5cf6', background: 'rgba(139,92,246,0.12)' }}>
              <i className="fas fa-calendar-check" />
            </div>
            <div className="cm-welcome-card-info">
              <span className="cm-welcome-card-label">Next Event</span>
              <span className="cm-welcome-card-value">
                {nextEvent ? nextEvent.title.length > 20 ? nextEvent.title.slice(0, 20) + '…' : nextEvent.title : 'None scheduled'}
              </span>
            </div>
          </div>
          <div className="cm-welcome-card" onClick={() => onNavigate('notifications')}>
            <div className="cm-welcome-card-icon" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.12)' }}>
              <i className="fas fa-bell" />
            </div>
            <div className="cm-welcome-card-info">
              <span className="cm-welcome-card-label">Unread</span>
              <span className="cm-welcome-card-value">{unreadCount} Notification{unreadCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="cm-welcome-card" onClick={() => onNavigate('nova-id')}>
            <div className="cm-welcome-card-icon" style={{ color: '#10b981', background: 'rgba(16,185,129,0.12)' }}>
              <i className="fas fa-chart-line" />
            </div>
            <div className="cm-welcome-card-info">
              <span className="cm-welcome-card-label">Level Progress</span>
              <span className="cm-welcome-card-value">{Math.round(progressPercent)}%</span>
            </div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap />
      </motion.section>

      {/* ── Stats Grid ── */}
      <section className="cm-stats-grid">
        {statItems.map((stat, idx) => (
          <motion.div
            key={stat.key}
            className="cm-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + idx * 0.08, duration: 0.4 }}
          >
            <div className="cm-stat-icon" style={{ color: stat.color, background: `${stat.color}15` }}>
              <i className={stat.icon} />
            </div>
            <div className="cm-stat-value">
              <AnimatedCounter target={stats[stat.key]} />
            </div>
            <div className="cm-stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* ── Two Column Layout ── */}
      <div className="cm-dash-columns">
        {/* Trending Discussions */}
        <motion.section
          className="cm-dash-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="cm-dash-section-header">
            <h3><i className="fas fa-fire" /> Trending Discussions</h3>
            <button className="cm-view-all-btn" onClick={() => onNavigate('discussions')}>
              View All <i className="fas fa-arrow-right" />
            </button>
          </div>
          <div className="cm-dash-cards">
            {trendingDiscussions.map(disc => (
              <div key={disc.id} className="cm-trending-card" onClick={() => onNavigate('discussions')}>
                <div className="cm-trending-top">
                  <h4 className="cm-trending-title">{disc.title}</h4>
                  {disc.likes > 50 && <span className="cm-badge-hot"><i className="fas fa-fire-alt" /> Hot</span>}
                  {disc.isPinned && <span className="cm-badge-pinned"><i className="fas fa-thumbtack" /></span>}
                </div>
                <div className="cm-trending-meta">
                  <span className="cm-trending-author">
                    <i className="fas fa-user-circle" /> {disc.authorName}
                  </span>
                  <span className="cm-trending-stats">
                    <span><i className="fas fa-reply" /> {disc.replies.length}</span>
                    <span><i className="fas fa-heart" /> {disc.likes}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Upcoming Events */}
        <motion.section
          className="cm-dash-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="cm-dash-section-header">
            <h3><i className="fas fa-calendar-alt" /> Upcoming Events</h3>
            <button className="cm-view-all-btn" onClick={() => onNavigate('events')}>
              View All <i className="fas fa-arrow-right" />
            </button>
          </div>
          <div className="cm-dash-cards">
            {upcomingEvents.map(evt => {
              const daysUntil = Math.ceil((new Date(evt.date).getTime() - Date.now()) / 86400000);
              const fillPercent = (evt.participants / evt.maxParticipants) * 100;
              return (
                <div key={evt.id} className="cm-event-preview-card" onClick={() => onNavigate('events')}>
                  <div className="cm-event-preview-date">
                    <span className="cm-event-day">{new Date(evt.date).getDate()}</span>
                    <span className="cm-event-month">{new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="cm-event-preview-info">
                    <h4>{evt.title}</h4>
                    <span className="cm-event-preview-time"><i className="fas fa-clock" /> {evt.time}</span>
                    <div className="cm-event-fill-bar">
                      <div className="cm-event-fill-track">
                        <div className="cm-event-fill-progress" style={{ width: `${fillPercent}%` }} />
                      </div>
                      <span className="cm-event-fill-label">{evt.participants}/{evt.maxParticipants}</span>
                    </div>
                  </div>
                  <div className="cm-event-preview-urgency">
                    {daysUntil <= 0 ? (
                      <span className="cm-urgency-today">Today!</span>
                    ) : daysUntil === 1 ? (
                      <span className="cm-urgency-tomorrow">Tomorrow</span>
                    ) : (
                      <span className="cm-urgency-days">{daysUntil}d</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* ── Community Highlights ── */}
      <motion.section
        className="cm-highlights"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <h3 className="cm-highlights-title"><i className="fas fa-award" /> Community Highlights</h3>
        <div className="cm-highlights-grid">
            <div className="cm-highlight-card">
              <div className="cm-highlight-icon"><i className="fas fa-trophy" style={{color: '#f59e0b'}} /></div>
              <span className="cm-highlight-label" style={{color: '#10b981'}}>TOP CONTRIBUTOR</span>
              <h4 className="cm-highlight-value">{topContributor?.name || 'Loading...'}</h4>
              <p className="cm-highlight-sub">{topContributor ? `${topContributor.points} points earned` : '...'}</p>
            </div>
            
            <div className="cm-highlight-card">
              <div className="cm-highlight-icon"><i className="fas fa-fire" style={{color: '#f59e0b'}} /></div>
              <span className="cm-highlight-label" style={{color: '#10b981'}}>MOST ACTIVE DISCUSSION</span>
              <h4 className="cm-highlight-value">{trendingDiscussions[0]?.title || 'No discussions yet'}</h4>
              <p className="cm-highlight-sub">{trendingDiscussions[0] ? `${trendingDiscussions[0].likes} likes` : 'Be the first to post!'}</p>
            </div>

            <div className="cm-highlight-card">
              <div className="cm-highlight-icon"><i className="fas fa-star" style={{color: '#f59e0b'}} /></div>
              <span className="cm-highlight-label" style={{color: '#10b981'}}>EVENT OF THE WEEK</span>
              <h4 className="cm-highlight-value">{nextEvent?.title || 'No upcoming events'}</h4>
              <p className="cm-highlight-sub">{nextEvent ? `${nextEvent.participants} participants joined` : 'Host one today!'}</p>
            </div>
        </div>
      </motion.section>

      {/* ── Community Journey ── */}
      <motion.section
        className="cm-journey"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.4 }}
      >
        <h3 className="cm-journey-title"><i className="fas fa-route" /> Community Journey</h3>
        <div className="cm-journey-timeline">
          {memberLevels.map((level, idx) => {
            const userLevelId = profile?.level || 'explorer';
            const isActive = level.id === userLevelId;
            const isPast = idx < memberLevels.findIndex(l => l.id === userLevelId);
            return (
              <div key={level.id} className={`cm-journey-step ${isActive ? 'cm-journey-active' : ''} ${isPast ? 'cm-journey-past' : ''}`}>
                <div className="cm-journey-node" style={isActive || isPast ? { borderColor: level.color, background: isPast ? `${level.color}30` : `${level.color}20` } : undefined}>
                  <i className={level.icon} style={isActive || isPast ? { color: level.color } : undefined} />
                </div>
                <div className="cm-journey-info">
                  <span className="cm-journey-label" style={isActive ? { color: level.color } : undefined}>{level.label}</span>
                  <span className="cm-journey-desc">{level.description}</span>
                  <span className="cm-journey-pts">{level.minPoints}+ pts</span>
                </div>
                {isActive && <span className="cm-journey-you">You are here</span>}
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ── Product Story ── */}
      <motion.section
        className="cm-story"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <div className="cm-story-badge"><i className="fas fa-lightbulb" /> Why NOVA Platform?</div>
        <p className="cm-story-text">
          Most student club websites are event-centric — students visit during registrations and leave.
          <strong> NOVA Platform</strong> transforms NOVA into a year-round ecosystem where MVSR students can
          <em> learn, connect, collaborate, attend events, discover opportunities,
          build reputation, and grow together.</em>
        </p>
        <div className="cm-story-pillars">
          {[
            { icon: 'fas fa-rocket', label: 'Launchpad', desc: 'Roadmaps & Career Growth' },
            { icon: 'fas fa-users', label: 'Community', desc: 'Discussions & Events' },
            { icon: 'fas fa-id-card', label: 'Identity', desc: 'NOVA ID & Reputation' },
            { icon: 'fas fa-trophy', label: 'Gamification', desc: 'Badges, Levels & Points' },
          ].map(pillar => (
            <div key={pillar.label} className="cm-story-pillar">
              <i className={pillar.icon} />
              <strong>{pillar.label}</strong>
              <span>{pillar.desc}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Quick Actions ── */}
      <motion.section
        className="cm-quick-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.4 }}
      >
        <button className="cm-action-card" onClick={() => onNavigate('nova-id')}>
          <i className="fas fa-id-card" />
          <span>Get NOVA ID</span>
        </button>
        <button className="cm-action-card" onClick={() => onNavigate('discussions')}>
          <i className="fas fa-plus-circle" />
          <span>Start Discussion</span>
        </button>
        <button className="cm-action-card" onClick={() => onNavigate('events')}>
          <i className="fas fa-calendar-plus" />
          <span>Browse Events</span>
        </button>
        <button className="cm-action-card" onClick={() => onNavigate('notifications')}>
          <i className="fas fa-bell" />
          <span>Notifications</span>
        </button>
      </motion.section>
    </div>
  );
};

export default CommunityDashboard;

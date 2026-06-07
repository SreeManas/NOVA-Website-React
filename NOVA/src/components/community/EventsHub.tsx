// ============================================
// NOVA Community — Events Hub Component
// ============================================
// Improvements: Days remaining, attendance visualization bar,
// Popular/Limited badges, cross-module roadmap suggestions

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { CommunityEvent } from '../../domain/models/CommunityModels';
import { eventTypeLabels } from '../../configs/communityConfig';
import { useAuth } from '../../context/AuthContext';
import AddEventModal from './AddEventModal';

interface EventsHubProps {
  events: CommunityEvent[];
  joinedEvents: Record<string, boolean>;
  remindedEvents: Record<string, boolean>;
  joinEvent: (id: string) => void;
  remindEvent: (id: string) => void;
  eventFilter: string;
  setEventFilter: (f: string) => void;
  refreshEvents?: () => void;
}

// Cross-module: roadmap suggestions for events
const eventRoadmapSuggestions: Record<string, { roadmap: string; link: string }> = {
  'AI Study Circle': { roadmap: 'AI & Machine Learning Roadmap', link: '/launchpad' },
  'React Hackathon Prep': { roadmap: 'Web Development Roadmap', link: '/launchpad' },
  'CTF Beginner Workshop': { roadmap: 'Cybersecurity Roadmap', link: '/launchpad' },
};

const EventsHub: React.FC<EventsHubProps> = ({
  events,
  joinedEvents,
  remindedEvents,
  joinEvent,
  remindEvent,
  eventFilter,
  setEventFilter,
  refreshEvents,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isAdmin } = useAuth();

  // Sync selectedEvent with the latest data from the events prop
  React.useEffect(() => {
    if (selectedEvent) {
      const updatedEvent = events.find(e => e.id === selectedEvent.id);
      if (updatedEvent && updatedEvent.participants !== selectedEvent.participants) {
        setSelectedEvent(updatedEvent);
      }
    }
  }, [events, selectedEvent]);

  const filteredEvents = events.filter(evt => {
    if (eventFilter === 'all') return true;
    if (eventFilter === 'upcoming') return evt.status === 'upcoming';
    if (eventFilter === 'completed') return evt.status === 'completed';
    return evt.type === eventFilter;
  });

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntil = (dateStr: string): number => {
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  };

  const getUrgencyLabel = (days: number): { text: string; className: string } | null => {
    if (days <= 0) return { text: 'Today!', className: 'cm-urgency-today' };
    if (days === 1) return { text: 'Tomorrow', className: 'cm-urgency-tomorrow' };
    if (days <= 3) return { text: `${days} days left`, className: 'cm-urgency-soon' };
    return null;
  };

  const eventFilters = [
    { id: 'all', label: 'All Events', icon: 'fas fa-globe' },
    { id: 'upcoming', label: 'Upcoming', icon: 'fas fa-clock' },
    { id: 'completed', label: 'Past', icon: 'fas fa-check-circle' },
    ...Object.entries(eventTypeLabels).map(([id, meta]) => ({
      id,
      label: meta.label,
      icon: meta.icon,
    })),
  ];

  // ── Event Detail View ──
  if (selectedEvent) {
    const typeMeta = eventTypeLabels[selectedEvent.type];
    const isJoined = joinedEvents[selectedEvent.id];
    const isReminded = remindedEvents[selectedEvent.id];
    const spotsLeft = selectedEvent.maxParticipants - selectedEvent.participants;
    const fillPercent = (selectedEvent.participants / selectedEvent.maxParticipants) * 100;
    const daysUntil = getDaysUntil(selectedEvent.date);
    const suggestion = eventRoadmapSuggestions[selectedEvent.title];

    return (
      <motion.div
        className="cm-event-detail"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button className="cm-back-btn" onClick={() => setSelectedEvent(null)}>
          <i className="fas fa-arrow-left" /> Back to Events
        </button>

        <div className="cm-event-detail-card">
          <div className="cm-event-detail-top">
            <span
              className="cm-event-type-badge"
              style={{ color: typeMeta.color, background: `${typeMeta.color}15`, borderColor: `${typeMeta.color}30` }}
            >
              <i className={typeMeta.icon} /> {typeMeta.label}
            </span>
            <div className="cm-event-detail-badges">
              {selectedEvent.status === 'upcoming' && daysUntil <= 3 && (
                <span className={`cm-urgency-badge ${daysUntil <= 0 ? 'cm-urgency-today' : daysUntil === 1 ? 'cm-urgency-tomorrow' : 'cm-urgency-soon'}`}>
                  <i className="fas fa-clock" /> {daysUntil <= 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                </span>
              )}
              {fillPercent > 75 && <span className="cm-badge-popular"><i className="fas fa-fire" /> Popular</span>}
              <span className={`cm-event-status cm-status-${selectedEvent.status}`}>
                {selectedEvent.status === 'upcoming' ? '● Upcoming' : '✓ Completed'}
              </span>
            </div>
          </div>

          <h2 className="cm-event-detail-title">{selectedEvent.title}</h2>

          <div className="cm-event-detail-info">
            <div className="cm-event-info-item">
              <i className="fas fa-calendar" />
              <span>{formatDate(selectedEvent.date)}</span>
            </div>
            <div className="cm-event-info-item">
              <i className="fas fa-clock" />
              <span>{selectedEvent.time}</span>
            </div>
            <div className="cm-event-info-item">
              <i className="fas fa-user" />
              <span>Hosted by {selectedEvent.host}</span>
            </div>
            <div className="cm-event-info-item">
              <i className="fas fa-user-friends" />
              <span>{selectedEvent.participants}/{selectedEvent.maxParticipants} participants</span>
            </div>
          </div>

          {/* Attendance Visualization */}
          <div className="cm-attendance-bar">
            <div className="cm-attendance-header">
              <span className="cm-attendance-label">Attendance</span>
              <span className="cm-attendance-count">{selectedEvent.participants} / {selectedEvent.maxParticipants} Joined</span>
            </div>
            <div className="cm-attendance-track">
              <motion.div
                className="cm-attendance-fill"
                initial={{ width: 0 }}
                animate={{ width: `${fillPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ background: fillPercent > 90 ? '#ef4444' : fillPercent > 75 ? '#f59e0b' : '#10b981' }}
              />
            </div>
          </div>

          <div className="cm-event-detail-desc">
            <h4>About this event</h4>
            <p>{selectedEvent.description}</p>
          </div>

          <div className="cm-event-detail-agenda">
            {selectedEvent.agenda && selectedEvent.agenda.length > 0 && (
              <>
                <h4><i className="fas fa-list-ol" /> Agenda</h4>
                <ul>
                  {selectedEvent.agenda.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="cm-event-detail-tags">
            {selectedEvent.tags.map(tag => (
              <span key={tag} className="cm-event-tag">{tag}</span>
            ))}
          </div>

          {selectedEvent.status === 'upcoming' && (
            <div className="cm-event-detail-actions">
              <button
                className={`cm-join-btn ${isJoined ? 'cm-joined' : ''}`}
                onClick={() => joinEvent(selectedEvent.id)}
                disabled={spotsLeft <= 0 && !isJoined}
              >
                <i className={isJoined ? 'fas fa-check' : 'fas fa-plus'} />
                {isJoined ? 'Joined' : spotsLeft <= 0 ? 'Full' : 'Join Event'}
              </button>
              <button
                className={`cm-remind-btn ${isReminded ? 'cm-reminded' : ''}`}
                onClick={() => remindEvent(selectedEvent.id)}
              >
                <i className={isReminded ? 'fas fa-bell' : 'far fa-bell'} />
                {isReminded ? 'Reminder Set' : 'Remind Me'}
              </button>
            </div>
          )}

          {spotsLeft > 0 && spotsLeft <= 10 && selectedEvent.status === 'upcoming' && (
            <div className="cm-event-spots-warning">
              <i className="fas fa-exclamation-circle" />
              Only {spotsLeft} spots left!
            </div>
          )}
        </div>

        {/* Cross-Module: Suggested Roadmap */}
        {suggestion && (
          <motion.div
            className="cm-cross-module"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="cm-cross-icon"><i className="fas fa-map-signs" /></div>
            <div className="cm-cross-info">
              <span className="cm-cross-label">Suggested Learning Path</span>
              <span className="cm-cross-value">{suggestion.roadmap}</span>
            </div>
            <a href={suggestion.link} className="cm-cross-btn">
              <i className="fas fa-external-link-alt" /> Open in Launchpad
            </a>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // ── Event List View ──
  return (
    <div className="cm-events">
      <div className="cm-events-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h3><i className="fas fa-calendar-alt" /> Events</h3>
          {isAdmin && (
            <button className="cm-join-btn" onClick={() => setIsAddModalOpen(true)} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
              <i className="fas fa-plus" /> Add Event
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="cm-events-filters">
        {eventFilters.map(f => (
          <button
            key={f.id}
            className={`cm-cat-pill ${eventFilter === f.id ? 'cm-cat-active' : ''}`}
            onClick={() => setEventFilter(f.id)}
          >
            <i className={f.icon} /> {f.label}
          </button>
        ))}
      </div>

      {/* Event Cards Grid */}
      <div className="cm-events-grid">
        {filteredEvents.length === 0 ? (
          <div className="cm-empty-state cm-empty-polished">
            <i className="fas fa-calendar-times" />
            <h3>No events found</h3>
            <p>Try adjusting your filters or check back later for new events.</p>
            <button className="cm-empty-cta" onClick={() => setEventFilter('all')}>
              <i className="fas fa-globe" /> Show All Events
            </button>
          </div>
        ) : (
          filteredEvents.map((evt, idx) => {
            const typeMeta = eventTypeLabels[evt.type];
            const isJoined = joinedEvents[evt.id];
            const spotsLeft = evt.maxParticipants - evt.participants;
            const fillPercent = (evt.participants / evt.maxParticipants) * 100;
            const daysUntil = getDaysUntil(evt.date);
            const urgency = evt.status === 'upcoming' ? getUrgencyLabel(daysUntil) : null;

            return (
              <motion.div
                key={evt.id}
                className={`cm-event-card ${evt.status === 'completed' ? 'cm-event-past' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                onClick={() => setSelectedEvent(evt)}
              >
                <div className="cm-event-card-top">
                  <span
                    className="cm-event-type-pill"
                    style={{ color: typeMeta.color, background: `${typeMeta.color}12` }}
                  >
                    <i className={typeMeta.icon} /> {typeMeta.label}
                  </span>
                  <div className="cm-event-card-badges">
                    {urgency && (
                      <span className={`cm-urgency-badge cm-urgency-sm ${urgency.className}`}>{urgency.text}</span>
                    )}
                    {fillPercent > 75 && evt.status === 'upcoming' && (
                      <span className="cm-badge-popular cm-badge-sm"><i className="fas fa-fire" /></span>
                    )}
                    <span className={`cm-event-status-dot cm-dot-${evt.status}`} />
                  </div>
                </div>

                <h4 className="cm-event-card-title">{evt.title}</h4>

                <div className="cm-event-card-details">
                  <span><i className="fas fa-calendar" /> {formatDate(evt.date)}</span>
                  <span><i className="fas fa-clock" /> {evt.time}</span>
                </div>

                {/* Attendance Bar */}
                <div className="cm-event-card-attendance">
                  <div className="cm-mini-bar-track">
                    <div
                      className="cm-mini-bar-fill"
                      style={{
                        width: `${fillPercent}%`,
                        background: fillPercent > 90 ? '#ef4444' : fillPercent > 75 ? '#f59e0b' : '#10b981',
                      }}
                    />
                  </div>
                  <span className="cm-mini-bar-label">
                    {evt.participants}/{evt.maxParticipants}
                    {spotsLeft <= 10 && spotsLeft > 0 && evt.status === 'upcoming' && (
                      <span className="cm-spots-left"> · {spotsLeft} left</span>
                    )}
                  </span>
                </div>

                <div className="cm-event-card-footer">
                  <span className="cm-event-host">
                    <i className="fas fa-user" /> {evt.host}
                  </span>
                </div>

                {evt.status === 'upcoming' && (
                  <button
                    className={`cm-event-join-quick ${isJoined ? 'cm-joined' : ''}`}
                    onClick={e => {
                      e.stopPropagation();
                      joinEvent(evt.id);
                    }}
                  >
                    {isJoined ? (
                      <><i className="fas fa-check" /> Joined</>
                    ) : spotsLeft <= 0 ? (
                      <><i className="fas fa-ban" /> Full</>
                    ) : (
                      <><i className="fas fa-plus" /> Join</>
                    )}
                  </button>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      <AddEventModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onEventAdded={() => {
          if (refreshEvents) refreshEvents();
        }} 
      />
    </div>
  );
};

export default EventsHub;

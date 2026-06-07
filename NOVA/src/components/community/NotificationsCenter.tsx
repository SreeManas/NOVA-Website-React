// ============================================
// NOVA Community — Notifications Center Component
// ============================================
// Improvements: Category filters, priority levels,
// Polished empty states, visual indicators

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Notification, NotificationType } from '../../domain/models/CommunityModels';

interface NotificationsProps {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const notificationIcons: Record<NotificationType, { icon: string; color: string; category: string; priority: 'high' | 'normal' | 'info' }> = {
  'event-reminder': { icon: 'fas fa-calendar-check', color: '#8b5cf6', category: 'events', priority: 'high' },
  'id-approved': { icon: 'fas fa-id-card', color: '#10b981', category: 'system', priority: 'high' },
  'discussion-reply': { icon: 'fas fa-reply', color: '#3b82f6', category: 'community', priority: 'normal' },
  'new-opportunity': { icon: 'fas fa-bullseye', color: '#f59e0b', category: 'community', priority: 'normal' },
  'badge-earned': { icon: 'fas fa-award', color: '#ec4899', category: 'achievements', priority: 'info' },
  'level-up': { icon: 'fas fa-arrow-up', color: '#06b6d4', category: 'achievements', priority: 'info' },
};

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'fas fa-inbox' },
  { id: 'events', label: 'Events', icon: 'fas fa-calendar' },
  { id: 'community', label: 'Community', icon: 'fas fa-users' },
  { id: 'achievements', label: 'Achievements', icon: 'fas fa-trophy' },
  { id: 'system', label: 'System', icon: 'fas fa-cog' },
];

const priorityMeta: Record<string, { label: string; color: string; icon: string }> = {
  high: { label: 'Important', color: '#ef4444', icon: 'fas fa-exclamation-circle' },
  normal: { label: 'Normal', color: '#3b82f6', icon: 'fas fa-info-circle' },
  info: { label: 'Info', color: '#94a3b8', icon: 'fas fa-bell' },
};

const NotificationsCenter: React.FC<NotificationsProps> = ({
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
}) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'all') return notifications;
    return notifications.filter(n => notificationIcons[n.type].category === activeCategory);
  }, [notifications, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    notifications.forEach(n => {
      if (!n.isRead) {
        counts.all = (counts.all || 0) + 1;
        const cat = notificationIcons[n.type].category;
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [notifications]);

  const formatTimeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  return (
    <div className="cm-notifications">
      <div className="cm-notif-header">
        <h3>
          <i className="fas fa-bell" /> Notifications
          {unreadCount > 0 && (
            <span className="cm-notif-badge">{unreadCount}</span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button className="cm-mark-all-btn" onClick={markAllAsRead}>
            <i className="fas fa-check-double" /> Mark all read
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="cm-notif-categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`cm-notif-cat-pill ${activeCategory === cat.id ? 'cm-cat-active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <i className={cat.icon} />
            <span>{cat.label}</span>
            {(categoryCounts[cat.id] ?? 0) > 0 && (
              <span className="cm-notif-cat-count">{categoryCounts[cat.id]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="cm-notif-list">
        {filteredNotifications.length === 0 ? (
          <div className="cm-empty-state cm-empty-polished">
            <i className="fas fa-bell-slash" />
            <h3>{activeCategory === 'all' ? 'No notifications' : `No ${activeCategory} notifications`}</h3>
            <p>{activeCategory === 'all' ? "You're all caught up!" : 'Try checking another category.'}</p>
            {activeCategory !== 'all' && (
              <button className="cm-empty-cta" onClick={() => setActiveCategory('all')}>
                <i className="fas fa-inbox" /> Show All
              </button>
            )}
          </div>
        ) : (
          filteredNotifications.map((notif, idx) => {
            const iconMeta = notificationIcons[notif.type];
            const pMeta = priorityMeta[iconMeta.priority];
            return (
              <motion.div
                key={notif.id}
                className={`cm-notif-card ${notif.isRead ? 'cm-notif-read' : 'cm-notif-unread'} cm-notif-${iconMeta.priority}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => markAsRead(notif.id)}
              >
                {/* Priority indicator */}
                {iconMeta.priority === 'high' && !notif.isRead && (
                  <div className="cm-notif-priority-bar" style={{ background: pMeta.color }} />
                )}
                <div
                  className="cm-notif-icon"
                  style={{ color: iconMeta.color, background: `${iconMeta.color}15` }}
                >
                  <i className={iconMeta.icon} />
                </div>
                <div className="cm-notif-content">
                  <div className="cm-notif-title-row">
                    <h4 className="cm-notif-title">{notif.title}</h4>
                    {iconMeta.priority === 'high' && !notif.isRead && (
                      <span className="cm-notif-priority-tag" style={{ color: pMeta.color, background: `${pMeta.color}15` }}>
                        <i className={pMeta.icon} /> {pMeta.label}
                      </span>
                    )}
                  </div>
                  <p className="cm-notif-message">{notif.message}</p>
                  <span className="cm-notif-time">{formatTimeAgo(notif.timestamp)}</span>
                </div>
                {!notif.isRead && <div className="cm-notif-dot" />}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsCenter;

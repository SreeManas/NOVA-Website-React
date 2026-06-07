// ============================================
// NOVA Community — Discussions Forum Component
// ============================================
// Improvements: Author avatars, contributor badges, trending/solved/hot badges,
// Enhanced category display, cross-module roadmap suggestions

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Discussion, DiscussionCategory } from '../../domain/models/CommunityModels';
import { discussionCategories } from '../../configs/communityConfig';

interface DiscussionsProps {
  discussions: Discussion[];
  filteredDiscussions: Discussion[];
  selectedDiscussion: Discussion | null;
  setSelectedDiscussion: (d: Discussion | null) => void;
  discussionFilter: string;
  setDiscussionFilter: (f: string) => void;
  discussionSearch: string;
  setDiscussionSearch: (s: string) => void;
  createDiscussion: (title: string, category: DiscussionCategory, content: string) => void;
  likeDiscussion: (id: string) => void;
  addReply: (discussionId: string, content: string) => Promise<void>;
  likeReply: (id: string) => Promise<void>;
}

// Cross-module: roadmap suggestions based on discussion category
const roadmapSuggestions: Record<string, { roadmap: string; link: string }> = {
  'web-dev': { roadmap: 'Web Development Roadmap', link: '/launchpad' },
  'dsa': { roadmap: 'DSA & Competitive Programming', link: '/launchpad' },
  'ai-ml': { roadmap: 'AI & Machine Learning Roadmap', link: '/launchpad' },
  'career': { roadmap: 'Career Navigator', link: '/launchpad' },
  'open-source': { roadmap: 'Open Source Contribution Guide', link: '/launchpad' },
};

const DiscussionsForum: React.FC<DiscussionsProps> = ({
  filteredDiscussions,
  selectedDiscussion,
  setSelectedDiscussion,
  discussionFilter,
  setDiscussionFilter,
  discussionSearch,
  setDiscussionSearch,
  createDiscussion,
  likeDiscussion,
  addReply,
  likeReply,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DiscussionCategory>('general');
  const [newContent, setNewContent] = useState('');

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Sync selectedDiscussion with latest parent data (e.g. after likeDiscussion refetch)
  useEffect(() => {
    if (selectedDiscussion) {
      const updated = filteredDiscussions.find(d => d.id === selectedDiscussion.id);
      if (updated && updated !== selectedDiscussion) {
        setSelectedDiscussion(updated);
      }
    }
  }, [filteredDiscussions]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const submitReply = async () => {
    if (!selectedDiscussion || !replyContent.trim()) return;
    setSubmittingReply(true);
    try {
      await addReply(selectedDiscussion.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
      
      // Update local state optimistically or rely on parent fetch
      setSelectedDiscussion({
        ...selectedDiscussion,
        replies: [
          ...selectedDiscussion.replies,
          { id: Date.now().toString(), authorId: 'You', authorName: 'You', content: replyContent, createdAt: new Date().toISOString(), likes: 0 }
        ]
      });
    } catch (err) {
      console.error(err);
      alert('Failed to post reply.');
    } finally {
      setSubmittingReply(false);
    }
  };

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

  const getCategoryMeta = (catId: string) => {
    return discussionCategories.find(c => c.id === catId) ?? discussionCategories[0];
  };

  const getAuthorLevel = (authorId: string): { label: string; color: string } => {
    // Derive level from NOVA ID hash for consistent display
    const hash = authorId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const levels = [
      { label: 'Explorer', color: '#94a3b8' },
      { label: 'Contributor', color: '#10b981' },
      { label: 'Mentor', color: '#f59e0b' },
    ];
    return levels[hash % levels.length];
  };

  const handleCreateSubmit = () => {
    if (newTitle.trim() && newContent.trim()) {
      createDiscussion(newTitle, newCategory, newContent);
      setNewTitle('');
      setNewCategory('general');
      setNewContent('');
      setShowCreateModal(false);
    }
  };

  // ── Discussion Detail View ──
  if (selectedDiscussion) {
    const catMeta = getCategoryMeta(selectedDiscussion.category);
    const authorLevel = getAuthorLevel(selectedDiscussion.authorId);
    const suggestion = roadmapSuggestions[selectedDiscussion.category];

    return (
      <motion.div
        className="cm-disc-detail"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <button className="cm-back-btn" onClick={() => setSelectedDiscussion(null)}>
          <i className="fas fa-arrow-left" /> Back to Discussions
        </button>

        <div className="cm-disc-detail-card">
          <div className="cm-disc-detail-header">
            <span
              className="cm-disc-category-tag"
              style={{ color: catMeta.color, background: `${catMeta.color}15`, borderColor: `${catMeta.color}30` }}
            >
              <i className={catMeta.icon} /> {catMeta.label}
            </span>
            {selectedDiscussion.isPinned && (
              <span className="cm-disc-pinned"><i className="fas fa-thumbtack" /> Pinned</span>
            )}
            {selectedDiscussion.likes > 50 && (
              <span className="cm-badge-hot"><i className="fas fa-fire-alt" /> Hot</span>
            )}
          </div>

          <h2 className="cm-disc-detail-title">{selectedDiscussion.title}</h2>

          <div className="cm-disc-detail-author">
            <div className="cm-disc-avatar-wrap">
              <div className="cm-disc-avatar"><i className="fas fa-user-circle" /></div>
              <span className="cm-author-level-dot" style={{ background: authorLevel.color }} />
            </div>
            <div>
              <span className="cm-disc-author-name">{selectedDiscussion.authorName}</span>
              <div className="cm-disc-author-meta">
                <span className="cm-disc-author-id">{selectedDiscussion.authorId}</span>
                <span className="cm-author-level-tag" style={{ color: authorLevel.color, background: `${authorLevel.color}15` }}>
                  {authorLevel.label}
                </span>
              </div>
            </div>
            <span className="cm-disc-time">{formatTimeAgo(selectedDiscussion.createdAt)}</span>
          </div>

          <div className="cm-disc-detail-content">
            {selectedDiscussion.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className="cm-disc-detail-actions">
            <button
              className="cm-disc-action-btn"
              onClick={() => likeDiscussion(selectedDiscussion.id)}
            >
              <i className="fas fa-heart" /> {selectedDiscussion.likes}
            </button>
            <button className="cm-disc-action-btn" onClick={() => setIsReplying(true)}>
              <i className="fas fa-reply" /> {selectedDiscussion.replies.length} Replies
            </button>
            <button className="cm-disc-action-btn" onClick={handleShare}>
              <i className="fas fa-share-alt" /> Share
            </button>
          </div>
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
              <span className="cm-cross-label">Recommended Learning Path</span>
              <span className="cm-cross-value">{suggestion.roadmap}</span>
            </div>
            <a href={suggestion.link} className="cm-cross-btn">
              <i className="fas fa-external-link-alt" /> Open in Launchpad
            </a>
          </motion.div>
        )}

        {/* Replies */}
        <div className="cm-disc-replies">
          <h3 className="cm-replies-title">
            Replies ({selectedDiscussion.replies.length})
          </h3>
          {selectedDiscussion.replies.length === 0 ? (
            <div className="cm-empty-state cm-empty-polished">
              <i className="fas fa-comment-slash" />
              <h3>No replies yet</h3>
              <p>Be the first to share your thoughts!</p>
              <button className="cm-empty-cta" onClick={() => setIsReplying(true)}>
                <i className="fas fa-reply" /> Write a Reply
              </button>
            </div>
          ) : (
            selectedDiscussion.replies.map((reply, idx) => {
              const replyLevel = getAuthorLevel(reply.authorId);
              return (
                <motion.div
                  key={reply.id}
                  className="cm-reply-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <div className="cm-reply-header">
                    <div className="cm-reply-author">
                      <div className="cm-reply-avatar-wrap">
                        <i className="fas fa-user-circle" />
                        <span className="cm-author-level-dot cm-dot-sm" style={{ background: replyLevel.color }} />
                      </div>
                      <span className="cm-reply-name">{reply.authorName}</span>
                      <span className="cm-author-level-tag cm-tag-sm" style={{ color: replyLevel.color, background: `${replyLevel.color}15` }}>
                        {replyLevel.label}
                      </span>
                    </div>
                    <span className="cm-reply-time">{formatTimeAgo(reply.createdAt)}</span>
                  </div>
                  <p className="cm-reply-content">{reply.content}</p>
                  <div className="cm-reply-actions">
                    <button className="cm-reply-like" onClick={() => {
                      likeReply(reply.id);
                      // Optimistic update via immutable state (not direct mutation)
                      setSelectedDiscussion({
                        ...selectedDiscussion,
                        replies: selectedDiscussion.replies.map(r =>
                          r.id === reply.id ? { ...r, likes: r.likes + 1 } : r
                        )
                      });
                    }}>
                      <i className="fas fa-heart" /> {reply.likes}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Reply Input Form */}
        <AnimatePresence>
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="cm-reply-input-wrapper"
              style={{ marginTop: '2rem' }}
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="cm-input"
                style={{ minHeight: '100px', resize: 'vertical' }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button
                  className="cm-btn-secondary"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent('');
                  }}
                  disabled={submittingReply}
                >
                  Cancel
                </button>
                <button
                  className="cm-btn-primary"
                  onClick={submitReply}
                  disabled={!replyContent.trim() || submittingReply}
                >
                  {submittingReply ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ── Discussion List View ──
  return (
    <div className="cm-discussions">
      {/* Header */}
      <div className="cm-disc-header">
        <h3><i className="fas fa-comments" /> Discussions</h3>
        <button className="cm-create-btn" onClick={() => setShowCreateModal(true)}>
          <i className="fas fa-plus" /> New Discussion
        </button>
      </div>

      {/* Search */}
      <div className="cm-disc-search">
        <i className="fas fa-search" />
        <input
          type="text"
          placeholder="Search discussions..."
          value={discussionSearch}
          onChange={e => setDiscussionSearch(e.target.value)}
        />
        {discussionSearch && (
          <button className="cm-search-clear" onClick={() => setDiscussionSearch('')}>
            <i className="fas fa-times" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="cm-disc-categories">
        {discussionCategories.map(cat => (
          <button
            key={cat.id}
            className={`cm-cat-pill ${discussionFilter === cat.id ? 'cm-cat-active' : ''}`}
            onClick={() => setDiscussionFilter(cat.id)}
            style={discussionFilter === cat.id ? { borderColor: cat.color, color: cat.color, background: `${cat.color}15` } : undefined}
          >
            <i className={cat.icon} /> {cat.label}
          </button>
        ))}
      </div>

      {/* Discussion Cards */}
      <div className="cm-disc-list">
        {filteredDiscussions.length === 0 ? (
          <div className="cm-empty-state cm-empty-polished">
            <i className="fas fa-search" />
            <h3>No discussions found</h3>
            <p>Try adjusting your search or filters, or start a new discussion.</p>
            <button className="cm-empty-cta" onClick={() => setShowCreateModal(true)}>
              <i className="fas fa-plus" /> Create Discussion
            </button>
          </div>
        ) : (
          filteredDiscussions.map((disc, idx) => {
            const catMeta = getCategoryMeta(disc.category);
            const authorLevel = getAuthorLevel(disc.authorId);
            const isHot = disc.likes > 50;
            const isTrending = disc.replies.length > 3;

            return (
              <motion.div
                key={disc.id}
                className="cm-disc-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedDiscussion(disc)}
              >
                {/* Avatar Column */}
                <div className="cm-disc-card-avatar">
                  <div className="cm-disc-card-avatar-circle" style={{ borderColor: `${authorLevel.color}40` }}>
                    <i className="fas fa-user" />
                  </div>
                  <span className="cm-disc-card-level" style={{ color: authorLevel.color }}>{authorLevel.label.charAt(0)}</span>
                </div>

                <div className="cm-disc-card-left">
                  <div className="cm-disc-card-title-row">
                    {disc.isPinned && <span className="cm-disc-pin"><i className="fas fa-thumbtack" /></span>}
                    <h4 className="cm-disc-card-title">{disc.title}</h4>
                    {isHot && <span className="cm-badge-hot"><i className="fas fa-fire-alt" /> Hot</span>}
                    {isTrending && !isHot && <span className="cm-badge-trending"><i className="fas fa-chart-line" /> Trending</span>}
                  </div>
                  <div className="cm-disc-card-meta">
                    <span
                      className="cm-disc-card-cat"
                      style={{ color: catMeta.color, background: `${catMeta.color}12` }}
                    >
                      <i className={catMeta.icon} /> {catMeta.label}
                    </span>
                    <span className="cm-disc-card-author">
                      {disc.authorName}
                      <span className="cm-author-level-tag cm-tag-sm" style={{ color: authorLevel.color, background: `${authorLevel.color}12` }}>
                        {authorLevel.label}
                      </span>
                    </span>
                    <span className="cm-disc-card-time">
                      {formatTimeAgo(disc.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="cm-disc-card-right">
                  <span className="cm-disc-card-stat">
                    <i className="fas fa-reply" /> {disc.replies.length}
                  </span>
                  <span className="cm-disc-card-stat">
                    <i className="fas fa-heart" /> {disc.likes}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create Discussion Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="cm-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="cm-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="cm-modal-header">
                <h3><i className="fas fa-plus-circle" /> New Discussion</h3>
                <button className="cm-modal-close" onClick={() => setShowCreateModal(false)}>
                  <i className="fas fa-times" />
                </button>
              </div>

              <div className="cm-modal-body">
                <div className="cm-form-group">
                  <label htmlFor="disc-title">Title</label>
                  <input
                    id="disc-title"
                    type="text"
                    placeholder="What do you want to discuss?"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="cm-form-group">
                  <label htmlFor="disc-category">Category</label>
                  <select
                    id="disc-category"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as DiscussionCategory)}
                  >
                    {discussionCategories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="cm-form-group">
                  <label htmlFor="disc-content">Content</label>
                  <textarea
                    id="disc-content"
                    placeholder="Share your thoughts, questions, or ideas..."
                    rows={6}
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                  />
                </div>
              </div>

              <div className="cm-modal-footer">
                <button className="cm-cancel-btn" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button
                  className="cm-submit-btn"
                  onClick={handleCreateSubmit}
                  disabled={!newTitle.trim() || !newContent.trim()}
                >
                  <i className="fas fa-paper-plane" /> Post Discussion
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscussionsForum;

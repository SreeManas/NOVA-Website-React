// ============================================
// NOVA Community — Moderation Dashboard Component
// ============================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabase/supabaseClient';
import { communityStats } from '../../configs/communityConfig';

interface NovaIdRequest {
  id: string;
  user_id: string;
  full_name: string;
  roll_number: string;
  department: string;
  year_of_study: string;
  motivation: string;
  id_card_url: string;
  applied_at: string;
}

interface ReportedDiscussion {
  discussion_id: string;
  title: string;
  author_name: string;
  report_count: number;
  reason: string;
}

const ModerationDashboard: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<NovaIdRequest[]>([]);
  const [reportedDiscs, setReportedDiscs] = useState<ReportedDiscussion[]>([]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const [reqsRes, repsRes] = await Promise.all([
        supabase.from('nova_id_applications').select('*').eq('status', 'pending'),
        supabase.from('reported_discussions_view').select('*')
      ]);
        
      if (reqsRes.data) setPendingRequests(reqsRes.data as any);
      if (repsRes.data) setReportedDiscs(repsRes.data as any);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const approveRequest = async (appId: string, userId: string) => {
    try {
      const application = pendingRequests.find(r => r.id === appId);
      await supabase.from('nova_id_applications').update({ status: 'approved' }).eq('id', appId);
      
      if (application) {
        await supabase.from('profiles').update({ 
          role: 'verified',
          full_name: application.full_name,
          department: application.department,
          year_of_study: application.year_of_study
        }).eq('id', userId);
      } else {
        await supabase.from('profiles').update({ role: 'verified' }).eq('id', userId);
      }
      
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'id-approved',
        title: 'NOVA ID Approved!',
        message: 'Congratulations! Your NOVA ID application has been verified. Welcome to the community!',
        action_url: '/community',
        is_read: false
      });

      setPendingRequests(prev => prev.filter(r => r.id !== appId));
      showFeedback('Application approved ✓');
    } catch (e: any) {
      console.error(e);
      showFeedback('Failed to approve: ' + (e.message || 'Unknown error'));
    }
  };

  const rejectRequest = async (appId: string, userId: string) => {
    try {
      await supabase.from('nova_id_applications').update({ status: 'rejected' }).eq('id', appId);

      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'event-reminder', // Reusing an existing type since we don't have a specific 'rejected' type yet
        title: 'NOVA ID Update',
        message: 'Your recent NOVA ID application was unfortunately rejected. Please contact an admin or try applying again with valid details.',
        action_url: '/community',
        is_read: false
      });

      setPendingRequests(prev => prev.filter(r => r.id !== appId));
      showFeedback('Application rejected');
    } catch (e: any) {
      console.error(e);
      showFeedback('Failed to reject: ' + (e.message || 'Unknown error'));
    }
  };

  const deleteDiscussion = async (discId: string) => {
    try {
      await supabase.from('discussions').delete().eq('id', discId);
      setReportedDiscs(prev => prev.filter(d => d.discussion_id !== discId));
      showFeedback('Discussion removed ✓');
    } catch (err: any) {
      console.error(err);
      showFeedback('Failed to remove discussion.');
    }
  };

  const dismissReport = async (discId: string) => {
    try {
      await supabase.from('discussion_reports').delete().eq('discussion_id', discId);
      setReportedDiscs(prev => prev.filter(d => d.discussion_id !== discId));
      showFeedback('Report dismissed');
    } catch (err: any) {
      console.error(err);
      showFeedback('Failed to dismiss report.');
    }
  };

  const formatTimeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="cm-moderation">
      {/* Feedback Toast */}
      {actionFeedback && (
        <motion.div
          className="cm-mod-toast"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {actionFeedback}
        </motion.div>
      )}

      <div className="cm-mod-header">
        <h3><i className="fas fa-shield-alt" /> Moderation Dashboard</h3>
        <span className="cm-mod-role"><i className="fas fa-crown" /> Core Member</span>
      </div>

      {/* Quick Stats */}
      <div className="cm-mod-stats">
        <div className="cm-mod-stat">
          <span className="cm-mod-stat-value">{pendingRequests.length}</span>
          <span className="cm-mod-stat-label">Pending IDs</span>
        </div>
        <div className="cm-mod-stat">
          <span className="cm-mod-stat-value">{reportedDiscs.length}</span>
          <span className="cm-mod-stat-label">Reports</span>
        </div>
        <div className="cm-mod-stat">
          <span className="cm-mod-stat-value">{communityStats.members}</span>
          <span className="cm-mod-stat-label">Members</span>
        </div>
        <div className="cm-mod-stat">
          <span className="cm-mod-stat-value">{communityStats.discussions}</span>
          <span className="cm-mod-stat-label">Active Disc.</span>
        </div>
      </div>

      {/* Pending NOVA ID Requests */}
      <section className="cm-mod-section">
        <h4><i className="fas fa-id-card" /> Pending NOVA ID Requests</h4>
        {loading ? (
          <div className="cm-empty-state cm-empty-sm">
            <div className="cm-loading-spinner" />
            <p>Loading applications...</p>
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="cm-empty-state cm-empty-sm">
            <i className="fas fa-check-circle" />
            <p>All applications reviewed!</p>
          </div>
        ) : (
          <div className="cm-mod-cards">
            {pendingRequests.map((req, idx) => (
              <motion.div
                key={req.id}
                className="cm-mod-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <div className="cm-mod-card-header">
                  <div className="cm-mod-card-avatar">
                    <i className="fas fa-user" />
                  </div>
                  <div>
                    <h5>{req.full_name}</h5>
                    <span className="cm-mod-card-sub">{req.id}</span>
                  </div>
                  <span className="cm-mod-card-time">{formatTimeAgo(req.applied_at)}</span>
                </div>
                <div className="cm-mod-card-details">
                  <span><i className="fas fa-building" /> {req.department}</span>
                  <span><i className="fas fa-graduation-cap" /> {req.year_of_study} Year</span>
                  <span><i className="fas fa-hashtag" /> {req.roll_number}</span>
                </div>
                <p className="cm-mod-card-motivation">"{req.motivation}"</p>
                {req.id_card_url && (
                  <a 
                    href={req.id_card_url.startsWith('http') ? req.id_card_url : '#'} 
                    onClick={(e) => {
                      if (!req.id_card_url.startsWith('http')) {
                        e.preventDefault();
                        alert('This application was submitted before file uploads were supported and has no valid ID card.');
                      }
                    }}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '1rem', display: 'inline-block'}}
                  >
                    <i className="fas fa-external-link-alt" /> View ID Card
                  </a>
                )}
                <div className="cm-mod-card-actions">
                  <button
                    className="cm-mod-approve"
                    onClick={() => approveRequest(req.id, req.user_id)}
                  >
                    <i className="fas fa-check" /> Approve
                  </button>
                  <button
                    className="cm-mod-reject"
                    onClick={() => rejectRequest(req.id, req.user_id)}
                  >
                    <i className="fas fa-times" /> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Reported Discussions */}
      <section className="cm-mod-section">
        <h4><i className="fas fa-flag" /> Reported Discussions</h4>
        {reportedDiscs.length === 0 ? (
          <div className="cm-empty-state cm-empty-sm">
            <i className="fas fa-check-circle" />
            <p>No pending reports!</p>
          </div>
        ) : (
          <div className="cm-mod-cards">
            {reportedDiscs.map((report, idx) => (
              <motion.div
                key={report.discussion_id}
                className="cm-mod-card cm-mod-card-report"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <div className="cm-mod-card-header">
                  <div className="cm-mod-card-avatar cm-avatar-report">
                    <i className="fas fa-flag" />
                  </div>
                  <div>
                    <h5>{report.title}</h5>
                    <span className="cm-mod-card-sub">by {report.author_name}</span>
                  </div>
                  <span className="cm-report-count">
                    <i className="fas fa-exclamation-triangle" /> {report.report_count} reports
                  </span>
                </div>
                <p className="cm-mod-card-reason">
                  <i className="fas fa-info-circle" /> {report.reason}
                </p>
                <div className="cm-mod-card-actions">
                  <button
                    className="cm-mod-review"
                    onClick={() => dismissReport(report.discussion_id)}
                  >
                    <i className="fas fa-eye" /> Dismiss
                  </button>
                  <button
                    className="cm-mod-delete"
                    onClick={() => deleteDiscussion(report.discussion_id)}
                  >
                    <i className="fas fa-trash" /> Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ModerationDashboard;

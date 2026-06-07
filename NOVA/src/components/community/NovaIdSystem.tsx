// ============================================
// NOVA Community — NOVA ID System Component
// ============================================
// Improvements: Benefits section, Premium card design,
// QR Code, Activity heatmap, Recent achievements, Glass effect

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import type {
  ApplicationStatus,
  NovaIdApplication,
  Department,
  YearOfStudy,
} from '../../domain/models/CommunityModels';
import {
  mockApprovedProfile,
  memberLevels,
  pointsConfig,
} from '../../configs/communityConfig';
import { useAuth } from '../../context/AuthContext';

interface NovaIdProps {
  idStatus: ApplicationStatus;
  applicationId: string;
  submitApplication: (app: NovaIdApplication) => void;
  viewAsApproved: boolean;
  setViewAsApproved: (v: boolean) => void;
}

const DEPARTMENTS: Department[] = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIDS', 'AIML'];
const YEARS: YearOfStudy[] = ['1st', '2nd', '3rd', '4th'];

const BENEFITS = [
  { icon: 'fas fa-check-circle', label: 'Verified Student Status', color: '#10b981' },
  { icon: 'fas fa-comments', label: 'Access Community Discussions', color: '#3b82f6' },
  { icon: 'fas fa-calendar-star', label: 'Join Exclusive Events', color: '#8b5cf6' },
  { icon: 'fas fa-award', label: 'Earn Community Badges', color: '#f59e0b' },
  { icon: 'fas fa-chart-line', label: 'Build Your NOVA Reputation', color: '#ec4899' },
  { icon: 'fas fa-user-friends', label: 'Future Mentorship Access', color: '#06b6d4' },
];

const ACHIEVEMENTS = [
  { icon: 'fas fa-comment-dots', label: 'First Discussion', date: 'Nov 2024', earned: true },
  { icon: 'fas fa-calendar-check', label: 'Joined 5 Events', date: 'Dec 2024', earned: true },
  { icon: 'fas fa-fire', label: 'Top Contributor', date: 'Jan 2025', earned: true },
  { icon: 'fas fa-bolt', label: '7-Day Streak', date: 'Feb 2025', earned: true },
  { icon: 'fas fa-code-branch', label: 'Open Source Champion', date: 'Mar 2025', earned: true },
  { icon: 'fas fa-star', label: 'Community Star', date: 'Locked', earned: false },
];

const QRCodePlaceholder: React.FC<{ id: string }> = ({ id }) => {
  const verifyUrl = `${window.location.origin}/verify/${id}`;
  return (
    <a href={verifyUrl} target="_blank" rel="noopener noreferrer" title="Click to test verification page" className="cm-qr-placeholder" style={{ display: 'block', padding: '4px', background: 'rgba(16,185,129,0.1)', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.3)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
      <QRCodeSVG 
        value={verifyUrl} 
        size={54} 
        bgColor="transparent" 
        fgColor="#10B981" 
        level="L" 
      />
    </a>
  );
};

const NovaIdSystem: React.FC<NovaIdProps> = ({
  idStatus,
  applicationId,
  submitApplication,
  viewAsApproved,
  setViewAsApproved,
}) => {
  const [form, setForm] = useState<NovaIdApplication>({
    fullName: '',
    rollNumber: '',
    department: 'CSE',
    year: '1st',
    collegeEmail: '',
    idCardFileName: '',
    motivation: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NovaIdApplication, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NovaIdApplication, string>> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!form.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!form.collegeEmail.trim()) newErrors.collegeEmail = 'Email is required';
    else if (!form.collegeEmail.includes('@')) newErrors.collegeEmail = 'Invalid email';
    if (!form.motivation.trim()) newErrors.motivation = 'Tell us why you want to join';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      submitApplication(form);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, idCardFileName: file.name, idCardFile: file }));
    }
  };

  const { profile: userProfile } = useAuth();

  // ── Approved Profile View ──
  if (viewAsApproved || idStatus === 'approved') {
    const profile = {
      ...mockApprovedProfile,
      fullName: userProfile?.full_name || mockApprovedProfile.fullName,
      novaId: applicationId ? `NOVA-${applicationId.split('-')[0].toUpperCase()}` : mockApprovedProfile.novaId,
      department: userProfile?.department || mockApprovedProfile.department,
      year: userProfile?.year_of_study || mockApprovedProfile.year,
      gamification: {
        ...mockApprovedProfile.gamification,
        level: userProfile?.level || mockApprovedProfile.gamification.level,
        points: {
          ...mockApprovedProfile.gamification.points,
          total: userProfile?.points_total ?? mockApprovedProfile.gamification.points.total
        }
      }
    };
    const currentLevel = memberLevels.find(l => l.id === profile.gamification.level);
    const nextLevel = memberLevels[memberLevels.findIndex(l => l.id === profile.gamification.level) + 1];
    const progressPercent = Math.min(
      (profile.gamification.points.total / profile.gamification.nextLevelAt) * 100,
      100
    );

    return (
      <div className="cm-novaid cm-novaid-wide">
        {/* ── Premium Member Card ── */}
        <motion.div
          className="cm-member-card cm-card-premium"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="cm-member-card-bg" />
          <div className="cm-card-glow" />
          <div className="cm-member-card-content">
            <div className="cm-member-card-header">
              <div className="cm-member-avatar cm-avatar-premium">
                <i className="fas fa-user-astronaut" />
                <div className="cm-avatar-ring" style={{ borderColor: currentLevel?.color }} />
              </div>
              <div className="cm-member-header-right">
                <div className="cm-member-badge-verified">
                  <i className="fas fa-check-circle" /> Verified Member
                </div>
                <span className="cm-member-since">
                  <i className="fas fa-clock" /> Member since {profile.joinedAt}
                </span>
              </div>
            </div>

            <h2 className="cm-member-name">{profile.fullName}</h2>
            <p className="cm-member-id">{profile.novaId}</p>

            <div className="cm-member-details">
              <span><i className="fas fa-building" /> {profile.department}</span>
              <span><i className="fas fa-graduation-cap" /> {profile.year} Year</span>
              <span>
                <i className={currentLevel?.icon ?? ''} style={{ color: currentLevel?.color }} />
                <span style={{ color: currentLevel?.color }}>{currentLevel?.label}</span>
              </span>
            </div>

            <div className="cm-member-card-footer-row">
              <div className="cm-member-level-badge" style={{ background: `${currentLevel?.color}15`, borderColor: `${currentLevel?.color}35` }}>
                <i className={currentLevel?.icon ?? ''} style={{ color: currentLevel?.color }} />
                <span style={{ color: currentLevel?.color }}>{profile.gamification.points.total} pts</span>
              </div>
              <QRCodePlaceholder id={applicationId || profile.novaId} />
            </div>
          </div>
          <div className="cm-member-card-logo"><span>NOVA</span></div>
        </motion.div>

        {/* ── Gamification Section ── */}
        <motion.div
          className="cm-gamification"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Level Progress */}
          <div className="cm-level-progress">
            <div className="cm-level-header">
              <span className="cm-level-current">
                <i className={currentLevel?.icon ?? ''} style={{ color: currentLevel?.color }} />
                {currentLevel?.label}
              </span>
              {nextLevel && (
                <span className="cm-level-next">
                  {nextLevel.label} <i className="fas fa-arrow-right" />
                </span>
              )}
            </div>
            <div className="cm-progress-bar">
              <motion.div
                className="cm-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                style={{ background: `linear-gradient(90deg, ${currentLevel?.color}, ${nextLevel?.color ?? currentLevel?.color})` }}
              />
            </div>
            <div className="cm-progress-label">
              {profile.gamification.points.total} / {profile.gamification.nextLevelAt} points
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="cm-achievements-section">
            <h4><i className="fas fa-trophy" /> Recent Achievements</h4>
            <div className="cm-achievements-grid">
              {ACHIEVEMENTS.map(ach => (
                <div key={ach.label} className={`cm-achievement-card ${ach.earned ? 'cm-ach-earned' : 'cm-ach-locked'}`}>
                  <div className="cm-ach-icon">
                    <i className={ach.icon} />
                    {!ach.earned && <i className="fas fa-lock cm-ach-lock-icon" />}
                  </div>
                  <span className="cm-ach-label">{ach.label}</span>
                  <span className="cm-ach-date">{ach.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Points */}
          <div className="cm-points-breakdown">
            <h4>Activity Points</h4>
            <div className="cm-points-grid">
              {pointsConfig.map(pc => (
                <div key={pc.action} className="cm-point-item">
                  <i className={pc.icon} />
                  <span className="cm-point-action">{pc.action}</span>
                  <span className="cm-point-value">+{pc.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="cm-badges-section">
            <h4>Badges Earned</h4>
            <div className="cm-badges-grid">
              {profile.gamification.badges.map(badge => (
                <div key={badge.id} className="cm-badge-card cm-badge-earned">
                  <i className={badge.icon} />
                  <span className="cm-badge-label">{badge.label}</span>
                  <span className="cm-badge-desc">{badge.description}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {viewAsApproved && (
          <button className="cm-back-btn" onClick={() => setViewAsApproved(false)}>
            <i className="fas fa-arrow-left" /> Back to Application
          </button>
        )}
      </div>
    );
  }

  // ── Pending State ──
  if (idStatus === 'pending') {
    return (
      <motion.div
        className="cm-novaid cm-novaid-pending"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="cm-pending-card">
          <div className="cm-pending-icon">
            <i className="fas fa-clock" />
          </div>
          <h2>Application Submitted</h2>
          <div className="cm-pending-status">
            <span className="cm-pending-label">Status</span>
            <span className="cm-pending-value cm-status-pending">
              <i className="fas fa-hourglass-half" /> Pending Review
            </span>
          </div>
          <div className="cm-pending-status">
            <span className="cm-pending-label">Application ID</span>
            <span className="cm-pending-value">{applicationId}</span>
          </div>
          <p className="cm-pending-message">
            Our team will review your application within 24-48 hours.
            You'll receive a notification once it's processed.
          </p>
          <button
            className="cm-preview-btn"
            onClick={() => setViewAsApproved(true)}
          >
            <i className="fas fa-eye" /> Preview Approved Profile
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Submitting State ──
  if (idStatus === 'submitting') {
    return (
      <div className="cm-novaid cm-novaid-submitting">
        <div className="cm-submitting-card">
          <div className="cm-spinner" />
          <p>Submitting your application...</p>
        </div>
      </div>
    );
  }

  // ── Application Form (with Benefits) ──
  return (
    <div className="cm-novaid cm-novaid-wide">
      <motion.div
        className="cm-novaid-intro"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="cm-novaid-badge">
          <i className="fas fa-id-card-alt" /> NOVA ID Program
        </div>
        <h2>Apply for your NOVA ID</h2>
        <p>
          Become a verified member of NOVA. Get access to exclusive events,
          discussions, and community features.
        </p>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        className="cm-benefits"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="cm-benefits-title"><i className="fas fa-gift" /> Benefits of NOVA ID</h3>
        <div className="cm-benefits-grid">
          {BENEFITS.map(b => (
            <div key={b.label} className="cm-benefit-item">
              <div className="cm-benefit-icon" style={{ color: b.color, background: `${b.color}12` }}>
                <i className={b.icon} />
              </div>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.form
        className="cm-id-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="cm-form-row">
          <div className="cm-form-group">
            <label htmlFor="nova-fullname">Full Name</label>
            <input
              id="nova-fullname"
              type="text"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
              className={errors.fullName ? 'cm-input-error' : ''}
            />
            {errors.fullName && <span className="cm-error">{errors.fullName}</span>}
          </div>
          <div className="cm-form-group">
            <label htmlFor="nova-roll">Roll Number</label>
            <input
              id="nova-roll"
              type="text"
              placeholder="e.g. 24R11A0547"
              value={form.rollNumber}
              onChange={e => setForm(p => ({ ...p, rollNumber: e.target.value }))}
              className={errors.rollNumber ? 'cm-input-error' : ''}
            />
            {errors.rollNumber && <span className="cm-error">{errors.rollNumber}</span>}
          </div>
        </div>

        <div className="cm-form-row">
          <div className="cm-form-group">
            <label htmlFor="nova-dept">Department</label>
            <select
              id="nova-dept"
              value={form.department}
              onChange={e => setForm(p => ({ ...p, department: e.target.value as Department }))}
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="cm-form-group">
            <label htmlFor="nova-year">Year</label>
            <select
              id="nova-year"
              value={form.year}
              onChange={e => setForm(p => ({ ...p, year: e.target.value as YearOfStudy }))}
            >
              {YEARS.map(y => (
                <option key={y} value={y}>{y} Year</option>
              ))}
            </select>
          </div>
        </div>

        <div className="cm-form-group">
          <label htmlFor="nova-email">College Email</label>
          <input
            id="nova-email"
            type="email"
            placeholder="yourname@mvsrec.edu.in"
            value={form.collegeEmail}
            onChange={e => setForm(p => ({ ...p, collegeEmail: e.target.value }))}
            className={errors.collegeEmail ? 'cm-input-error' : ''}
          />
          {errors.collegeEmail && <span className="cm-error">{errors.collegeEmail}</span>}
        </div>

        <div className="cm-form-group">
          <label>Upload College ID Card</label>
          <div className="cm-file-upload">
            <input
              type="file"
              id="nova-idcard"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="cm-file-input"
            />
            <label htmlFor="nova-idcard" className="cm-file-label">
              <i className="fas fa-cloud-upload-alt" />
              <span>{form.idCardFileName || 'Choose file or drag & drop'}</span>
              <span className="cm-file-hint">JPG, PNG or PDF, max 5MB</span>
            </label>
          </div>
        </div>

        <div className="cm-form-group">
          <label htmlFor="nova-motivation">Why do you want to join NOVA?</label>
          <textarea
            id="nova-motivation"
            placeholder="Tell us about your interests and what you hope to gain from the community..."
            rows={4}
            value={form.motivation}
            onChange={e => setForm(p => ({ ...p, motivation: e.target.value }))}
            className={errors.motivation ? 'cm-input-error' : ''}
          />
          {errors.motivation && <span className="cm-error">{errors.motivation}</span>}
        </div>

        <button type="submit" className="cm-submit-btn">
          <i className="fas fa-paper-plane" /> Apply For NOVA ID
        </button>
      </motion.form>

      <button
        className="cm-preview-btn cm-preview-standalone"
        onClick={() => setViewAsApproved(true)}
      >
        <i className="fas fa-eye" /> Preview what a NOVA ID looks like
      </button>
    </div>
  );
};

export default NovaIdSystem;

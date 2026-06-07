import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmaps } from '../../hooks/useRoadmaps';
import type { RoadmapDomain, RoadmapNode } from '../../domain/models/LaunchpadModels';

const difficultyColors: Record<string, string> = {
  beginner: '#10b981',
  intermediate: '#8b5cf6',
  advanced: '#ef4444',
};

const resourceIcons: Record<string, string> = {
  video: 'fas fa-play-circle',
  article: 'fas fa-newspaper',
  course: 'fas fa-graduation-cap',
  tool: 'fas fa-wrench',
  docs: 'fas fa-book',
};

const RoadmapExplorer: React.FC = (): React.JSX.Element => {
  const { roadmapsState, progressState, toggleNodeCompletion } = useRoadmaps();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const activeDomain = useMemo(
    () => roadmapsState.data?.find(d => d.id === selectedDomain) || null,
    [selectedDomain, roadmapsState.data]
  );

  const getDomainProgress = (domain: RoadmapDomain): number => {
    const domainProgress = progressState.data?.[domain.id];
    if (!domainProgress) return 0;
    const completed = domain.nodes.filter(n => domainProgress[n.id]).length;
    return Math.round((completed / domain.nodes.length) * 100);
  };

  const isNodeCompleted = (domainId: string, nodeId: string): boolean => {
    return progressState.data?.[domainId]?.[nodeId] === true;
  };

  const toggleExpand = (nodeId: string) => {
    setExpandedNode(prev => (prev === nodeId ? null : nodeId));
  };

  const renderProgressRing = (percentage: number, color: string) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg className="lp-progress-ring" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
        <circle
          cx="24" cy="24" r={radius} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text x="24" y="24" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="10" fontWeight="700">
          {percentage}%
        </text>
      </svg>
    );
  };

  const renderNode = (node: RoadmapNode, index: number, domainId: string, domainColor: string) => {
    const isExpanded = expandedNode === node.id;
    const isCompleted = isNodeCompleted(domainId, node.id);
    const diffColor = difficultyColors[node.level];

    return (
      <motion.div
        key={node.id}
        className={`lp-roadmap-node ${isCompleted ? 'lp-node-completed' : ''}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.08 }}
      >
        <div className="lp-node-marker" style={{ borderColor: isCompleted ? domainColor : 'rgba(255,255,255,0.2)' }}>
          <span style={{ color: isCompleted ? domainColor : 'rgba(255,255,255,0.5)' }}>{index + 1}</span>
        </div>
        <div className="lp-node-content">
          <div className="lp-node-header" onClick={() => toggleExpand(node.id)} role="button" tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(node.id); }}
            aria-expanded={isExpanded} aria-label={`${node.title} - click to ${isExpanded ? 'collapse' : 'expand'}`}
          >
            <div className="lp-node-title-row">
              <h4 className="lp-node-title">{node.title}</h4>
              <div className="lp-node-badges">
                <span className="lp-node-level" style={{ color: diffColor, borderColor: diffColor }}>
                  {node.level}
                </span>
                <span className="lp-node-duration">{node.duration}</span>
              </div>
            </div>
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} lp-node-chevron`} />
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="lp-node-details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="lp-node-desc">{node.description}</p>
                <div className="lp-node-resources">
                  <span className="lp-resources-label">Resources</span>
                  {node.resources.map((res, rIdx) => (
                    <a key={rIdx} href={res.url} target="_blank" rel="noopener noreferrer" className="lp-resource-link">
                      <i className={resourceIcons[res.type] || 'fas fa-link'} />
                      <span>{res.title}</span>
                      {res.free && <span className="lp-free-badge">Free</span>}
                    </a>
                  ))}
                </div>
                <button
                  className={`lp-complete-btn ${isCompleted ? 'lp-completed' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleNodeCompletion(domainId, node.id); }}
                  aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  <i className={`fas ${isCompleted ? 'fa-check-circle' : 'fa-circle'}`} />
                  {isCompleted ? 'Completed' : 'Mark Complete'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="lp-roadmap">
      {/* Domain selector */}
      <div className="lp-domain-selector" role="tablist" aria-label="Learning domains">
        {roadmapsState.loading && !roadmapsState.data ? (
          <div className="lp-domain-card" style={{ justifyContent: 'center' }}>
            <div className="cm-loading-spinner" />
          </div>
        ) : roadmapsState.data?.map(domain => {
          const pct = getDomainProgress(domain);
          const isActive = selectedDomain === domain.id;
          return (
            <button
              key={domain.id}
              className={`lp-domain-card ${isActive ? 'lp-domain-active' : ''}`}
              onClick={() => setSelectedDomain(domain.id)}
              role="tab"
              aria-selected={isActive}
              aria-label={`${domain.title} - ${pct}% complete`}
              style={{ '--domain-color': domain.color } as React.CSSProperties}
            >
              <div className="lp-domain-top">
                {renderProgressRing(pct, domain.color)}
                <i className={domain.icon} style={{ color: domain.color }} />
              </div>
              <span className="lp-domain-name">{domain.title}</span>
            </button>
          );
        })}
      </div>

      {/* Roadmap timeline */}
      <div className="lp-roadmap-content" role="tabpanel">
        {!activeDomain && (
          <div className="lp-empty-state">
            <i className="fas fa-map-signs" />
            <h3>Select a domain to begin</h3>
            <p>Choose a learning path above to see the roadmap and track your progress.</p>
          </div>
        )}

        {activeDomain && (
          <motion.div
            key={activeDomain.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="lp-roadmap-header">
              <div>
                <h3 className="lp-roadmap-title" style={{ color: activeDomain.color }}>
                  <i className={activeDomain.icon} /> {activeDomain.title}
                </h3>
                <p className="lp-roadmap-desc">{activeDomain.description}</p>
              </div>
              <div className="lp-roadmap-stats">
                <span>
                  {activeDomain.nodes.filter(n => isNodeCompleted(activeDomain.id, n.id)).length} / {activeDomain.nodes.length} completed
                </span>
              </div>
            </div>
            <div className="lp-roadmap-timeline">
              {activeDomain.nodes.map((node, i) =>
                renderNode(node, i, activeDomain.id, activeDomain.color)
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoadmapExplorer;

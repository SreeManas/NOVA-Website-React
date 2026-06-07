import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WeeklyChallenge from '../components/launchpad/WeeklyChallenge';
import RoadmapExplorer from '../components/launchpad/RoadmapExplorer';
import OpportunitiesBoard from '../components/launchpad/OpportunitiesBoard';
import CareerNavigator from '../components/launchpad/CareerNavigator';
import '../components/launchpad/Launchpad.css';

type TabId = 'roadmaps' | 'opportunities' | 'career';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'roadmaps', label: 'Roadmaps', icon: 'fas fa-map-signs' },
  { id: 'opportunities', label: 'Opportunities', icon: 'fas fa-bullseye' },
  { id: 'career', label: 'Career Navigator', icon: 'fas fa-compass' },
];

const tabContent: Record<TabId, React.ReactNode> = {
  roadmaps: <RoadmapExplorer />,
  opportunities: <OpportunitiesBoard />,
  career: <CareerNavigator />,
};

const Launchpad: React.FC = (): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState<TabId>('roadmaps');

  return (
    <div className="lp-page">
      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <span className="lp-hero-chip">
            <i className="fas fa-rocket" /> NOVA Launchpad
          </span>
          <h1 className="lp-hero-title">
            Launch Your <span className="lp-hero-highlight">Tech Career</span>
          </h1>
          <p className="lp-hero-subtitle">
            Your roadmap, opportunities, and career growth — all in one place.
          </p>
        </div>
      </section>

      {/* Weekly Challenge */}
      <section className="lp-section">
        <WeeklyChallenge />
      </section>

      {/* Tab Navigation */}
      <nav className="lp-tab-nav" role="tablist" aria-label="Launchpad sections">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`lp-tab ${activeTab === tab.id ? 'lp-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            <i className={tab.icon} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <section className="lp-tab-content" id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
};

export default Launchpad;

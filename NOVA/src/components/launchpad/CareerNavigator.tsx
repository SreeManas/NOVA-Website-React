import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareerNavigator } from '../../hooks/useCareerNavigator';
import type { CareerGoal, YearOfStudy, PersonaPreset } from '../../domain/models/LaunchpadModels';

// ============================================
// Constants
// ============================================

const PERSONA_PRESETS: PersonaPreset[] = [
  { id: 'swe', label: 'Future Software Engineer', icon: 'fas fa-code', profile: { year: '2nd', interests: ['web development', 'open source', 'javascript'], careerGoal: 'software-engineer' } },
  { id: 'ai', label: 'Future AI Engineer', icon: 'fas fa-brain', profile: { year: '2nd', interests: ['machine learning', 'python', 'data science'], careerGoal: 'ai-engineer' } },
  { id: 'app', label: 'Future App Developer', icon: 'fas fa-mobile-alt', profile: { year: '2nd', interests: ['mobile apps', 'ui/ux', 'react'], careerGoal: 'app-developer' } },
  { id: 'cyber', label: 'Future Cybersecurity Engineer', icon: 'fas fa-shield-alt', profile: { year: '2nd', interests: ['networking', 'security', 'linux'], careerGoal: 'cybersecurity-engineer' } },
  { id: 'ds', label: 'Future Data Scientist', icon: 'fas fa-chart-bar', profile: { year: '2nd', interests: ['statistics', 'python', 'visualization'], careerGoal: 'data-scientist' } },
];

const YEAR_OPTIONS: { value: YearOfStudy; label: string; emoji: string }[] = [
  { value: '1st', label: '1st Year', emoji: '🌱' },
  { value: '2nd', label: '2nd Year', emoji: '🌿' },
  { value: '3rd', label: '3rd Year', emoji: '🌳' },
  { value: '4th', label: '4th Year', emoji: '🎓' },
];

const INTEREST_OPTIONS = [
  'Web Development', 'Machine Learning', 'Mobile Apps', 'Cybersecurity',
  'Data Science', 'Cloud Computing', 'DevOps', 'UI/UX Design',
  'Blockchain', 'IoT', 'Game Development', 'Open Source',
  'Competitive Programming', 'System Design', 'Python', 'JavaScript',
];

const GOAL_OPTIONS: { value: CareerGoal; label: string; icon: string; desc: string }[] = [
  { value: 'software-engineer', label: 'Software Engineer', icon: 'fas fa-code', desc: 'Build products at scale' },
  { value: 'ai-engineer', label: 'AI Engineer', icon: 'fas fa-brain', desc: 'Create intelligent systems' },
  { value: 'app-developer', label: 'App Developer', icon: 'fas fa-mobile-alt', desc: 'Craft mobile experiences' },
  { value: 'cybersecurity-engineer', label: 'Cybersecurity Engineer', icon: 'fas fa-shield-alt', desc: 'Defend digital systems' },
  { value: 'data-scientist', label: 'Data Scientist', icon: 'fas fa-chart-bar', desc: 'Extract insights from data' },
  { value: 'open-to-explore', label: 'Open to Explore', icon: 'fas fa-compass', desc: 'Discover your path' },
];

const STEP_TITLES = ['Your Year', 'Your Interests', 'Your Goal', 'Your Plan'];

const slideVariants = {
  enter: { x: 30, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -30, opacity: 0 },
};

// ============================================
// Component
// ============================================

const CareerNavigator: React.FC = (): React.JSX.Element => {
  const nav = useCareerNavigator();

  // ---- Step Indicator ----
  const renderStepIndicator = () => (
    <div className="lp-steps" aria-label="Progress">
      {STEP_TITLES.map((title, i) => (
        <div key={i} className={`lp-step ${i === nav.currentStep ? 'lp-step-active' : ''} ${i < nav.currentStep ? 'lp-step-done' : ''}`}>
          <div className="lp-step-dot">
            {i < nav.currentStep ? <i className="fas fa-check" /> : i + 1}
          </div>
          <span className="lp-step-label">{title}</span>
        </div>
      ))}
    </div>
  );

  // ---- Step 0: Year ----
  const renderYearStep = () => (
    <motion.div key="step-year" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="lp-wizard-step">
      <h3 className="lp-wizard-title">What year are you in?</h3>
      <p className="lp-wizard-subtitle">This helps us tailor the timeline to your remaining semesters.</p>

      <div className="lp-year-grid">
        {YEAR_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`lp-year-card ${nav.year === opt.value ? 'lp-year-active' : ''}`}
            onClick={() => { nav.setYear(opt.value); nav.goNext(); }}
          >
            <span className="lp-year-emoji">{opt.emoji}</span>
            <span className="lp-year-label">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Persona presets */}
      <div className="lp-presets">
        <p className="lp-presets-label">Quick start with a preset:</p>
        <div className="lp-preset-grid">
          {PERSONA_PRESETS.map(preset => (
            <button
              key={preset.id}
              className="lp-preset-btn"
              onClick={() => nav.applyPreset(preset.profile)}
            >
              <i className={preset.icon} />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {nav.savedPlan && (
        <button className="lp-saved-plan-btn" onClick={() => nav.goToStep(3)}>
          <i className="fas fa-history" /> View Your Saved Plan
        </button>
      )}
    </motion.div>
  );

  // ---- Step 1: Interests ----
  const renderInterestsStep = () => (
    <motion.div key="step-interests" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="lp-wizard-step">
      <h3 className="lp-wizard-title">What excites you?</h3>
      <p className="lp-wizard-subtitle">Select the topics you're most interested in (pick at least 1).</p>

      <div className="lp-interest-grid">
        {INTEREST_OPTIONS.map(interest => (
          <button
            key={interest}
            className={`lp-interest-chip ${nav.interests.includes(interest.toLowerCase()) ? 'lp-interest-active' : ''}`}
            onClick={() => nav.toggleInterest(interest.toLowerCase())}
          >
            {interest}
          </button>
        ))}
      </div>

      <div className="lp-wizard-nav">
        <button className="lp-nav-btn lp-nav-back" onClick={nav.goBack}>
          <i className="fas fa-arrow-left" /> Back
        </button>
        <button
          className="lp-nav-btn lp-nav-next"
          onClick={nav.goNext}
          disabled={nav.interests.length === 0}
        >
          Next <i className="fas fa-arrow-right" />
        </button>
      </div>
    </motion.div>
  );

  // ---- Step 2: Career Goal ----
  const renderGoalStep = () => (
    <motion.div key="step-goal" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="lp-wizard-step">
      <h3 className="lp-wizard-title">Where do you see yourself?</h3>
      <p className="lp-wizard-subtitle">Choose the career path that excites you most.</p>

      <div className="lp-goal-grid">
        {GOAL_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`lp-goal-card ${nav.careerGoal === opt.value ? 'lp-goal-active' : ''}`}
            onClick={() => nav.setCareerGoal(opt.value)}
          >
            <i className={opt.icon} />
            <span className="lp-goal-label">{opt.label}</span>
            <span className="lp-goal-desc">{opt.desc}</span>
          </button>
        ))}
      </div>

      <div className="lp-wizard-nav">
        <button className="lp-nav-btn lp-nav-back" onClick={nav.goBack}>
          <i className="fas fa-arrow-left" /> Back
        </button>
        <button
          className="lp-nav-btn lp-nav-generate"
          onClick={nav.generatePlan}
          disabled={!nav.canGenerate}
        >
          <i className="fas fa-rocket" /> Generate My Plan
        </button>
      </div>
    </motion.div>
  );

  // ---- Step 3: Results ----
  const renderPlanStep = () => {
    if (nav.isGenerating) {
      return (
        <motion.div key="step-loading" variants={slideVariants} initial="enter" animate="center" exit="exit" className="lp-wizard-step lp-generating">
          <div className="lp-loader">
            <div className="lp-loader-spinner" />
            <p className="lp-loader-text">{nav.generationStatus}</p>
          </div>
        </motion.div>
      );
    }

    if (nav.error) {
      return (
        <motion.div key="step-error" variants={slideVariants} initial="enter" animate="center" exit="exit" className="lp-wizard-step">
          <div className="lp-empty-state">
            <i className="fas fa-exclamation-triangle" />
            <h3>Something went wrong</h3>
            <p>{nav.error}</p>
            <button className="lp-nav-btn lp-nav-next" onClick={() => nav.goToStep(2)}>Try Again</button>
          </div>
        </motion.div>
      );
    }

    // Show saved plan if navigated directly from step 0
    const plan = nav.plan || nav.savedPlan?.plan;
    if (!plan) {
      return (
        <motion.div key="step-empty" variants={slideVariants} initial="enter" animate="center" exit="exit" className="lp-wizard-step">
          <div className="lp-empty-state">
            <i className="fas fa-compass" />
            <h3>No plan generated yet</h3>
            <p>Complete the steps above to get your personalized career plan.</p>
            <button className="lp-nav-btn lp-nav-next" onClick={nav.reset}>Start Over</button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div key="step-plan" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="lp-wizard-step lp-plan-results">
        {/* Summary */}
        <div className="lp-plan-section">
          <h3 className="lp-plan-heading"><i className="fas fa-star" /> Your Career Plan</h3>
          <p className="lp-plan-summary">{plan.summary}</p>
        </div>

        {/* Learning Path */}
        <div className="lp-plan-section">
          <h4 className="lp-plan-subheading"><i className="fas fa-route" /> Learning Path</h4>
          <div className="lp-learning-path">
            {plan.learningPath.map(item => (
              <div key={item.order} className="lp-path-item">
                <div className="lp-path-order">{item.order}</div>
                <div className="lp-path-content">
                  <strong>{item.skill}</strong>
                  <span className="lp-path-why">{item.why}</span>
                  <span className="lp-path-time"><i className="fas fa-clock" /> {item.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Projects */}
        <div className="lp-plan-section">
          <h4 className="lp-plan-subheading"><i className="fas fa-project-diagram" /> Project Ideas</h4>
          <div className="lp-project-grid">
            {plan.suggestedProjects.map((proj, i) => (
              <div key={i} className="lp-project-card">
                <h5>{proj.title}</h5>
                <p>{proj.description}</p>
                <div className="lp-project-skills">
                  {proj.skills.map(s => <span key={s} className="lp-project-skill">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="lp-plan-section">
          <h4 className="lp-plan-subheading"><i className="fas fa-calendar-alt" /> Your Timeline</h4>
          <div className="lp-timeline-phases">
            {plan.timeline.map((phase, i) => (
              <div key={i} className="lp-phase-card">
                <div className="lp-phase-label">{phase.phase}</div>
                <div className="lp-phase-focus">{phase.focus}</div>
                <ul className="lp-phase-milestones">
                  {phase.milestones.map((m, j) => <li key={j}>{m}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        {plan.suggestedResources.length > 0 && (
          <div className="lp-plan-section">
            <h4 className="lp-plan-subheading"><i className="fas fa-book-open" /> Recommended Resources</h4>
            <div className="lp-plan-resources">
              {plan.suggestedResources.map((res, i) => (
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="lp-plan-resource-link">
                  <span className="lp-plan-res-title">{res.title}</span>
                  <span className="lp-plan-res-reason">{res.reason}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="lp-plan-actions">
          <button className="lp-action-btn lp-action-save" onClick={() => { nav.savePlan(); }} title="Save this plan to your browser">
            <i className="fas fa-bookmark" /> Save Plan
          </button>
          <button className="lp-action-btn lp-action-copy" onClick={() => {
            const text = `Career Plan\n\n${plan.summary}\n\nLearning Path:\n${plan.learningPath.map(p => `${p.order}. ${p.skill} — ${p.why}`).join('\n')}\n\nProject Ideas:\n${plan.suggestedProjects.map(p => `- ${p.title}: ${p.description}`).join('\n')}`;
            navigator.clipboard.writeText(text);
          }} title="Copy plan as text">
            <i className="fas fa-copy" /> Copy
          </button>
          <button className="lp-action-btn lp-action-restart" onClick={nav.reset}>
            <i className="fas fa-redo" /> Start Over
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="lp-career-nav">
      {renderStepIndicator()}
      <div className="lp-wizard-container">
        <AnimatePresence mode="wait">
          {nav.currentStep === 0 && renderYearStep()}
          {nav.currentStep === 1 && renderInterestsStep()}
          {nav.currentStep === 2 && renderGoalStep()}
          {nav.currentStep === 3 && renderPlanStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CareerNavigator;

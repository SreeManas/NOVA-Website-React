import React from 'react'

const SprintsHeroSection: React.FC = (): React.JSX.Element => {
  return (
    <section className="roadmaps-hero">
      <div className="hero-content centered" data-aos="fade-up" data-aos-duration="1000">
        <div className="typing-container">
          <h1 className="typing-text">Learning <span className="highlight">Roadmaps</span></h1>
        </div>
        <h2>Your Journey to Tech Mastery</h2>
        <p>Structured learning paths designed to take you from beginner to expert in various technology stacks</p>
      </div>
    </section>
  )
}

export default SprintsHeroSection

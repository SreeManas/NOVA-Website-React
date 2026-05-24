import React from 'react'
import WinnerProjects from '../novathon/WinnerProjects'

const VibeathonHeroSection: React.FC = (): React.JSX.Element => {
  return (
    <div>
      {/* Winner Projects Section */}
      <section className="winners-section">
        <WinnerProjects />
      </section>
    </div>
  )
}

export default VibeathonHeroSection

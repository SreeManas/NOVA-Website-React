import React from 'react';
import SprintsHeroSection from "../components/sections/SprintsHeroSection";
import FullStackRoadmap from "../components/sections/FullStackRoadmaps";

const Sprints: React.FC = () => {
  return (
    <div className="sprints-page-wrapper">
      {/* Particles will be handled inside sections for better layering */}
      <SprintsHeroSection />
      <FullStackRoadmap />
    </div>
  );
};

export default Sprints;
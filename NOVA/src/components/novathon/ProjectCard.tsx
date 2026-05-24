import React from "react"
import { Project } from "./types"

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export default function ProjectCard({ project, onClick }: ProjectCardProps): React.JSX.Element {
  return (
    <div className="winner-card" onClick={onClick}>
      <img src={project.thumbnail} className="winner-thumb" alt="" />

      <h2 className="winner-title">{project.title}</h2>

      {/* Bottom Section */}
      <div className="winner-footer">
        <p className="team-name">{project.teamName}</p>
        <p className="winner-status">{project.status}</p>
      </div>
    </div>
  )
}

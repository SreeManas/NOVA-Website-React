export interface TeamMember {
  name: string
  photo: string
}

export interface Project {
  id: number
  title: string
  teamName: string
  status: string
  desc: string
  link: string
  thumbnail: string
  team: TeamMember[]
}

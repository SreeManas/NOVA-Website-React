export interface Testimonial {
  id: number
  text: string
  author: string
  role: string
}

export interface Panelist {
  id: number
  image: string
  name: string
  role: string
  linkedin: string
  company?: string
  expertise?: string
}

export interface ExecutiveMember {
  name: string
  role: string
  image: string
}

export interface Feature {
  icon: string
  title: string
  description: string
}

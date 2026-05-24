export interface Member {
  name: string
  role: string
  image: string
}

export interface Person {
  id: string | number
  name: string
  role: string
  bio: string
  about: string
  images: string[]
}

export interface Portfolio {
  id: string | number
  bg: string
  accent: string
  marquee: string
  team: Person[]
}

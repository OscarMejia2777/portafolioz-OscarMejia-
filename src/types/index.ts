export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  demoUrl?: string
  category: 'frontend' | 'fullstack' | 'tooling'
}

export interface Skill {
  name: string
  level: string
  experience: string
  icon: string
  description?: string
}

export interface Experience {
  role: string
  company: string
  period: string
  description: string
  achievements: string[]
  isCurrent: boolean
  projectId?: string
}

export interface NavLink {
  label: string
  href: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

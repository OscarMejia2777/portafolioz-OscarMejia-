import React from 'react'
import {
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiSupabase,
  SiFramer,
} from 'react-icons/si'
import { FaMobileScreen } from 'react-icons/fa6'
import { SiJavascript, SiVite, SiAstro } from 'react-icons/si'

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  React: SiReact,
  TypeScript: SiTypescript,
  'Tailwind CSS': SiTailwindcss,
  Supabase: SiSupabase,
  'Framer Motion': SiFramer,
  'React Native': FaMobileScreen,
  JavaScript: SiJavascript,
  Vite: SiVite,
  Astro: SiAstro,
}

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name]
  if (!Icon) return null
  return <Icon className={className} />
}

import type { Experience } from '@/types'

export const EXPERIENCES: Experience[] = [
  {
    role: 'Senior Frontend Developer',
    company: 'TechCorp',
    period: '2024 — Present',
    description: 'Leading frontend architecture for a SaaS platform serving 50k+ users.',
    achievements: [
      'Reduced bundle size by 40% via code splitting and lazy loading',
      'Led migration from class components to hooks and functional components',
      'Implemented design system with 30+ reusable components',
      'Mentored 3 junior developers through code reviews and pair programming',
    ],
    isCurrent: true,
    projectId: 'dashmetrics',
  },
  {
    role: 'Frontend Developer',
    company: 'StartupXYZ',
    period: '2022 — 2024',
    description: 'Built and maintained customer-facing web applications.',
    achievements: [
      'Developed real-time collaboration features using WebSockets',
      'Improved Lighthouse score from 65 to 92 across all pages',
      'Created automated E2E test suite with 95% coverage',
      'Integrated third-party APIs for payments, maps, and analytics',
    ],
    isCurrent: false,
    projectId: 'taskflow',
  },
  {
    role: 'Junior Developer',
    company: 'WebAgency',
    period: '2021 — 2022',
    description: 'Built responsive websites and web applications for diverse clients.',
    achievements: [
      'Delivered 15+ client projects on time and within budget',
      'Developed custom WordPress themes and React SPAs',
      'Implemented CI/CD pipelines for automated deployments',
    ],
    isCurrent: false,
    projectId: 'shophub',
  },
]

# Portfolio Refactor Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete rewrite of developer portfolio with modern animations, parallax effects, proper architecture, and 3 demo projects.

**Architecture:** Single-page React app with vertical sections (Navbar → Hero → Projects → Experience → Contact → Footer), Framer Motion for all animations, Tailwind v4 for styling, EmailJS for contact form. The AI Assistant floats as an overlay.

**Tech Stack:** React 19, TypeScript, Vite 6, Framer Motion, Tailwind CSS v4, EmailJS, @google/genai

---

### Task 1: Scaffold — Clean slate + folder structure

**Files:**
- Delete: `App.tsx`, `components/`, `constants.tsx`, `index.tsx`, `metadata.json`, `types.ts`
- Create: `src/` directory tree
- Modify: `index.html`, `.gitignore`
- Keep: `package.json`, `vite.config.ts`, `tsconfig.json`

- [ ] **Delete old source files**

Run:
```powershell
Remove-Item -LiteralPath "C:\Users\JdkZero\Desktop\Front-Portafolio\App.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "C:\Users\JdkZero\Desktop\Front-Portafolio\constants.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "C:\Users\JdkZero\Desktop\Front-Portafolio\index.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "C:\Users\JdkZero\Desktop\Front-Portafolio\metadata.json" -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "C:\Users\JdkZero\Desktop\Front-Portafolio\types.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "C:\Users\JdkZero\Desktop\Front-Portafolio\components" -Recurse -Force -ErrorAction SilentlyContinue
```

- [ ] **Create new folder structure**

```powershell
$base = "C:\Users\JdkZero\Desktop\Front-Portafolio\src"
$dirs = @(
  "components\layout",
  "components\sections",
  "components\ui",
  "components\ai",
  "hooks",
  "data",
  "lib",
  "types",
  "animations",
  "styles"
)
foreach ($d in $dirs) {
  New-Item -ItemType Directory -Path "$base\$d" -Force | Out-Null
}
New-Item -ItemType Directory -Path "C:\Users\JdkZero\Desktop\Front-Portafolio\public\images" -Force | Out-Null
```

- [ ] **Update .gitignore to include .superpowers**

Already done in previous step (should already be in .gitignore).

- [ ] **Create empty globals.css**

```css
@import "tailwindcss";

@theme {
  --color-bg: #120e1a;
  --color-surface: #1e1933;
  --color-primary: #a78bfa;
  --color-secondary: #e2c275;
  --color-accent: #f472b6;
  --color-text: #e2dff0;
}

* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary) transparent;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Inter', system-ui, sans-serif;
}
```

Write to `src/styles/globals.css`.

- [ ] **Update index.html** to remove Tailwind CDN and Import Maps

Read `index.html`, then rewrite it:

```html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..900&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Commit scaffold**

```powershell
git add -A
git commit -m "feat: scaffold new portfolio structure"
```

---

### Task 2: Install dependencies

**Files:**
- Modify: `package.json` (update deps)
- New: `node_modules/`, `pnpm-lock.yaml` (auto)

- [ ] **Update package.json** with all dependencies

Read existing `package.json`, then write:

```json
{
  "name": "portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "framer-motion": "^12.0.0",
    "@google/genai": "^1.0.0",
    "@emailjs/browser": "^4.4.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/vite": "^4.1.0",
    "typescript": "~5.8.2",
    "@types/node": "^22.14.0",
    "vite": "^6.2.0"
  }
}
```

- [ ] **Run install**

```powershell
Set-Location -LiteralPath "C:\Users\JdkZero\Desktop\Front-Portafolio"
pnpm install
```

Expected: no errors, `node_modules/` populated, `pnpm-lock.yaml` generated.

- [ ] **Update vite.config.ts** to add Tailwind plugin

Read existing `vite.config.ts`, then write:

```typescript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: { port: 3000, host: '0.0.0.0' },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
  }
})
```

- [ ] **Create .env** placeholder (no real keys)

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Write to `.env`.

- [ ] **Commit deps**

```powershell
git add -A
git commit -m "feat: install dependencies (tailwind, framer-motion, emailjs)"
```

---

### Task 3: Create types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Write type definitions**

```typescript
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
```

---

### Task 4: Create data files

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/data/skills.ts`
- Create: `src/data/experiences.ts`

- [ ] **Write projects data**

```typescript
import type { Project } from '@/types'

export const PROJECTS: Project[] = [
  {
    id: 'taskflow',
    title: 'TaskFlow',
    description: 'Kanban board app with drag and drop, task management, and real-time updates.',
    tags: ['React', 'TypeScript', 'DnD', 'Zustand'],
    imageUrl: '',
    category: 'tooling',
  },
  {
    id: 'shophub',
    title: 'ShopHub',
    description: 'E-commerce catalog with product filtering, search, and shopping cart.',
    tags: ['React', 'TypeScript', 'API', 'Context'],
    imageUrl: '',
    category: 'frontend',
  },
  {
    id: 'dashmetrics',
    title: 'DashMetrics',
    description: 'Analytics dashboard with interactive charts and real-time data visualization.',
    tags: ['React', 'TypeScript', 'Charts', 'Recharts'],
    imageUrl: '',
    category: 'fullstack',
  },
  {
    id: 'devflow',
    title: 'DevFlow',
    description: 'Developer productivity tool for managing workflows and automation.',
    tags: ['React', 'Node.js', 'WebSocket', 'Docker'],
    imageUrl: '',
    category: 'fullstack',
  },
  {
    id: 'pixelperfect',
    title: 'PixelPerfect',
    description: 'Design-to-code conversion tool with AI-assisted component detection.',
    tags: ['React', 'AI', 'Figma API', 'Tailwind'],
    imageUrl: '',
    category: 'tooling',
  },
  {
    id: 'cryptosnap',
    title: 'CryptoSnap',
    description: 'Crypto portfolio tracker with real-time prices and market insights.',
    tags: ['React', 'WebSocket', 'Charts', 'API'],
    imageUrl: '',
    category: 'frontend',
  },
]
```

- [ ] **Write skills data**

```typescript
import type { Skill } from '@/types'

export const SKILLS: Skill[] = [
  {
    name: 'Frontend',
    level: 'Advanced',
    experience: '4+ years',
    icon: 'code',
  },
  {
    name: 'React Ecosystem',
    level: 'Advanced',
    experience: '3+ years',
    icon: 'javascript',
  },
  {
    name: 'UI/UX Design',
    level: 'Intermediate',
    experience: '3+ years',
    icon: 'css',
  },
  {
    name: 'Backend & Tools',
    level: 'Intermediate',
    experience: '2+ years',
    icon: 'layers',
  },
]
```

- [ ] **Write experiences data**

```typescript
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
```

---

### Task 5: Animation variants

**Files:**
- Create: `src/animations/variants.ts`

- [ ] **Write Framer Motion variants**

```typescript
import type { Variants } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}
```

---

### Task 6: Hooks

**Files:**
- Create: `src/hooks/useScrollProgress.ts`
- Create: `src/hooks/useParallax.ts`

- [ ] **Write useScrollProgress**

```typescript
import { useScroll, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { useState } from 'react'

export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll()
  return scrollYProgress
}
```

- [ ] **Write useParallax**

```typescript
import { useTransform, type MotionValue } from 'framer-motion'

export function useParallax(
  scrollYProgress: MotionValue<number>,
  start: number,
  end: number,
  outputRange: [number, number] = [0, -100]
) {
  return useTransform(scrollYProgress, [start, end], outputRange)
}
```

---

### Task 7: UI Components

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Tag.tsx`
- Create: `src/components/ui/SectionHeading.tsx`

- [ ] **Write Button**

```typescript
import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  href?: string
}

export function Button({ children, variant = 'primary', href, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer'
  const variants = {
    primary: 'bg-primary text-bg hover:opacity-90 hover:scale-[1.02] active:scale-95',
    outline: 'border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary',
    ghost: 'text-text/70 hover:text-primary',
  }

  const cls = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button className={cls} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} {...props}>
      {children}
    </motion.button>
  )
}
```

- [ ] **Write Badge**

```typescript
interface BadgeProps {
  children: string
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      {children}
    </span>
  )
}
```

- [ ] **Write Tag**

```typescript
interface TagProps {
  children: string
}

export function Tag({ children }: TagProps) {
  return (
    <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface border border-white/5 text-text/70">
      {children}
    </span>
  )
}
```

- [ ] **Write SectionHeading**

```typescript
import { motion } from 'framer-motion'
import { fadeIn } from '@/animations/variants'

interface SectionHeadingProps {
  label?: string
  title: string
  subtitle?: string
}

export function SectionHeading({ label, title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      className="text-center mb-16"
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {label && (
        <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
      {subtitle && <p className="text-text/60 max-w-2xl mx-auto">{subtitle}</p>}
    </motion.div>
  )
}
```

---

### Task 8: Layout Components

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/Layout.tsx`

- [ ] **Write Navbar**

```typescript
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="text-xl font-bold text-white">
            <span className="text-primary">&lt;</span> JD <span className="text-primary">/&gt;</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text/60 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-bg hover:opacity-90 transition-all"
            >
              Get in touch
            </a>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden bg-surface border-t border-white/5"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-text/60 hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                className="block text-center px-4 py-2 rounded-lg bg-primary text-bg font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Get in touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
```

- [ ] **Write Footer**

```typescript
import { motion } from 'framer-motion'

const SOCIALS = [
  { name: 'GitHub', icon: 'code', url: '#' },
  { name: 'LinkedIn', icon: 'work', url: '#' },
  { name: 'Twitter', icon: 'alternate_email', url: '#' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-white">
              <span className="text-primary">&lt;</span> JD <span className="text-primary">/&gt;</span>
            </span>
            <p className="mt-2 text-sm text-text/40">Building digital experiences</p>
          </div>

          <div className="flex items-center gap-4">
            {SOCIALS.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text/40 hover:text-primary hover:border-primary/30 border border-white/5 transition-all"
                whileHover={{ y: -3 }}
                aria-label={social.name}
              >
                <span className="material-symbols-outlined text-lg">{social.icon}</span>
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-text/30">
            &copy; {new Date().getFullYear()} JD. Built with React & Framer Motion.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Write Layout**

```typescript
import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
```

---

### Task 9: Hero Section

**Files:**
- Create: `src/components/sections/Hero.tsx`

- [ ] **Write Hero component**

```typescript
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const SOCIALS = [
  { name: 'GitHub', url: '#', icon: 'code' },
  { name: 'LinkedIn', url: '#', icon: 'work' },
  { name: 'Twitter', url: '#', icon: 'alternate_email' },
]

const TECH_STACK = ['React', 'TypeScript', 'Node.js', 'Tailwind', 'Framer']

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ y }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px]" />
      </motion.div>

      <motion.div className="relative z-10 text-center px-4 max-w-3xl" style={{ opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Badge>Available for opportunities</Badge>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Frontend{' '}
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Developer
          </span>
        </motion.h1>

        <motion.p
          className="text-lg text-text/60 mb-8 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          I build performant, accessible web applications with modern technologies.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Button href="#work">View My Work</Button>
          <Button variant="outline" href="#contact">
            Get in Touch
          </Button>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {SOCIALS.map((social) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text/40 hover:text-primary border border-white/5 hover:border-primary/30 transition-all"
              whileHover={{ y: -3 }}
              aria-label={social.name}
            >
              <span className="material-symbols-outlined text-lg">{social.icon}</span>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-3 mt-12 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-medium rounded-full bg-surface border border-white/5 text-text/50"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
```

---

### Task 10: Projects Section

**Files:**
- Create: `src/components/sections/Projects.tsx`

- [ ] **Write Projects component**

```typescript
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS } from '@/data/projects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { staggerContainer, fadeIn, scaleIn } from '@/animations/variants'

const CATEGORIES = ['all', 'frontend', 'fullstack', 'tooling'] as const

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const filtered = useMemo(
    () => PROJECTS.filter((p) => activeFilter === 'all' || p.category === activeFilter),
    [activeFilter]
  )

  return (
    <section id="work" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Selected Work"
          title="Projects I've Built"
          subtitle="A collection of projects showcasing my skills and experience."
        />

        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeFilter === cat
                  ? 'bg-primary text-bg'
                  : 'bg-surface text-text/60 hover:text-white border border-white/5'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.article
                key={project.id}
                variants={scaleIn}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/10 via-surface to-accent/10 flex items-center justify-center overflow-hidden">
                  <div className="text-4xl font-bold text-white/10 group-hover:scale-110 transition-transform duration-500">
                    {project.title.charAt(0)}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text/50 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
```

---

### Task 11: Experience Section

**Files:**
- Create: `src/components/sections/Experience.tsx`

- [ ] **Write Experience component**

```typescript
import { motion } from 'framer-motion'
import { EXPERIENCES } from '@/data/experiences'
import { SKILLS } from '@/data/skills'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { staggerContainer, fadeInLeft, fadeInRight } from '@/animations/variants'

export function Experience() {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Experience"
          title="Skills & Career"
          subtitle="My professional journey and the technologies I work with."
        />

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {SKILLS.map((skill) => (
            <motion.div
              key={skill.name}
              variants={fadeInLeft}
              className="p-5 rounded-xl bg-surface border border-white/5 text-center group hover:border-primary/20 transition-all"
            >
              <span className="material-symbols-outlined text-3xl text-primary/60 group-hover:text-primary transition-colors">
                {skill.icon}
              </span>
              <h3 className="mt-3 font-semibold text-white">{skill.name}</h3>
              <p className="text-xs text-text/40 mt-1">{skill.level}</p>
              <p className="text-xs text-text/30">{skill.experience}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary to-transparent" />

          <motion.div
            className="space-y-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={exp.company}
                variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                className={`relative flex flex-col md:flex-row gap-6 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute left-4 md:left-1/2 top-0 w-2 h-2 rounded-full bg-primary -translate-x-1/2 mt-2 ring-4 ring-bg" />

                <div className="md:w-1/2 pl-10 md:pl-0 md:pr-10 md:text-right">
                  {i % 2 === 0 && (
                    <>
                      <span className="text-xs text-primary font-medium">{exp.period}</span>
                      <h3 className="text-lg font-semibold text-white mt-1">{exp.role}</h3>
                      <p className="text-sm text-text/50">{exp.company}</p>
                      <p className="mt-3 text-sm text-text/60">{exp.description}</p>
                    </>
                  )}
                </div>

                <div className="md:w-1/2 pl-10 md:pl-10">
                  {i % 2 !== 0 && (
                    <>
                      <span className="text-xs text-primary font-medium">{exp.period}</span>
                      <h3 className="text-lg font-semibold text-white mt-1">{exp.role}</h3>
                      <p className="text-sm text-text/50">{exp.company}</p>
                      <p className="mt-3 text-sm text-text/60">{exp.description}</p>
                    </>
                  )}

                  <ul className="mt-4 space-y-2">
                    {exp.achievements.map((ach, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-text/50">
                        <span className="material-symbols-outlined text-xs mt-0.5 text-primary">
                          check_circle
                        </span>
                        {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

---

### Task 12: Contact Section

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Create: `src/lib/emailjs.ts`

- [ ] **Write emailjs lib**

```typescript
import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

interface ContactForm {
  name: string
  email: string
  message: string
}

export async function sendContactEmail(data: ContactForm): Promise<boolean> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured')
    return false
  }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY)
    return true
  } catch (error) {
    console.error('EmailJS error:', error)
    return false
  }
}
```

- [ ] **Write Contact component**

```typescript
import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { sendContactEmail } from '@/lib/emailjs'

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const ok = await sendContactEmail(form)
    setStatus(ok ? 'success' : 'error')
    if (ok) setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <SectionHeading
          label="Contact"
          title="Let's Work Together"
          subtitle="Have a project in mind? Let's discuss how we can build something great."
        />

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full px-4 py-3 bg-surface border border-white/5 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-primary/50 transition-colors peer"
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-3 text-sm text-text/30 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm"
              >
                Name
              </label>
            </div>

            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full px-4 py-3 bg-surface border border-white/5 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-primary/50 transition-colors peer"
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-3 text-sm text-text/30 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm"
              >
                Email
              </label>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Message"
              className="w-full px-4 py-3 bg-surface border border-white/5 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-primary/50 transition-colors peer resize-none"
            />
            <label
              htmlFor="message"
              className="absolute left-4 top-3 text-sm text-text/30 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm"
            >
              Message
            </label>
          </div>

          <div className="text-center">
            <Button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </Button>
          </div>

          <AnimatePresence>
            {status === 'success' && (
              <motion.p
                className="text-center text-sm text-green-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Message sent successfully!
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p
                className="text-center text-sm text-red-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Failed to send. Try again later.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  )
}
```

---

### Task 13: AI Assistant migration

**Files:**
- Read existing: `components/AIAssistant.tsx`
- Create: `src/components/ai/AIAssistant.tsx`
- Create: `src/lib/gemini.ts`

- [ ] **Write gemini lib**

```typescript
import { GoogleGenAI } from '@google/genai'

const API_KEY = process.env.API_KEY || ''

let ai: GoogleGenAI | null = null

function getAI(): GoogleGenAI | null {
  if (!API_KEY) return null
  if (!ai) ai = new GoogleGenAI({ apiKey: API_KEY })
  return ai
}

export async function sendChatMessage(message: string, history: { role: string; text: string }[]) {
  const client = getAI()
  if (!client) {
    return { text: 'AI chat is not configured. Add GEMINI_API_KEY to .env file.' }
  }

  try {
    const contents = [
      ...history.map((h) => ({
        role: h.role as 'user' | 'model',
        parts: [{ text: h.text }],
      })),
      { role: 'user' as const, parts: [{ text: message }] },
    ]

    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
    })

    return { text: response.text || 'No response generated.' }
  } catch (error) {
    console.error('Gemini error:', error)
    return { text: 'Sorry, I encountered an error. Please try again.' }
  }
}
```

- [ ] **Write AIAssistant** (migrated, re-styled to match palette)

Read the original `components/AIAssistant.tsx` first, then create the new version:

```typescript
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendChatMessage } from '@/lib/gemini'

interface Message {
  role: 'user' | 'ai'
  text: string
}

const SYSTEM_CONTEXT = `You are a helpful assistant for a developer portfolio. 
Answer questions about the developer's projects, skills, and experience. 
Keep responses concise and friendly. Default to Spanish if the user writes in Spanish.`

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight)
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg: Message = { role: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    const history = [...messages.map((m) => ({ role: m.role === 'ai' ? 'model' as const : 'user' as const, text: m.text }))]
    const res = await sendChatMessage(input, history)
    setMessages((prev) => [...prev, { role: 'ai', text: res.text }])
    setIsLoading(false)
  }

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-primary text-bg flex items-center justify-center shadow-lg hover:shadow-primary/25"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
      >
        <span className="material-symbols-outlined">{isOpen ? 'close' : 'smart_toy'}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            className="fixed bottom-24 right-6 z-[100] w-[360px] h-[500px] bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-bg">smart_toy</span>
                </div>
                <div>
                  <p className="font-medium text-white text-sm">AI Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-text/40">Online</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-text/40 text-sm mt-8">
                  Ask me anything about the portfolio!
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-bg rounded-br-sm'
                        : 'bg-bg text-text rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg px-4 py-3 rounded-xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-text/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-text/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-text/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask something..."
                  className="flex-1 px-3 py-2 bg-bg border border-white/5 rounded-lg text-sm text-white placeholder-text/30 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-3 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

---

### Task 14: Wire up App + main entry

**Files:**
- Create: `src/App.tsx`
- Create: `src/main.tsx`

- [ ] **Write App.tsx**

```typescript
import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Experience } from '@/components/sections/Experience'
import { Contact } from '@/components/sections/Contact'
import { AIAssistant } from '@/components/ai/AIAssistant'

export default function App() {
  return (
    <Layout>
      <Hero />
      <Projects />
      <Experience />
      <Contact />
      <AIAssistant />
    </Layout>
  )
}
```

Note: AIAssistant is rendered inside Layout so it positions relative to the page, not inside `<main>`.

- [ ] **Write main.tsx**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import App from '@/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

---

### Task 15: Verify build

- [ ] **Run build to check for errors**

```powershell
Set-Location -LiteralPath "C:\Users\JdkZero\Desktop\Front-Portafolio"
pnpm build
```

Expected: No TypeScript errors, no build errors. Vite outputs to `dist/`.

- [ ] **Run dev server to verify it starts**

```powershell
Set-Location -LiteralPath "C:\Users\JdkZero\Desktop\Front-Portafolio"
pnpm dev
```

Expected: Dev server starts on `http://localhost:3000`.

- [ ] **Commit working portfolio shell**

```powershell
git add -A
git commit -m "feat: portfolio core with all sections and animations"
```

---

### Task 16: Create demo projects (TaskFlow, ShopHub, DashMetrics)

Each demo project lives in `/pinned-projects/<name>/` with its own `package.json`, Vite config, and React app.

- [ ] **Create folder structure for demo projects**

```powershell
$pinned = "C:\Users\JdkZero\Desktop\Front-Portafolio\pinned-projects"
@("taskflow", "shophub", "dashmetrics") | ForEach-Object {
  New-Item -ItemType Directory -Path "$pinned\$_\src" -Force | Out-Null
}
```

- [ ] **Scaffold TaskFlow** (Kanban board app)

Create `pinned-projects/taskflow/package.json`:
```json
{
  "name": "taskflow",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "@dnd-kit/core": "^6.3.0",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^6.2.0",
    "typescript": "~5.8.2"
  }
}
```

Then `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx` with a basic Kanban board.

(More detailed steps would be added here for each project, but for the plan document this outlines the approach.)

- [ ] **Commit demo project scaffolds**

```powershell
git add -A
git commit -m "feat: scaffold pinned demo projects"
```

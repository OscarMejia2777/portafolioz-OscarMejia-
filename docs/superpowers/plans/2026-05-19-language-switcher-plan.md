# Language Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ES/EN language toggle in Navbar that switches all visible text except technology names.

**Architecture:** React Context with `useLanguage` hook + plain dictionary object. No i18n libraries. Language persisted in localStorage.

**Tech Stack:** React 19, TypeScript, Framer Motion

---

### Task 1: Create translations dictionary

**Files:**
- Create: `src/data/translations.ts`

- [ ] **Step 1: Create the translations file**

```typescript
export type Language = 'en' | 'es'

export const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.workTogether': "Let's Work Together",
    'nav.toggleMenu': 'Toggle menu',
    'nav.home': 'Home',

    'hero.greeting': "Hi, I'm",
    'hero.name': 'Oscar Mejia',
    'hero.role': 'Frontend Developer at',
    'hero.description': 'Frontend developer specializing in React, TypeScript, and Tailwind CSS. I build modern web apps, cross-platform mobile apps with React Native, and have experience with ERP systems, healthcare platforms, and UI/UX design. Also into ethical hacking and bug bounty hunting.',
    'hero.viewProjects': 'View Projects',
    'hero.getInTouch': 'Get in Touch',
    'hero.linkedin': 'LinkedIn',

    'projects.label': 'Selected Work',
    'projects.title': "Projects I've Built",
    'projects.subtitle': 'A collection of projects showcasing my skills and experience.',
    'projects.all': 'All',
    'projects.frontend': 'Frontend',
    'projects.fullstack': 'Fullstack',
    'projects.tooling': 'Tooling',

    'skills.label': 'Tech Stack',
    'skills.title': 'Technologies I Work With',
    'skills.subtitle': 'The tools and frameworks I use to build modern web applications.',

    'contact.label': 'Contact',
    'contact.title': "Let's Work Together",
    'contact.subtitle': "Have a project in mind? Let's discuss how we can build something great.",
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.sending': 'Sending...',
    'contact.send': 'Send Message',
    'contact.success': 'Message sent successfully!',
    'contact.error': 'Failed to send. Try again later.',

    'footer.copyright': 'Oscar Mejia',
    'footer.jdk': 'JDK Technologies',
    'footer.linkedin': 'LinkedIn',

    'ai.title': 'AI Assistant',
    'ai.online': 'Online',
    'ai.empty': 'Ask me anything about the portfolio!',
    'ai.placeholder': 'Ask something...',
    'ai.send': 'Send',
    'ai.toggle': 'Toggle AI Assistant',
    'ai.notConfigured': 'AI chat is not configured. Add GEMINI_API_KEY to .env file.',
    'ai.noResponse': 'No response generated.',
    'ai.error': 'Sorry, I encountered an error. Please try again.',

    'project.taskflow': 'Kanban board app with drag and drop, task management, and real-time updates.',
    'project.shophub': 'E-commerce catalog with product filtering, search, and shopping cart.',
    'project.dashmetrics': 'Analytics dashboard with interactive charts and real-time data visualization.',
    'project.devflow': 'Developer productivity tool for managing workflows and automation.',
    'project.pixelperfect': 'Design-to-code conversion tool with AI-assisted component detection.',
    'project.cryptosnap': 'Crypto portfolio tracker with real-time prices and market insights.',
  },
  es: {
    'nav.projects': 'Proyectos',
    'nav.skills': 'Habilidades',
    'nav.workTogether': 'Trabajemos Juntos',
    'nav.toggleMenu': 'Abrir menú',
    'nav.home': 'Inicio',

    'hero.greeting': 'Hola, soy',
    'hero.name': 'Oscar Mejia',
    'hero.role': 'Frontend Developer en',
    'hero.description': 'Desarrollador frontend especializado en React, TypeScript y Tailwind CSS. Creo apps web modernas, apps móviles multiplataforma con React Native, y tengo experiencia en sistemas ERP, plataformas de salud y diseño UI/UX. También me interesa el hacking ético y bug bounty.',
    'hero.viewProjects': 'Ver Proyectos',
    'hero.getInTouch': 'Contactarme',
    'hero.linkedin': 'LinkedIn',

    'projects.label': 'Trabajos Seleccionados',
    'projects.title': 'Proyectos que He Creado',
    'projects.subtitle': 'Una colección de proyectos que muestran mis habilidades y experiencia.',
    'projects.all': 'Todos',
    'projects.frontend': 'Frontend',
    'projects.fullstack': 'Fullstack',
    'projects.tooling': 'Tooling',

    'skills.label': 'Stack Tecnológico',
    'skills.title': 'Tecnologías con las que Trabajo',
    'skills.subtitle': 'Las herramientas y frameworks que uso para crear aplicaciones web modernas.',

    'contact.label': 'Contacto',
    'contact.title': 'Trabajemos Juntos',
    'contact.subtitle': '¿Tienes un proyecto en mente? Hablemos sobre cómo podemos crear algo grandioso.',
    'contact.name': 'Nombre',
    'contact.email': 'Correo',
    'contact.message': 'Mensaje',
    'contact.sending': 'Enviando...',
    'contact.send': 'Enviar Mensaje',
    'contact.success': '¡Mensaje enviado exitosamente!',
    'contact.error': 'Error al enviar. Intenta de nuevo más tarde.',

    'footer.copyright': 'Oscar Mejia',
    'footer.jdk': 'JDK Technologies',
    'footer.linkedin': 'LinkedIn',

    'ai.title': 'Asistente IA',
    'ai.online': 'En línea',
    'ai.empty': '¡Pregúntame lo que quieras sobre el portafolio!',
    'ai.placeholder': 'Pregunta algo...',
    'ai.send': 'Enviar',
    'ai.toggle': 'Abrir Asistente IA',
    'ai.notConfigured': 'El chat IA no está configurado. Agrega GEMINI_API_KEY al archivo .env.',
    'ai.noResponse': 'No se generó respuesta.',
    'ai.error': 'Lo siento, ocurrió un error. Intenta de nuevo.',

    'project.taskflow': 'App de tablero Kanban con arrastrar y soltar, gestión de tareas y actualizaciones en tiempo real.',
    'project.shophub': 'Catálogo de e-commerce con filtrado de productos, búsqueda y carrito de compras.',
    'project.dashmetrics': 'Panel de análisis con gráficos interactivos y visualización de datos en tiempo real.',
    'project.devflow': 'Herramienta de productividad para desarrolladores para gestionar flujos de trabajo y automatización.',
    'project.pixelperfect': 'Herramienta de conversión de diseño a código con detección de componentes asistida por IA.',
    'project.cryptosnap': 'Rastreador de portafolio de criptomonedas con precios en tiempo real y perspectivas del mercado.',
  },
}
```

---

### Task 2: Create LanguageContext

**Files:**
- Create: `src/context/LanguageContext.tsx`

- [ ] **Step 1: Create context, provider, and useLanguage hook**

```typescript
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type Language } from '@/data/translations'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lang')
      if (saved === 'es' || saved === 'en') return saved
    }
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('lang', language)
  }, [language])

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'es' : 'en')

  const t = (key: string) => translations[language][key] ?? key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
```

---

### Task 3: Create LanguageSwitcher component with SVG flags

**Files:**
- Create: `src/components/ui/LanguageSwitcher.tsx`

- [ ] **Step 1: Create the component**

```typescript
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

function ESFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="16" fill="#0C3B5E" />
      <rect y="2" width="24" height="4" fill="#FFFFFF" />
      <rect y="10" width="24" height="4" fill="#FFFFFF" />
      <rect x="9" y="5" width="6" height="6" fill="#0C3B5E" />
      <rect x="10" y="6" width="4" height="4" fill="#FFFFFF" />
      <rect x="11" y="7" width="2" height="2" fill="#0C3B5E" />
    </svg>
  )
}

function USFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="16" fill="#FFFFFF" />
      <rect y="2" width="24" height="2" fill="#B22234" />
      <rect y="6" width="24" height="2" fill="#B22234" />
      <rect y="10" width="24" height="2" fill="#B22234" />
      <rect y="14" width="24" height="2" fill="#B22234" />
      <rect width="10" height="8" fill="#3C3B6E" />
    </svg>
  )
}

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1.5 border border-white/10 rounded-lg p-1">
      <button
        onClick={() => language !== 'en' && toggleLanguage()}
        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
          language === 'en'
            ? 'bg-primary/20 text-primary'
            : 'text-text/40 hover:text-text/60'
        }`}
        aria-label="Switch to English"
      >
        <USFlag className="w-4 h-3 rounded-sm" />
        EN
      </button>
      <button
        onClick={() => language !== 'es' && toggleLanguage()}
        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
          language === 'es'
            ? 'bg-primary/20 text-primary'
            : 'text-text/40 hover:text-text/60'
        }`}
        aria-label="Cambiar a Español"
      >
        <ESFlag className="w-4 h-3 rounded-sm" />
        ES
      </button>
    </div>
  )
}
```

---

### Task 4: Wrap app with LanguageProvider

**Files:**
- Modify: `src/main.tsx`

- [ ] **Step 1: Import and wrap with LanguageProvider**

```typescript
// Add at top:
import { LanguageProvider } from '@/context/LanguageContext'

// Wrap <App />:
root.render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
)
```

---

### Task 5: Update Navbar — add LanguageSwitcher + translations

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Add useLanguage import and import LanguageSwitcher**

```typescript
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
```

- [ ] **Step 2: Add hook call inside component**

```typescript
const { t } = useLanguage()
```

- [ ] **Step 3: Replace nav link labels with t() calls**

NAV_LINKS becomes:
```typescript
const NAV_LINKS = [
  { label: t('nav.projects'), href: '#projects' },
  { label: t('nav.skills'), href: '#skills' },
];
```

But wait — `t()` inside a module-level array won't work because the hook is called inside the component. So NAV_LINKS should be defined inside the component function using t(). OR, keep NAV_LINKS as href-only and use t() inline.

Better: keep NAV_LINKS as `{ href: string }[]` and render labels inline:
```typescript
const NAV_LINKS = [
  { href: '#projects' },
  { href: '#skills' },
] as const

// In render:
{NAV_LINKS.map((link) => (
  <a key={link.href} href={link.href} ...>
    {link.href === '#projects' ? t('nav.projects') : t('nav.skills')}
  </a>
))}
```

Even cleaner: use a map object:
```typescript
const navLabels: Record<string, string> = {
  '#projects': t('nav.projects'),
  '#skills': t('nav.skills'),
}
```

- [ ] **Step 4: Replace aria-labels and CTA button text with t()**

```typescript
aria-label={t('nav.home')}
// and
{t('nav.workTogether')}
// and
aria-label={t('nav.toggleMenu')}
// and in mobile menu
{t('nav.workTogether')}
```

- [ ] **Step 5: Add LanguageSwitcher before the CTA button**

```typescript
// In the desktop nav, before the CTA button:
<LanguageSwitcher />
```

- [ ] **Step 6: Build and verify no errors**

Run: `pnpm run build`

---

### Task 6: Update Hero section with translations

**Files:**
- Modify: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Add useLanguage hook**

```typescript
const { t } = useLanguage()
```

- [ ] **Step 2: Replace all text with t() calls**

```typescript
// alt="Oscar Mejia" → alt={t('hero.name')}
// Hi, I'm → {t('hero.greeting')}
// Oscar Mejia → {t('hero.name')}
// Frontend Developer at → {t('hero.role')}
// description → {t('hero.description')}
// View Projects → {t('hero.viewProjects')}
// Get in Touch → {t('hero.getInTouch')}
// aria-label="LinkedIn" → aria-label={t('hero.linkedin')}
```

- [ ] **Step 3: Build and verify**

Run: `pnpm run build`

---

### Task 7: Update Projects section with translations

**Files:**
- Modify: `src/components/sections/Projects.tsx`

- [ ] **Step 1: Add useLanguage hook and update section heading**

```typescript
const { t } = useLanguage()

// Replace SectionHeading props:
label={t('projects.label')}
title={t('projects.title')}
subtitle={t('projects.subtitle')}
```

- [ ] **Step 2: Update filter buttons text**

Replace the filter button label logic to use translations:
```typescript
// Instead of: cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)
// Use:
{t('projects.' + cat)}
```

And update the project tag translation inline, or just leave tags as they are (they're tech names).

- [ ] **Step 3: Build and verify**

Run: `pnpm run build`

---

### Task 8: Update Skills section headings with translations

**Files:**
- Modify: `src/components/sections/Skills.tsx`

- [ ] **Step 1: Add useLanguage hook**

```typescript
const { t } = useLanguage()
```

- [ ] **Step 2: Update section heading**

```typescript
label={t('skills.label')}
title={t('skills.title')}
subtitle={t('skills.subtitle')}
```

- [ ] **Step 3: Build and verify**

Run: `pnpm run build`

---

### Task 9: Update Contact section with translations

**Files:**
- Modify: `src/components/sections/Contact.tsx`

- [ ] **Step 1: Add useLanguage hook**

- [ ] **Step 2: Replace all text with t() calls**

```typescript
label={t('contact.label')}
title={t('contact.title')}
subtitle={t('contact.subtitle')}
// placeholder="Name" → placeholder={t('contact.name')}
// Name (label) → {t('contact.name')}
// Email → {t('contact.email')}
// Message → {t('contact.message')}
// Sending... → {t('contact.sending')}
// Send Message → {t('contact.send')}
// Message sent successfully! → {t('contact.success')}
// Failed to send. Try again later. → {t('contact.error')}
```

- [ ] **Step 3: Build and verify**

Run: `pnpm run build`

---

### Task 10: Update Footer with translations

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Add useLanguage hook**

```typescript
const { t } = useLanguage()
```

- [ ] **Step 2: Replace text with t() calls**

```typescript
// © {new Date().getFullYear()} Oscar Mejia → © {new Date().getFullYear()} {t('footer.copyright')}
// JDK Technologies → {t('footer.jdk')}
// aria-label="LinkedIn" → aria-label={t('footer.linkedin')}
```

- [ ] **Step 3: Build and verify**

Run: `pnpm run build`

---

### Task 11: Update AI Assistant with translations

**Files:**
- Modify: `src/components/ai/AIAssistant.tsx`

- [ ] **Step 1: Add useLanguage hook**

- [ ] **Step 2: Replace all text with t() calls**

```typescript
// aria-label="Toggle AI Assistant" → aria-label={t('ai.toggle')}
// AI Assistant → {t('ai.title')}
// Online → {t('ai.online')}
// Ask me anything about the portfolio! → {t('ai.empty')}
// placeholder="Ask something..." → placeholder={t('ai.placeholder')}
// Send → {t('ai.send')}
```

Also update `src/lib/gemini.ts` error messages:
```typescript
// 'AI chat is not configured...' → use t('ai.notConfigured')
// 'No response generated.' → use t('ai.noResponse')
// 'Sorry, I encountered an error...' → use t('ai.error')
```

- [ ] **Step 3: Build and verify**

Run: `pnpm run build`

---

### Task 12: Verify everything works

- [ ] **Step 1: Full build**

Run: `pnpm run build`

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit` (if configured)


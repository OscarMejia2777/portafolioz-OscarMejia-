# Portfolio Refactor — Design Spec

## Overview

Complete rewrite of the developer portfolio from scratch. Modern animations, parallax effects, proper folder structure, and pinned demo projects.

## Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 6 |
| Animations | Framer Motion |
| Styling | Tailwind CSS v4 (installed, not CDN) |
| Contact | EmailJS |
| AI Chat | @google/genai (Gemini) — maintained |

## Color Palette: "Violeta Doppler"

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#120e1a` | Page background |
| `--surface` | `#1e1933` | Cards, sections |
| `--primary` | `#a78bfa` | Accent violet |
| `--secondary` | `#e2c275` | Ocre/gold accent |
| `--accent` | `#f472b6` | Pink details |
| `--text` | `#e2dff0` | Body text |

## Folder Structure

```
Front-Portafolio/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/        Navbar, Footer, Layout
│   │   ├── sections/      Hero, Projects, Experience, Contact
│   │   ├── ui/            Button, Card, Badge, Tag, GradientText
│   │   └── ai/            AIAssistant
│   ├── hooks/             useScrollProgress, useParallax, useInView
│   ├── data/              projects.ts, skills.ts, experiences.ts
│   ├── lib/               emailjs.ts, gemini.ts, utils
│   ├── types/             index.ts
│   ├── animations/        Framer Motion variants
│   ├── styles/            globals.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env
```

## Sections & Animations

| Section | Key Effect | Framer Motion |
|---|---|---|
| **Navbar** | Hide/show on scroll direction; backdrop-blur intensity changes | `useScroll`, `useMotionValue` |
| **Hero** | Background particles/mesh animated; text reveal typewriter; subtle parallax on gradient | `motion.div` with staggered children, `useScroll` y parallax |
| **Projects** | Cards enter via stagger grid on scroll into view; hover zooms image + overlay | `useInView`, `variants` with staggerChildren |
| **Experience** | Timeline entries scroll-triggered; connecting line animates progressively; project images shown in cards | `useInView`, `whileInView` |
| **Contact** | Floating labels animate on focus; submit button with loading spinner; success/fail feedback | `motion.input`, `AnimatePresence` for feedback |
| **AI Assistant** | Kept from current version — refactored into new folder structure; re-style to match palette | Existing Framer Motion |

## Pinned Demo Projects

Three standalone apps in `/pinned-projects/`:

1. **TaskFlow** — Kanban board (React, drag & drop, local state)
2. **ShopHub** — E-commerce catalog (data fetching, filtering, cart)
3. **DashMetrics** — Dashboard (charts, responsive layout)

Each has own `package.json`, deploys to Vercel. Portfolio references them by name and screenshot only — no code links.

## Build Order

1. Scaffold project (clean slate + folder structure)
2. Install deps (Tailwind v4, Framer Motion, EmailJS, @google/genai)
3. Configure Tailwind with custom palette
4. Build Layout shell (Navbar → Footer)
5. Hero section (parallax + text animation)
6. Projects section (stagger grid + filters)
7. Experience section (timeline + project images)
8. Contact section (EmailJS integration)
9. Migrate AI Assistant
10. Create 3 demo projects
11. Polish, responsive, accessibility audit
12. Deploy

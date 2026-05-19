# Apple-Style Parallax Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## 1. Goal

Implement a global vertical scroll timeline with an organic "living" line that connects all portfolio sections (Hero, Projects, Skills) and ends in the Contact section, inspired by Apple's scrollytelling.

## 2. Architecture

A main `ScrollPathLayout` wrapper that uses SVG and Framer Motion's `useScroll` to draw a path that zig-zags through the page. Individual `TimelineStep` components will handle the entry animations (spring physics) for each section.

## 3. Tech Stack

- React
- Framer Motion
- Tailwind CSS v4

---

### Task 1: Setup Animation Components

**Files:**

- Create: `src/components/animations/ScrollPathLayout.tsx`
- Create: `src/components/animations/TimelineStep.tsx`

- [ ] **Step 1: Create the basic TimelineStep component**

```tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TimelineStepProps {
  children: ReactNode;
  side?: 'left' | 'right';
}

export const TimelineStep = ({ children, side = 'left' }: TimelineStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50, scale: 0.9 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className={`w-full flex ${side === 'left' ? 'justify-start' : 'justify-end'} mb-24 relative`}
    >
      <div className="w-full md:w-[45%] bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10">
        {children}
      </div>
    </motion.div>
  );
};
```

- [ ] **Step 2: Create the ScrollPathLayout component with an organic SVG line**

```tsx
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

export const ScrollPathLayout = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black">
      {/* SVG Path Background */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 top-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M 100 0 Q 50 200 100 400 T 100 800 T 100 1200" // Simplified organic path example
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          style={{ pathLength }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0071e3" />
            <stop offset="100%" stopColor="#5ac8fa" />
          </linearGradient>
        </defs>
      </svg>
      {children}
    </div>
  );
};
```

- [ ] **Step 3: Commit**

```bash
git add src/components/animations/
git commit -m "feat: add ScrollPathLayout and TimelineStep components"
```

---

### Task 2: Integrate into App.tsx

**Files:**

- Modify: `src/App.tsx`

- [ ] **Step 1: Wrap App sections with the new components**

```tsx
import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Contact } from '@/components/sections/Contact'
import { AIAssistant } from '@/components/ai/AIAssistant'
import { ScrollPathLayout } from '@/components/animations/ScrollPathLayout'
import { TimelineStep } from '@/components/animations/TimelineStep'

export default function App() {
  return (
    <Layout>
      <ScrollPathLayout>
        <TimelineStep side="left">
          <Hero />
        </TimelineStep>
        <TimelineStep side="right">
          <Projects />
        </TimelineStep>
        <TimelineStep side="left">
          <Skills />
        </TimelineStep>
        <TimelineStep side="right">
          <Contact />
        </TimelineStep>
      </ScrollPathLayout>
      <AIAssistant />
    </Layout>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrate fluid timeline into App"
```

---

### Task 3: Polish Organic SVG and Responsive Styles

**Files:**

- Modify: `src/components/animations/ScrollPathLayout.tsx`

- [ ] **Step 1: Refine SVG path to be truly organic and cover total height**

- [ ] **Step 2: Add responsive hide for line on mobile if necessary**

- [ ] **Step 3: Commit**

```bash
git add src/components/animations/ScrollPathLayout.tsx
git commit -m "style: refine organic path and responsiveness"
```

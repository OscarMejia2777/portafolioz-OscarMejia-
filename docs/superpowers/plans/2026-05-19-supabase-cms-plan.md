# Supabase + CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all hardcoded portfolio content to Supabase and build an admin CMS panel.

**Architecture:** Single Vite + React app with lazy-loaded admin routes (`/admin/*`). Supabase handles auth, database, and file storage. Public landing uses anon key with RLS (SELECT only); CMS uses email/password auth + role check.

**Tech Stack:** React 19, Vite 6, Supabase (Auth + Postgres + Storage), react-router-dom v7, react-hook-form v7, Tailwind CSS v4

---

## File Structure

### New files to create:
```
src/lib/supabase.ts
src/hooks/useProjects.ts
src/hooks/useSkills.ts
src/hooks/useExperiences.ts
src/hooks/useTranslations.ts
src/admin/AdminLayout.tsx
src/admin/ProtectedRoute.tsx
src/admin/components/DataTable.tsx
src/admin/components/ImageUpload.tsx
src/admin/components/TranslationEditor.tsx
src/admin/components/ConfirmDialog.tsx
src/admin/components/EmptyState.tsx
src/admin/pages/LoginPage.tsx
src/admin/pages/DashboardPage.tsx
src/admin/pages/ProjectsList.tsx
src/admin/pages/ProjectForm.tsx
src/admin/pages/SkillsList.tsx
src/admin/pages/SkillForm.tsx
src/admin/pages/ExperiencesList.tsx
src/admin/pages/ExperienceForm.tsx
src/admin/pages/TranslationsPage.tsx
src/admin/pages/SettingsPage.tsx
```

### Files to modify:
```
package.json
.env.example
vite.config.ts
src/App.tsx
src/context/LanguageContext.tsx
src/components/sections/Hero.tsx
src/components/sections/Projects.tsx
src/components/sections/Skills.tsx
src/components/sections/Experience.tsx
```

### Files to remove:
```
src/data/translations.ts
src/data/projects.ts
src/data/skills.ts
src/data/experiences.ts
```

---

### Task 1: Install dependencies & add Supabase env vars

**Files:**
- Modify: `package.json`
- Modify: `.env.example`

- [ ] **Add dependencies to package.json**

```bash
npm install @supabase/supabase-js react-router-dom react-hook-form
```

- [ ] **Update `.env.example` with Supabase vars**

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add supabase and react-router-dom dependencies"
```

---

### Task 2: Create Supabase client

**Files:**
- Create: `src/lib/supabase.ts`

- [ ] **Create `src/lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add supabase client"
```

---

### Task 3: Setup Supabase project & run SQL migration

**Files:**
- Create: `supabase/migrations/001_schema.sql`

- [ ] **Create migration SQL file**

File `supabase/migrations/001_schema.sql`:

```sql
-- Languages
CREATE TABLE languages (
  id          BIGSERIAL PRIMARY KEY,
  code        TEXT UNIQUE NOT NULL,
  name        JSONB NOT NULL,
  is_default  BOOLEAN DEFAULT false
);

INSERT INTO languages (code, name, is_default) VALUES
  ('en', '{"en": "English", "es": "English"}', true),
  ('es', '{"en": "Spanish", "es": "Español"}', false);

-- Translations
CREATE TABLE translations (
  id            BIGSERIAL PRIMARY KEY,
  key           TEXT NOT NULL,
  language_code TEXT NOT NULL REFERENCES languages(code),
  value         TEXT NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(key, language_code)
);

-- Categories
CREATE TABLE categories (
  id         BIGSERIAL PRIMARY KEY,
  slug       TEXT UNIQUE NOT NULL,
  name_en    TEXT NOT NULL,
  name_es    TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

INSERT INTO categories (slug, name_en, name_es, sort_order) VALUES
  ('frontend', 'Frontend', 'Frontend', 1),
  ('fullstack', 'Fullstack', 'Fullstack', 2),
  ('tooling', 'Tooling', 'Herramientas', 3);

-- Projects
CREATE TABLE projects (
  id          BIGSERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  tags        TEXT[] DEFAULT '{}',
  image_url   TEXT DEFAULT '',
  demo_url    TEXT DEFAULT '',
  category_id BIGINT REFERENCES categories(id),
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Skills
CREATE TABLE skills (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  level       TEXT NOT NULL,
  experience  TEXT NOT NULL,
  icon        TEXT NOT NULL,
  description TEXT DEFAULT '',
  sort_order  INTEGER DEFAULT 0
);

-- Experiences
CREATE TABLE experiences (
  id            BIGSERIAL PRIMARY KEY,
  role          TEXT NOT NULL,
  company       TEXT NOT NULL,
  period        TEXT NOT NULL,
  description   TEXT NOT NULL,
  achievements  TEXT[] DEFAULT '{}',
  is_current    BOOLEAN DEFAULT false,
  project_slug  TEXT DEFAULT '',
  sort_order    INTEGER DEFAULT 0
);

-- Site settings
CREATE TABLE site_settings (
  id    BIGSERIAL PRIMARY KEY,
  key   TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL
);

-- User roles for admin
CREATE TABLE user_roles (
  id      BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role    TEXT NOT NULL DEFAULT 'admin',
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Public SELECT policies
CREATE POLICY "public_select_translations" ON translations FOR SELECT USING (true);
CREATE POLICY "public_select_projects" ON projects FOR SELECT USING (true);
CREATE POLICY "public_select_skills" ON skills FOR SELECT USING (true);
CREATE POLICY "public_select_experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "public_select_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public_select_settings" ON site_settings FOR SELECT USING (true);

-- Admin ALL policies
CREATE POLICY "admin_all_translations" ON translations FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));
CREATE POLICY "admin_all_projects" ON projects FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));
CREATE POLICY "admin_all_skills" ON skills FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));
CREATE POLICY "admin_all_experiences" ON experiences FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));
CREATE POLICY "admin_all_categories" ON categories FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));
CREATE POLICY "admin_all_settings" ON site_settings FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));
CREATE POLICY "admin_all_user_roles" ON user_roles FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

-- Storage bucket for images
-- Run in Supabase dashboard SQL editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
```

- [ ] **Create Supabase project & run migration**

```bash
# 1. Go to https://supabase.com and create a new project
# 2. Go to SQL Editor and paste + run the migration above
# 3. Run in SQL Editor:
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
# 4. Copy project URL + anon key to .env
```

- [ ] **Set up storage policy for public reads**

```sql
-- Run in SQL Editor:
CREATE POLICY "public_select_images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "admin_insert_images" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' 
    AND auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );
CREATE POLICY "admin_delete_images" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' 
    AND auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  );
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add SQL schema and RLS policies for supabase"
```

---

### Task 4: Seed data from existing files

**Files:**
- Create: `supabase/seed.sql`

- [ ] **Create `supabase/seed.sql` with current data**

```sql
-- Translations (key-value para EN)
INSERT INTO translations (key, language_code, value) VALUES
  ('nav.projects', 'en', 'Projects'),
  ('nav.skills', 'en', 'Skills'),
  ('nav.workTogether', 'en', 'Let''s Work Together'),
  ('nav.toggleMenu', 'en', 'Toggle menu'),
  ('nav.home', 'en', 'Home'),
  ('hero.greeting', 'en', 'Hi, I''m'),
  ('hero.name', 'en', 'Oscar Mejia'),
  ('hero.role', 'en', 'Frontend Developer at'),
  ('hero.description', 'en', 'Frontend developer specializing in React, TypeScript, and Tailwind CSS. I build modern web apps, cross-platform mobile apps with React Native, and have experience with ERP systems, healthcare platforms, and UI/UX design. Also into ethical hacking and bug bounty hunting.'),
  ('hero.viewProjects', 'en', 'View Projects'),
  ('hero.getInTouch', 'en', 'Get in Touch'),
  ('hero.linkedin', 'en', 'LinkedIn'),
  ('projects.label', 'en', 'Selected Work'),
  ('projects.title', 'en', 'Projects I''ve Built'),
  ('projects.subtitle', 'en', 'A collection of projects showcasing my skills and experience.'),
  ('projects.all', 'en', 'All'),
  ('projects.frontend', 'en', 'Frontend'),
  ('projects.fullstack', 'en', 'Fullstack'),
  ('projects.tooling', 'en', 'Tooling'),
  ('skills.label', 'en', 'Tech Stack'),
  ('skills.title', 'en', 'Technologies I Work With'),
  ('skills.subtitle', 'en', 'The tools and frameworks I use to build modern web applications.'),
  ('contact.label', 'en', 'Contact'),
  ('contact.title', 'en', 'Let''s Work Together'),
  ('contact.subtitle', 'en', 'Have a project in mind? Let''s discuss how we can build something great.'),
  ('contact.name', 'en', 'Name'),
  ('contact.email', 'en', 'Email'),
  ('contact.message', 'en', 'Message'),
  ('contact.sending', 'en', 'Sending...'),
  ('contact.send', 'en', 'Send Message'),
  ('contact.success', 'en', 'Message sent successfully!'),
  ('contact.error', 'en', 'Failed to send. Try again later.'),
  ('footer.copyright', 'en', 'Oscar Mejia'),
  ('footer.jdk', 'en', 'JDK Technologies'),
  ('footer.linkedin', 'en', 'LinkedIn'),
  ('lang.en', 'en', 'Switch to English'),
  ('lang.es', 'en', 'Switch to Spanish');

-- Translations for ES
INSERT INTO translations (key, language_code, value) VALUES
  ('nav.projects', 'es', 'Proyectos'),
  ('nav.skills', 'es', 'Habilidades'),
  ('nav.workTogether', 'es', 'Trabajemos Juntos'),
  ('nav.toggleMenu', 'es', 'Abrir menú'),
  ('nav.home', 'es', 'Inicio'),
  ('hero.greeting', 'es', 'Hola, soy'),
  ('hero.name', 'es', 'Oscar Mejia'),
  ('hero.role', 'es', 'Frontend Developer en'),
  ('hero.description', 'es', 'Desarrollador frontend especializado en React, TypeScript y Tailwind CSS. Creo apps web modernas, apps móviles multiplataforma con React Native, y tengo experiencia en sistemas ERP, plataformas de salud y diseño UI/UX. También me interesa el hacking ético y bug bounty.'),
  ('hero.viewProjects', 'es', 'Ver Proyectos'),
  ('hero.getInTouch', 'es', 'Contactarme'),
  ('hero.linkedin', 'es', 'LinkedIn'),
  ('projects.label', 'es', 'Trabajos Seleccionados'),
  ('projects.title', 'es', 'Proyectos que He Creado'),
  ('projects.subtitle', 'es', 'Una colección de proyectos que muestran mis habilidades y experiencia.'),
  ('projects.all', 'es', 'Todos'),
  ('projects.frontend', 'es', 'Frontend'),
  ('projects.fullstack', 'es', 'Fullstack'),
  ('projects.tooling', 'es', 'Tooling'),
  ('skills.label', 'es', 'Stack Tecnológico'),
  ('skills.title', 'es', 'Tecnologías con las que Trabajo'),
  ('skills.subtitle', 'es', 'Las herramientas y frameworks que uso para crear aplicaciones web modernas.'),
  ('contact.label', 'es', 'Contacto'),
  ('contact.title', 'es', 'Trabajemos Juntos'),
  ('contact.subtitle', 'es', '¿Tienes un proyecto en mente? Hablemos sobre cómo podemos crear algo grandioso.'),
  ('contact.name', 'es', 'Nombre'),
  ('contact.email', 'es', 'Correo'),
  ('contact.message', 'es', 'Mensaje'),
  ('contact.sending', 'es', 'Enviando...'),
  ('contact.send', 'es', 'Enviar Mensaje'),
  ('contact.success', 'es', '¡Mensaje enviado exitosamente!'),
  ('contact.error', 'es', 'Error al enviar. Intenta de nuevo más tarde.'),
  ('footer.copyright', 'es', 'Oscar Mejia'),
  ('footer.jdk', 'es', 'JDK Technologies'),
  ('footer.linkedin', 'es', 'LinkedIn'),
  ('lang.en', 'es', 'Cambiar a Inglés'),
  ('lang.es', 'es', 'Cambiar a Español');

-- Insert skill translations
INSERT INTO translations (key, language_code, value) VALUES
  ('skill.react.level', 'en', 'Advanced'), ('skill.react.exp', 'en', '3+ years'), ('skill.react.desc', 'en', 'SPAs, hooks, context, server components, performance optimization'),
  ('skill.typescript.level', 'en', 'Advanced'), ('skill.typescript.exp', 'en', '3+ years'), ('skill.typescript.desc', 'en', 'Types, generics, utility types, strict mode, declaration files'),
  ('skill.tailwindcss.level', 'en', 'Advanced'), ('skill.tailwindcss.exp', 'en', '3+ years'), ('skill.tailwindcss.desc', 'en', 'Utility-first, responsive design, custom themes, dark mode'),
  ('skill.supabase.level', 'en', 'Intermediate'), ('skill.supabase.exp', 'en', '2+ years'), ('skill.supabase.desc', 'en', 'Auth, real-time subscriptions, RLS policies, PostgreSQL'),
  ('skill.framermotion.level', 'en', 'Intermediate'), ('skill.framermotion.exp', 'en', '2+ years'), ('skill.framermotion.desc', 'en', 'Layout animations, scroll-triggered, variants, gesture-based'),
  ('skill.reactnative.level', 'en', 'Intermediate'), ('skill.reactnative.exp', 'en', '1+ year'), ('skill.reactnative.desc', 'en', 'Cross-platform mobile apps, Expo, native modules, app store deployment'),
  ('skill.javascript.level', 'en', 'Advanced'), ('skill.javascript.exp', 'en', '3+ years'), ('skill.javascript.desc', 'en', 'ES6+, async/await, closures, prototypal inheritance, event loop'),
  ('skill.vite.level', 'en', 'Advanced'), ('skill.vite.exp', 'en', '2+ years'), ('skill.vite.desc', 'en', 'Fast builds, HMR, code splitting, manual chunks, environment config'),
  ('skill.astro.level', 'en', 'Intermediate'), ('skill.astro.exp', 'en', '1+ year'), ('skill.astro.desc', 'en', 'Static site generation, islands architecture, content collections, view transitions'),
  ('skill.react.level', 'es', 'Avanzado'), ('skill.react.exp', 'es', '3+ años'), ('skill.react.desc', 'es', 'SPAs, hooks, context, server components, optimización de rendimiento'),
  ('skill.typescript.level', 'es', 'Avanzado'), ('skill.typescript.exp', 'es', '3+ años'), ('skill.typescript.desc', 'es', 'Tipos, genéricos, utility types, strict mode, declaration files'),
  ('skill.tailwindcss.level', 'es', 'Avanzado'), ('skill.tailwindcss.exp', 'es', '3+ años'), ('skill.tailwindcss.desc', 'es', 'Utility-first, diseño responsive, temas personalizados, dark mode'),
  ('skill.supabase.level', 'es', 'Intermedio'), ('skill.supabase.exp', 'es', '2+ años'), ('skill.supabase.desc', 'es', 'Auth, suscripciones en tiempo real, políticas RLS, PostgreSQL'),
  ('skill.framermotion.level', 'es', 'Intermedio'), ('skill.framermotion.exp', 'es', '2+ años'), ('skill.framermotion.desc', 'es', 'Animaciones de layout, scroll-triggered, variants, basadas en gestos'),
  ('skill.reactnative.level', 'es', 'Intermedio'), ('skill.reactnative.exp', 'es', '1+ año'), ('skill.reactnative.desc', 'es', 'Apps móviles multiplataforma, Expo, módulos nativos, despliegue en App Store'),
  ('skill.javascript.level', 'es', 'Avanzado'), ('skill.javascript.exp', 'es', '3+ años'), ('skill.javascript.desc', 'es', 'ES6+, async/await, closures, herencia prototípica, event loop'),
  ('skill.vite.level', 'es', 'Avanzado'), ('skill.vite.exp', 'es', '2+ años'), ('skill.vite.desc', 'es', 'Builds rápidos, HMR, división de código, chunks manuales, configuración de entorno'),
  ('skill.astro.level', 'es', 'Intermedio'), ('skill.astro.exp', 'es', '1+ año'), ('skill.astro.desc', 'es', 'Generación de sitios estáticos, arquitectura de islas, colecciones de contenido, view transitions');

-- Insert project translations
INSERT INTO translations (key, language_code, value) VALUES
  ('project.taskflow', 'en', 'Kanban board app with drag and drop, task management, and real-time updates.'),
  ('project.shophub', 'en', 'E-commerce catalog with product filtering, search, and shopping cart.'),
  ('project.dashmetrics', 'en', 'Analytics dashboard with interactive charts and real-time data visualization.'),
  ('project.devflow', 'en', 'Developer productivity tool for managing workflows and automation.'),
  ('project.pixelperfect', 'en', 'Design-to-code conversion tool with AI-assisted component detection.'),
  ('project.cryptosnap', 'en', 'Crypto portfolio tracker with real-time prices and market insights.'),
  ('project.taskflow', 'es', 'App de tablero Kanban con arrastrar y soltar, gestión de tareas y actualizaciones en tiempo real.'),
  ('project.shophub', 'es', 'Catálogo de e-commerce con filtrado de productos, búsqueda y carrito de compras.'),
  ('project.dashmetrics', 'es', 'Panel de análisis con gráficos interactivos y visualización de datos en tiempo real.'),
  ('project.devflow', 'es', 'Herramienta de productividad para desarrolladores para gestionar flujos de trabajo y automatización.'),
  ('project.pixelperfect', 'es', 'Herramienta de conversión de diseño a código con detección de componentes asistida por IA.'),
  ('project.cryptosnap', 'es', 'Rastreador de portafolio de criptomonedas con precios en tiempo real y perspectivas del mercado.');

-- Projects
INSERT INTO projects (slug, title, description, tags, image_url, category_id, sort_order) VALUES
  ('taskflow', 'TaskFlow', 'Kanban board app with drag and drop, task management, and real-time updates.', '{React,TypeScript,DnD,Zustand}', '', 3, 1),
  ('shophub', 'ShopHub', 'E-commerce catalog with product filtering, search, and shopping cart.', '{React,TypeScript,API,Context}', '', 1, 2),
  ('dashmetrics', 'DashMetrics', 'Analytics dashboard with interactive charts and real-time data visualization.', '{React,TypeScript,Charts,Recharts}', '', 2, 3),
  ('devflow', 'DevFlow', 'Developer productivity tool for managing workflows and automation.', '{React,Supabase,WebSocket,Docker}', '', 2, 4),
  ('pixelperfect', 'PixelPerfect', 'Design-to-code conversion tool with AI-assisted component detection.', '{React,AI,Figma API,Tailwind}', '', 3, 5),
  ('cryptosnap', 'CryptoSnap', 'Crypto portfolio tracker with real-time prices and market insights.', '{React,WebSocket,Charts,API}', '', 1, 6);

-- Skills
INSERT INTO skills (name, level, experience, icon, description, sort_order) VALUES
  ('React', 'Advanced', '3+ years', 'javascript', 'SPAs, hooks, context, server components, performance optimization', 1),
  ('TypeScript', 'Advanced', '3+ years', 'checklist', 'Types, generics, utility types, strict mode, declaration files', 2),
  ('Tailwind CSS', 'Advanced', '3+ years', 'css', 'Utility-first, responsive design, custom themes, dark mode', 3),
  ('Supabase', 'Intermediate', '2+ years', 'storage', 'Auth, real-time subscriptions, RLS policies, PostgreSQL', 4),
  ('Framer Motion', 'Intermediate', '2+ years', 'animation', 'Layout animations, scroll-triggered, variants, gesture-based', 5),
  ('React Native', 'Intermediate', '1+ year', 'mobile', 'Cross-platform mobile apps, Expo, native modules, app store deployment', 6),
  ('JavaScript', 'Advanced', '3+ years', 'code', 'ES6+, async/await, closures, prototypal inheritance, event loop', 7),
  ('Vite', 'Advanced', '2+ years', 'vite', 'Fast builds, HMR, code splitting, manual chunks, environment config', 8),
  ('Astro', 'Intermediate', '1+ year', 'astro', 'Static site generation, islands architecture, content collections, view transitions', 9);

-- Experiences
INSERT INTO experiences (role, company, period, description, achievements, is_current, project_slug, sort_order) VALUES
  ('Senior Frontend Developer', 'TechCorp', '2024 — Present', 'Leading frontend architecture for a SaaS platform serving 50k+ users.',
   ARRAY[
     'Reduced bundle size by 40% via code splitting and lazy loading',
     'Led migration from class components to hooks and functional components',
     'Implemented design system with 30+ reusable components',
     'Mentored 3 junior developers through code reviews and pair programming'
   ], true, 'dashmetrics', 1),
  ('Frontend Developer', 'StartupXYZ', '2022 — 2024', 'Built and maintained customer-facing web applications.',
   ARRAY[
     'Developed real-time collaboration features using WebSockets',
     'Improved Lighthouse score from 65 to 92 across all pages',
     'Created automated E2E test suite with 95% coverage',
     'Integrated third-party APIs for payments, maps, and analytics'
   ], false, 'taskflow', 2),
  ('Junior Developer', 'WebAgency', '2021 — 2022', 'Built responsive websites and web applications for diverse clients.',
   ARRAY[
     'Delivered 15+ client projects on time and within budget',
     'Developed custom WordPress themes and React SPAs',
     'Implemented CI/CD pipelines for automated deployments'
   ], false, 'shophub', 3);
```

- [ ] **Run the seed in Supabase SQL Editor**

```bash
# Paste and execute supabase/seed.sql in the Supabase Dashboard SQL Editor
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add seed data for all tables"
```

---

### Task 5: Setup React Router & lazy-loaded admin routes

**Files:**
- Modify: `src/App.tsx`

- [ ] **Update `src/App.tsx` with React Router**

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Contact } from '@/components/sections/Contact'
import { AIAssistant } from '@/components/ai/AIAssistant'
import { ScrollPathLayout } from '@/components/animations/ScrollPathLayout'
import { TimelineStep } from '@/components/animations/TimelineStep'
import { lazy, Suspense } from 'react'

const AdminLogin = lazy(() => import('@/admin/pages/LoginPage'))
const AdminDashboard = lazy(() => import('@/admin/pages/DashboardPage'))
const AdminLayout = lazy(() => import('@/admin/AdminLayout'))
const ProjectsList = lazy(() => import('@/admin/pages/ProjectsList'))
const ProjectForm = lazy(() => import('@/admin/pages/ProjectForm'))
const SkillsList = lazy(() => import('@/admin/pages/SkillsList'))
const SkillForm = lazy(() => import('@/admin/pages/SkillForm'))
const ExperiencesList = lazy(() => import('@/admin/pages/ExperiencesList'))
const ExperienceForm = lazy(() => import('@/admin/pages/ExperienceForm'))
const TranslationsPage = lazy(() => import('@/admin/pages/TranslationsPage'))
const SettingsPage = lazy(() => import('@/admin/pages/SettingsPage'))

function HomePage() {
  return (
    <Layout>
      <ScrollPathLayout>
        <TimelineStep side="left" fullBleed>
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

function AdminFallback() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={
          <Suspense fallback={<AdminFallback />}><AdminLogin /></Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<AdminFallback />}><AdminLayout /></Suspense>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:slug/edit" element={<ProjectForm />} />
          <Route path="skills" element={<SkillsList />} />
          <Route path="skills/new" element={<SkillForm />} />
          <Route path="skills/:id/edit" element={<SkillForm />} />
          <Route path="experiences" element={<ExperiencesList />} />
          <Route path="experiences/new" element={<ExperienceForm />} />
          <Route path="experiences/:id/edit" element={<ExperienceForm />} />
          <Route path="translations" element={<TranslationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add react router with lazy-loaded admin routes"
```

---

### Task 6: Auth hooks & context

**Files:**
- Create: `src/hooks/useAuth.ts`
- Modify: `src/App.tsx`

- [ ] **Create `src/hooks/useAuth.ts`**

```typescript
import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextValue {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAdmin: false,
  loading: true,
  signIn: async () => ({ error: 'AuthProvider not mounted' }),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) checkAdmin(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) checkAdmin(session.user.id)
      else { setIsAdmin(false); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkAdmin(userId: string) {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()
    setIsAdmin(data?.role === 'admin')
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

- [ ] **Wrap App with AuthProvider in `src/main.tsx`**

```typescript
import { AuthProvider } from '@/hooks/useAuth'

root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add auth context and hooks"
```

---

### Task 7: ProtectedRoute & AdminLayout components

**Files:**
- Create: `src/admin/ProtectedRoute.tsx`
- Create: `src/admin/AdminLayout.tsx`

- [ ] **Create `src/admin/ProtectedRoute.tsx`**

```typescript
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute() {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />

  return <Outlet />
}
```

- [ ] **Create `src/admin/AdminLayout.tsx`**

```typescript
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineTranslate, HiOutlineCog6Tooth, HiOutlineArrowRightOnRectangle, HiOutlineCodeBracketSquare } from 'react-icons/hi2'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineHome, end: true },
  { to: '/admin/projects', label: 'Projects', icon: HiOutlineBriefcase },
  { to: '/admin/skills', label: 'Skills', icon: HiOutlineCodeBracketSquare },
  { to: '/admin/experiences', label: 'Experience', icon: HiOutlineAcademicCap },
  { to: '/admin/translations', label: 'Translations', icon: HiOutlineTranslate },
  { to: '/admin/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
]

export default function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="w-64 bg-surface/20 border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <h1 className="text-lg font-bold text-white">Portfolio CMS</h1>
          <p className="text-xs text-text/40 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text/50 hover:text-white hover:bg-surface/20'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text/50 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
          >
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Update ProtectedRoute usage in App.tsx**

Replace the admin layout route with:
```typescript
<Route path="/admin" element={<ProtectedRoute />}>
  <Route element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    {/* ...rest of admin routes */}
  </Route>
</Route>
```

Add import: `import ProtectedRoute from '@/admin/ProtectedRoute'`

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add protected route guard and admin layout"
```

---

### Task 8: LoginPage

**Files:**
- Create: `src/admin/pages/LoginPage.tsx`

- [ ] **Create `src/admin/pages/LoginPage.tsx`**

```typescript
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { signIn, user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user && isAdmin) {
    navigate('/admin', { replace: true })
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    if (result.error) setError(result.error)
    else navigate('/admin', { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Portfolio CMS</h1>
          <p className="text-sm text-text/40 mt-1">Sign in to manage your content</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
            />
          </div>
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-bg font-medium rounded-lg hover:brightness-110 transition-all disabled:opacity-50 text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add admin login page"
```

---

### Task 9: Dashboard page

**Files:**
- Create: `src/admin/pages/DashboardPage.tsx`

- [ ] **Create `src/admin/pages/DashboardPage.tsx`**

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { HiOutlineBriefcase, HiOutlineCodeBracketSquare, HiOutlineAcademicCap, HiOutlineLanguage } from 'react-icons/hi2'

interface Stats {
  projects: number
  skills: number
  experiences: number
  translations: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ projects: 0, skills: 0, experiences: 0, translations: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('skills').select('*', { count: 'exact', head: true }),
      supabase.from('experiences').select('*', { count: 'exact', head: true }),
      supabase.from('translations').select('*', { count: 'exact', head: true }),
    ]).then(([p, s, e, t]) => {
      setStats({
        projects: p.count ?? 0,
        skills: s.count ?? 0,
        experiences: e.count ?? 0,
        translations: t.count ?? 0,
      })
    })
  }, [])

  const cards = [
    { label: 'Projects', value: stats.projects, icon: HiOutlineBriefcase, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Skills', value: stats.skills, icon: HiOutlineCodeBracketSquare, color: 'text-green-400 bg-green-500/10' },
    { label: 'Experiences', value: stats.experiences, icon: HiOutlineAcademicCap, color: 'text-purple-400 bg-purple-500/10' },
    { label: 'Translations', value: stats.translations, icon: HiOutlineLanguage, color: 'text-amber-400 bg-amber-500/10' },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface/20 rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-text/40">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add admin dashboard page"
```

---

### Task 10: Reusable CMS components

**Files:**
- Create: `src/admin/components/DataTable.tsx`
- Create: `src/admin/components/ConfirmDialog.tsx`
- Create: `src/admin/components/EmptyState.tsx`

- [ ] **Create `src/admin/components/DataTable.tsx`**

```typescript
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  loading?: boolean
}

export default function DataTable<T extends { id: number | string }>({
  columns, data, onEdit, onDelete, loading,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="text-center py-12 text-text/40 text-sm">Loading...</div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-3 text-text/40 font-medium">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="text-right py-3 px-3 text-text/40 font-medium w-20">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-white/5 hover:bg-surface/10 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-3 text-white">
                  {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <button onClick={() => onEdit(item)} className="p-2 rounded-lg text-text/40 hover:text-white hover:bg-surface/20 transition-all">
                        <HiOutlinePencilSquare className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item)} className="p-2 rounded-lg text-text/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Create `src/admin/components/ConfirmDialog.tsx`**

```typescript
interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-white/10 rounded-xl p-6 w-full max-w-sm mx-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-text/50 mt-2">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} disabled={loading} className="px-4 py-2 text-sm text-text/50 hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-50">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Create `src/admin/components/EmptyState.tsx`**

```typescript
import { HiOutlinePlus } from 'react-icons/hi2'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-lg font-medium text-text/40">{title}</p>
      <p className="text-sm text-text/30 mt-1">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all">
          <HiOutlinePlus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add reusable CMS components (DataTable, ConfirmDialog, EmptyState)"
```

---

### Task 11: ImageUpload component

**Files:**
- Create: `src/admin/components/ImageUpload.tsx`

- [ ] **Create `src/admin/components/ImageUpload.tsx`**

```typescript
import { useState, useRef, type ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { HiOutlinePhoto, HiOutlineTrash, HiOutlineArrowPath } from 'react-icons/hi2'

interface ImageUploadProps {
  bucket?: string
  path?: string
  currentUrl?: string
  onUpload: (url: string) => void
  onRemove?: () => void
}

export default function ImageUpload({
  bucket = 'images',
  path = 'projects',
  currentUrl,
  onUpload,
  onRemove,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl ?? '')

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
    const filePath = `${path}/${fileName}`

    const { error } = await supabase.storage.from(bucket).upload(filePath, file)
    if (error) { setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)
    setPreview(publicUrl)
    onUpload(publicUrl)
    setUploading(false)
  }

  const handleRemove = () => {
    setPreview('')
    onRemove?.()
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {preview ? (
          <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-white/10 group">
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => inputRef.current?.click()} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <HiOutlineArrowPath className="w-4 h-4 text-white" />
              </button>
              <button onClick={handleRemove} className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors">
                <HiOutlineTrash className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-32 h-20 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center hover:border-primary/50 transition-colors"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiOutlinePhoto className="w-6 h-6 text-text/30" />
            )}
          </button>
        )}
        <div>
          <p className="text-sm text-white">Project Image</p>
          <p className="text-xs text-text/40">PNG, JPG, WebP (max 2MB)</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add ImageUpload component for Supabase Storage"
```

---

### Task 12: Supabase data hooks

**Files:**
- Create: `src/hooks/useProjects.ts`
- Create: `src/hooks/useSkills.ts`
- Create: `src/hooks/useExperiences.ts`
- Create: `src/hooks/useTranslations.ts`

- [ ] **Create `src/hooks/useProjects.ts`**

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface ProjectRow {
  id: number
  slug: string
  title: string
  description: string
  tags: string[]
  image_url: string
  demo_url: string
  category_id: number
  sort_order: number
  created_at: string
  updated_at: string
}

export function useProjects() {
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setProjects(data as ProjectRow[])
        setLoading(false)
      })
  }, [])

  return { projects, loading }
}
```

- [ ] **Create `src/hooks/useSkills.ts`**

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface SkillRow {
  id: number
  name: string
  level: string
  experience: string
  icon: string
  description: string
  sort_order: number
}

export function useSkills() {
  const [skills, setSkills] = useState<SkillRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('skills')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setSkills(data as SkillRow[])
        setLoading(false)
      })
  }, [])

  return { skills, loading }
}
```

- [ ] **Create `src/hooks/useExperiences.ts`**

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface ExperienceRow {
  id: number
  role: string
  company: string
  period: string
  description: string
  achievements: string[]
  is_current: boolean
  project_slug: string
  sort_order: number
}

export function useExperiences() {
  const [experiences, setExperiences] = useState<ExperienceRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('experiences')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setExperiences(data as ExperienceRow[])
        setLoading(false)
      })
  }, [])

  return { experiences, loading }
}
```

- [ ] **Create `src/hooks/useTranslations.ts`**

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface TranslationRow {
  id: number
  key: string
  language_code: string
  value: string
}

export type TranslationMap = Record<string, string>

export function useTranslations(lang: string) {
  const [translations, setTranslations] = useState<TranslationMap>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('translations')
      .select('key, value')
      .eq('language_code', lang)
      .then(({ data }) => {
        if (data) {
          const map: TranslationMap = {}
          for (const row of data as { key: string; value: string }[]) {
            map[row.key] = row.value
          }
          setTranslations(map)
        }
        setLoading(false)
      })
  }, [lang])

  return { translations, loading }
}
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add supabase data hooks for projects, skills, experiences, translations"
```

---

### Task 13: Refactor LanguageContext to use Supabase

**Files:**
- Modify: `src/context/LanguageContext.tsx`

- [ ] **Update `src/context/LanguageContext.tsx` to fetch translations from Supabase**

```typescript
import { createContext, useContext, useState, type ReactNode } from 'react'
import { useTranslations } from '@/hooks/useTranslations'

type Language = 'en' | 'es'

interface LangContextValue {
  lang: Language
  t: (key: string) => string
  setLang: (l: Language) => void
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  t: () => '',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en')
  const { translations } = useTranslations(lang)

  const t = (key: string) => translations[key] ?? key

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLanguage = () => useContext(LangContext)
```

- [ ] **Commit**

```bash
git add -A
git commit -m "refactor: migrate LanguageContext to use Supabase translations"
```

---

### Task 14: Refactor section components to use Supabase hooks

**Files:**
- Modify: `src/components/sections/Projects.tsx`
- Modify: `src/components/sections/Skills.tsx`
- Modify: `src/components/sections/Experience.tsx`

- [ ] **Update `Projects.tsx` to use `useProjects`**

Replace `import { PROJECTS } from '@/data/projects'` with `import { useProjects } from '@/hooks/useProjects'`
Replace the data usage:
```typescript
const { projects } = useProjects()
// ...
const filtered = useMemo(
  () => projects.filter((p) => activeFilter === 'all' || p.category === activeFilter),
  [activeFilter, projects]
)
```

The category filtering needs updating since `category_id` is now a number. We need category data. Let me adjust:

```typescript
import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjects } from '@/hooks/useProjects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'

interface Category {
  id: number
  slug: string
  name_en: string
}

const ALL_CATEGORY = { id: 0, slug: 'all', name_en: 'All' }

export function Projects() {
  const { t } = useLanguage()
  const { projects } = useProjects()
  const [categories, setCategories] = useState<Category[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('all')

  useEffect(() => {
    supabase.from('categories').select('id, slug, name_en').order('sort_order').then(({ data }) => {
      if (data) setCategories(data as Category[])
    })
  }, [])

  const filtered = useMemo(
    () => projects.filter((p) => {
      if (activeFilter === 'all') return true
      const cat = categories.find((c) => c.slug === activeFilter)
      return cat && p.category_id === cat.id
    }),
    [activeFilter, projects, categories]
  )

  return (
    <section id="projects" className="pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label={t('projects.label')}
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
        />
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {[ALL_CATEGORY, ...categories].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveFilter(cat.slug)}
              aria-pressed={activeFilter === cat.slug}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeFilter === cat.slug
                  ? 'bg-primary text-bg'
                  : 'bg-surface/30 text-text/60 hover:text-white backdrop-blur-sm'
              }`}
            >
              {cat.slug === 'all' ? t('projects.all') : t('projects.' + cat.slug)}
            </button>
          ))}
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.article
                key={project.id}
                variants={cardAnim}
                layout
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                className="group relative bg-surface/20 backdrop-blur-sm rounded-xl overflow-hidden transition-colors"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/10 via-surface to-accent/10 flex items-center justify-center overflow-hidden">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl font-bold text-white/10 group-hover:scale-110 transition-transform duration-500">
                      {project.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text/50 mb-4 line-clamp-2">
                    {t('project.' + project.slug)}
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

- [ ] **Update `Skills.tsx` to use `useSkills`**

Replace `import { SKILLS } from '@/data/skills'` with `import { useSkills } from '@/hooks/useSkills'`
Replace:
```typescript
const { skills } = useSkills()
const skillKey = (name: string) => name.toLowerCase().replace(/\s+/g, '')
```
And map over `skills` instead of `SKILLS`.

- [ ] **Update `Experience.tsx` to use `useExperiences`**

Replace `import { EXPERIENCES } from '@/data/experiences'` with `import { useExperiences } from '@/hooks/useExperiences'`
Replace:
```typescript
const { experiences } = useExperiences()
```
And map over `experiences` instead of `EXPERIENCES`.

- [ ] **Commit**

```bash
git add -A
git commit -m "refactor: migrate sections to use Supabase hooks"
```

---

### Task 15: CRUD Pages — Projects

**Files:**
- Create: `src/admin/pages/ProjectsList.tsx`
- Create: `src/admin/pages/ProjectForm.tsx`

- [ ] **Create `src/admin/pages/ProjectsList.tsx`**

```typescript
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import DataTable from '@/admin/components/DataTable'
import ConfirmDialog from '@/admin/components/ConfirmDialog'
import EmptyState from '@/admin/components/EmptyState'
import { HiOutlinePlus } from 'react-icons/hi2'
import type { ProjectRow } from '@/hooks/useProjects'

export default function ProjectsList() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    supabase.from('projects').select('*').order('sort_order').then(({ data }) => {
      if (data) setProjects(data as ProjectRow[])
      setLoading(false)
    })
  }

  useEffect(load, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('projects').delete().eq('id', deleteId)
    setDeleting(false)
    setDeleteId(null)
    load()
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'slug', label: 'Slug' },
    {
      key: 'image_url', label: 'Image',
      render: (p: ProjectRow) => p.image_url
        ? <img src={p.image_url} alt="" className="w-16 h-10 object-cover rounded" />
        : <span className="text-text/30 text-xs">No image</span>,
    },
    {
      key: 'tags', label: 'Tags',
      render: (p: ProjectRow) => (
        <div className="flex gap-1 flex-wrap">
          {p.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-xs bg-surface/30 px-2 py-0.5 rounded">{t}</span>
          ))}
        </div>
      ),
    },
    { key: 'sort_order', label: 'Order' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Projects</h2>
        <button onClick={() => navigate('/admin/projects/new')} className="flex items-center gap-2 px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all">
          <HiOutlinePlus className="w-4 h-4" /> New Project
        </button>
      </div>

      {projects.length === 0 && !loading ? (
        <EmptyState title="No projects yet" description="Create your first project to showcase your work." actionLabel="New Project" onAction={() => navigate('/admin/projects/new')} />
      ) : (
        <div className="bg-surface/10 rounded-xl border border-white/5">
          <DataTable columns={columns} data={projects} loading={loading} onEdit={(p) => navigate(`/admin/projects/${p.slug}/edit`)} onDelete={(p) => setDeleteId(p.id)} />
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete Project" message="Are you sure? This cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
```

- [ ] **Create `src/admin/pages/ProjectForm.tsx`**

```typescript
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/admin/components/ImageUpload'
import { useForm } from 'react-hook-form'

interface FormData {
  title: string
  slug: string
  tags: string
  demo_url: string
  description: string
  category_id: number
  sort_order: number
}

export default function ProjectForm() {
  const { slug } = useParams()
  const isEdit = !!slug
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [categories, setCategories] = useState<{ id: number; name_en: string }[]>([])

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>()

  useEffect(() => {
    supabase.from('categories').select('id, name_en').order('sort_order').then(({ data }) => {
      if (data) setCategories(data as any)
    })
    if (isEdit) {
      supabase.from('projects').select('*').eq('slug', slug).single().then(({ data }) => {
        if (data) {
          const p = data as any
          reset({ title: p.title, slug: p.slug, tags: p.tags.join(', '), demo_url: p.demo_url, description: p.description, category_id: p.category_id, sort_order: p.sort_order })
          setImageUrl(p.image_url ?? '')
        }
      })
    }
  }, [slug, isEdit, reset])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const payload = {
      ...data,
      tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
      image_url: imageUrl,
    }
    if (isEdit) {
      await supabase.from('projects').update(payload).eq('slug', slug)
    } else {
      await supabase.from('projects').insert(payload)
    }
    setLoading(false)
    navigate('/admin/projects')
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-6">{isEdit ? 'Edit Project' : 'New Project'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Title</label>
            <input {...register('title', { required: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-text/40 mb-1">Slug</label>
            <input {...register('slug', { required: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" disabled={isEdit} />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text/40 mb-1">Description</label>
          <textarea {...register('description', { required: true })} rows={3} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Tags (comma separated)</label>
            <input {...register('tags')} placeholder="React, TypeScript, API" className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-text/40 mb-1">Category</label>
            <select {...register('category_id', { required: true, valueAsNumber: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Demo URL</label>
            <input {...register('demo_url')} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-text/40 mb-1">Sort Order</label>
            <input type="number" {...register('sort_order', { valueAsNumber: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
        </div>

        <ImageUpload currentUrl={imageUrl} onUpload={setImageUrl} onRemove={() => setImageUrl('')} />

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate('/admin/projects')} className="px-4 py-2 text-sm text-text/50 hover:text-white transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting || loading} className="px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50">
            {isSubmitting || loading ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add admin projects CRUD pages"
```

---

### Task 16: CRUD Pages — Skills

**Files:**
- Create: `src/admin/pages/SkillsList.tsx`
- Create: `src/admin/pages/SkillForm.tsx`

- [ ] **Create `src/admin/pages/SkillsList.tsx`**

```typescript
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import DataTable from '@/admin/components/DataTable'
import ConfirmDialog from '@/admin/components/ConfirmDialog'
import EmptyState from '@/admin/components/EmptyState'
import { HiOutlinePlus } from 'react-icons/hi2'
import type { SkillRow } from '@/hooks/useSkills'

export default function SkillsList() {
  const navigate = useNavigate()
  const [skills, setSkills] = useState<SkillRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    supabase.from('skills').select('*').order('sort_order').then(({ data }) => {
      if (data) setSkills(data as SkillRow[])
      setLoading(false)
    })
  }

  useEffect(load, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('skills').delete().eq('id', deleteId)
    setDeleting(false)
    setDeleteId(null)
    load()
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'level', label: 'Level' },
    { key: 'experience', label: 'Experience' },
    { key: 'sort_order', label: 'Order' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Skills</h2>
        <button onClick={() => navigate('/admin/skills/new')} className="flex items-center gap-2 px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all">
          <HiOutlinePlus className="w-4 h-4" /> New Skill
        </button>
      </div>

      {skills.length === 0 && !loading ? (
        <EmptyState title="No skills yet" description="Add the technologies you work with." actionLabel="New Skill" onAction={() => navigate('/admin/skills/new')} />
      ) : (
        <div className="bg-surface/10 rounded-xl border border-white/5">
          <DataTable columns={columns} data={skills} loading={loading} onEdit={(s) => navigate(`/admin/skills/${s.id}/edit`)} onDelete={(s) => setDeleteId(s.id)} />
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete Skill" message="Are you sure? This cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
```

- [ ] **Create `src/admin/pages/SkillForm.tsx`**

```typescript
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'

interface FormData {
  name: string
  level: string
  experience: string
  icon: string
  description: string
  sort_order: number
}

export default function SkillForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>()

  useEffect(() => {
    if (isEdit) {
      supabase.from('skills').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          const s = data as any
          reset({ name: s.name, level: s.level, experience: s.experience, icon: s.icon, description: s.description, sort_order: s.sort_order })
        }
      })
    }
  }, [id, isEdit, reset])

  const onSubmit = async (data: FormData) => {
    if (isEdit) {
      await supabase.from('skills').update(data).eq('id', id)
    } else {
      await supabase.from('skills').insert(data)
    }
    navigate('/admin/skills')
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-6">{isEdit ? 'Edit Skill' : 'New Skill'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Name</label>
            <input {...register('name', { required: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-text/40 mb-1">Icon slug</label>
            <input {...register('icon', { required: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Level</label>
            <select {...register('level')} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm">
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Beginner">Beginner</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text/40 mb-1">Experience</label>
            <input {...register('experience')} placeholder="3+ years" className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text/40 mb-1">Description</label>
          <textarea {...register('description')} rows={2} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Sort Order</label>
            <input type="number" {...register('sort_order', { valueAsNumber: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate('/admin/skills')} className="px-4 py-2 text-sm text-text/50 hover:text-white transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Skill'}
          </button>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add admin skills CRUD pages"
```

---

### Task 17: CRUD Pages — Experiences

**Files:**
- Create: `src/admin/pages/ExperiencesList.tsx`
- Create: `src/admin/pages/ExperienceForm.tsx`

- [ ] **Create `src/admin/pages/ExperiencesList.tsx`**

```typescript
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import DataTable from '@/admin/components/DataTable'
import ConfirmDialog from '@/admin/components/ConfirmDialog'
import EmptyState from '@/admin/components/EmptyState'
import { HiOutlinePlus } from 'react-icons/hi2'
import type { ExperienceRow } from '@/hooks/useExperiences'

export default function ExperiencesList() {
  const navigate = useNavigate()
  const [experiences, setExperiences] = useState<ExperienceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    supabase.from('experiences').select('*').order('sort_order').then(({ data }) => {
      if (data) setExperiences(data as ExperienceRow[])
      setLoading(false)
    })
  }

  useEffect(load, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('experiences').delete().eq('id', deleteId)
    setDeleting(false)
    setDeleteId(null)
    load()
  }

  const columns = [
    { key: 'role', label: 'Role' },
    { key: 'company', label: 'Company' },
    { key: 'period', label: 'Period' },
    {
      key: 'is_current', label: 'Current',
      render: (e: ExperienceRow) => e.is_current ? <span className="text-green-400 text-xs">Yes</span> : <span className="text-text/30 text-xs">No</span>,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Experience</h2>
        <button onClick={() => navigate('/admin/experiences/new')} className="flex items-center gap-2 px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all">
          <HiOutlinePlus className="w-4 h-4" /> New Experience
        </button>
      </div>

      {experiences.length === 0 && !loading ? (
        <EmptyState title="No experiences yet" description="Add your professional journey." actionLabel="New Experience" onAction={() => navigate('/admin/experiences/new')} />
      ) : (
        <div className="bg-surface/10 rounded-xl border border-white/5">
          <DataTable columns={columns} data={experiences} loading={loading} onEdit={(e) => navigate(`/admin/experiences/${e.id}/edit`)} onDelete={(e) => setDeleteId(e.id)} />
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete Experience" message="Are you sure? This cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
```

- [ ] **Create `src/admin/pages/ExperienceForm.tsx`**

```typescript
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'

interface FormData {
  role: string
  company: string
  period: string
  description: string
  is_current: boolean
  project_slug: string
  sort_order: number
}

export default function ExperienceForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [achievements, setAchievements] = useState<string[]>([''])
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>()

  useEffect(() => {
    if (isEdit) {
      supabase.from('experiences').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          const e = data as any
          reset({ role: e.role, company: e.company, period: e.period, description: e.description, is_current: e.is_current, project_slug: e.project_slug, sort_order: e.sort_order })
          setAchievements(e.achievements?.length ? e.achievements : [''])
        }
      })
    }
  }, [id, isEdit, reset])

  const addAchievement = () => setAchievements([...achievements, ''])
  const updateAchievement = (i: number, v: string) => {
    const next = [...achievements]; next[i] = v; setAchievements(next)
  }
  const removeAchievement = (i: number) => {
    setAchievements(achievements.filter((_, idx) => idx !== i))
  }

  const onSubmit = async (data: FormData) => {
    const payload = { ...data, achievements: achievements.filter(Boolean) }
    if (isEdit) {
      await supabase.from('experiences').update(payload).eq('id', id)
    } else {
      await supabase.from('experiences').insert(payload)
    }
    navigate('/admin/experiences')
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-6">{isEdit ? 'Edit Experience' : 'New Experience'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Role</label>
            <input {...register('role', { required: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-text/40 mb-1">Company</label>
            <input {...register('company', { required: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Period</label>
            <input {...register('period')} placeholder="2024 — Present" className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-text/40 mb-1">Project slug</label>
            <input {...register('project_slug')} placeholder="dashmetrics" className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text/40 mb-1">Description</label>
          <textarea {...register('description')} rows={2} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm resize-none" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-text/40">
            <input type="checkbox" {...register('is_current')} className="rounded border-white/10 bg-surface/10" />
            Current position
          </label>
        </div>

        <div>
          <label className="block text-sm text-text/40 mb-2">Achievements</label>
          <div className="space-y-2">
            {achievements.map((ach, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={ach} onChange={(e) => updateAchievement(i, e.target.value)} className="flex-1 px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
                <button type="button" onClick={() => removeAchievement(i)} className="p-2 text-text/30 hover:text-red-400 transition-colors text-sm">×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addAchievement} className="mt-2 text-sm text-primary hover:text-accent transition-colors">+ Add achievement</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Sort Order</label>
            <input type="number" {...register('sort_order', { valueAsNumber: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate('/admin/experiences')} className="px-4 py-2 text-sm text-text/50 hover:text-white transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Experience'}
          </button>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add admin experiences CRUD pages"
```

---

### Task 18: Translations editor page

**Files:**
- Create: `src/admin/pages/TranslationsPage.tsx`

- [ ] **Create `src/admin/pages/TranslationsPage.tsx`**

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface TranslationEntry {
  id: number
  key: string
  language_code: string
  value: string
}

export default function TranslationsPage() {
  const [items, setItems] = useState<TranslationEntry[]>([])
  const [filtered, setFiltered] = useState<TranslationEntry[]>([])
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState<number | null>(null)

  useEffect(() => {
    supabase.from('translations').select('*').order('key').then(({ data }) => {
      if (data) { setItems(data as TranslationEntry[]); setFiltered(data as TranslationEntry[]) }
    })
  }, [])

  useEffect(() => {
    if (!search) { setFiltered(items); return }
    setFiltered(items.filter((t) => t.key.toLowerCase().includes(search.toLowerCase())))
  }, [search, items])

  const update = async (id: number, value: string) => {
    setSaving(id)
    await supabase.from('translations').update({ value }).eq('id', id)
    setItems((prev) => prev.map((t) => t.id === id ? { ...t, value } : t))
    setSaving(null)
  }

  const grouped = filtered.reduce<Record<string, { en?: TranslationEntry; es?: TranslationEntry }>>((acc, t) => {
    if (!acc[t.key]) acc[t.key] = {}
    acc[t.key][t.language_code as 'en' | 'es'] = t
    return acc
  }, {})

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Translations</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search keys..."
          className="w-64 px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm"
        />
      </div>

      <div className="bg-surface/10 rounded-xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-white/5 text-xs text-text/40 font-medium">
          <span>Key</span><span>English</span><span>Spanish</span>
        </div>
        <div className="divide-y divide-white/5">
          {Object.entries(grouped).map(([key, { en, es }]) => (
            <div key={key} className="grid grid-cols-[1fr_1fr_1fr] gap-4 px-4 py-2 hover:bg-surface/10 transition-colors">
              <div className="text-sm text-text/40 py-1.5 font-mono text-xs">{key}</div>
              <EditableCell value={en?.value ?? ''} onSave={(v) => en?.id && update(en.id, v)} saving={en?.id ? saving === en.id : false} />
              <EditableCell value={es?.value ?? ''} onSave={(v) => es?.id && update(es.id, v)} saving={es?.id ? saving === es.id : false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EditableCell({ value, onSave, saving }: { value: string; onSave: (v: string) => void; saving: boolean }) {
  const [edit, setEdit] = useState(false)
  const [val, setVal] = useState(value)

  useEffect(() => { setVal(value) }, [value])

  const save = () => { onSave(val); setEdit(false) }

  if (edit) {
    return (
      <div className="flex items-center gap-1">
        <input value={val} onChange={(e) => setVal(e.target.value)} className="flex-1 px-2 py-1 bg-surface/20 rounded text-white text-sm border border-primary/30 focus:outline-none" autoFocus onKeyDown={(e) => e.key === 'Enter' && save()} />
        <button onClick={save} disabled={saving} className="text-xs text-primary hover:text-accent px-1">{saving ? '...' : '✓'}</button>
      </div>
    )
  }

  return (
    <div className="text-sm text-white py-1.5 cursor-pointer hover:bg-surface/10 px-2 -mx-2 rounded" onClick={() => setEdit(true)}>
      {value || <span className="text-text/20 italic">empty</span>}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add admin translations editor page"
```

---

### Task 19: Settings page

**Files:**
- Create: `src/admin/pages/SettingsPage.tsx`

- [ ] **Create `src/admin/pages/SettingsPage.tsx`**

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/admin/components/ImageUpload'

export default function SettingsPage() {
  const [profileImage, setProfileImage] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'profile').single().then(({ data }) => {
      if (data) setProfileImage((data.value as any)?.image_url ?? '')
    })
  }, [])

  const save = async () => {
    setSaving(true)
    await supabase.from('site_settings').upsert(
      { key: 'profile', value: { image_url: profileImage } },
      { onConflict: 'key' }
    )
    setSaving(false)
    setMessage('Saved!')
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-6">Settings</h2>

      <div className="bg-surface/10 rounded-xl border border-white/5 p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-white mb-3">Profile Image</h3>
          <ImageUpload
            bucket="images"
            path="profile"
            currentUrl={profileImage}
            onUpload={setProfileImage}
            onRemove={() => setProfileImage('')}
          />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {message && <span className="text-sm text-green-400">{message}</span>}
        </div>
      </div>
    </div>
  )
}
```

Also update `Hero.tsx` to use the profile image from Supabase settings when available (fallback to `/profile.jpg`):

```typescript
// At the top of Hero.tsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Inside Hero component:
const [profileUrl, setProfileUrl] = useState('/profile.jpg')

useEffect(() => {
  supabase.from('site_settings').select('value').eq('key', 'profile').single().then(({ data }) => {
    if (data) {
      const img = (data.value as any)?.image_url
      if (img) setProfileUrl(img)
    }
  })
}, [])
```

Then replace the `<img src="/profile.jpg"` with `<img src={profileUrl}`.

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add admin settings page with profile image"
```

---

### Task 20: Remove old data files & cleanup

**Files:**
- Delete: `src/data/translations.ts`
- Delete: `src/data/projects.ts`
- Delete: `src/data/skills.ts`
- Delete: `src/data/experiences.ts`

- [ ] **Remove old data files**

Delete the 4 data files that are no longer needed.

- [ ] **Check for any remaining imports from deleted files**

Run `rg "from '@/data/" src/` to verify no remaining imports.

- [ ] **Build to verify no errors**

```bash
npm run build
```

- [ ] **Commit**

```bash
git add -A
git commit -m "refactor: remove hardcoded data files, now fully using Supabase"
```

---

### Task 21: Configure Supabase Auth & create admin user

- [ ] **Enable email/password auth in Supabase dashboard**

```
Supabase Dashboard → Authentication → Providers → Email → Enable
```

- [ ] **Create admin user**

```bash
# In Supabase SQL Editor, create your admin user:
-- Step 1: Sign up via the Auth API or the dashboard
-- (use the dashboard UI: Authentication > Add User)
-- Step 2: After creating the user, get their UUID from auth.users
-- Step 3: Assign admin role:
INSERT INTO user_roles (user_id, role)
VALUES ('<user-uuid-from-auth>', 'admin');
```

- [ ] **Verify everything works**

```bash
npm run dev
# Visit localhost, verify landing page loads with Supabase data
# Visit /admin/login, sign in with admin credentials
# Test CRUD operations
```

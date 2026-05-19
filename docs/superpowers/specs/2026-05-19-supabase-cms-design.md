# Design Spec: Migración a Supabase + CMS Admin

**Fecha:** 2026-05-19
**Estado:** En revisión técnica

## 1. Objetivo

Migrar todo el contenido del portafolio (textos, proyectos, skills, experiencias, imágenes) de archivos locales hardcodeados a Supabase, y construir un panel CMS protegido para administrar dicho contenido. La landing pública debe seguir funcionando sin restricciones.

## 2. Arquitectura General

```
Frontend (Vite + React + TypeScript)
├── Landing Pública (sin auth)
│   └── Consume datos de Supabase con anon key
│       └── RLS: SELECT público en todas las tablas
│
└── CMS Admin (/admin/*)
    └── Protegido con Supabase Auth (email/password)
        └── RLS: CRUD solo si rol = 'admin'
            └── user_roles JOIN auth.users

Supabase
├── Auth (email/password)
├── Database (PostgreSQL)
│   ├── languages
│   ├── translations
│   ├── categories
│   ├── projects
│   ├── skills
│   ├── experiences
│   └── site_settings
├── Storage (bucket público "images")
│   ├── profile/
│   ├── projects/
│   └── skills/
└── RLS Policies
    ├── SELECT: público
    ├── INSERT/UPDATE/DELETE: solo admin
```

## 3. Diseño de Base de Datos

### Tablas

```sql
-- Idiomas disponibles
CREATE TABLE languages (
  id          BIGSERIAL PRIMARY KEY,
  code        TEXT UNIQUE NOT NULL,     -- 'en' | 'es'
  name        JSONB NOT NULL,           -- {"en": "English", "es": "Español"}
  is_default  BOOLEAN DEFAULT false
);

-- Traducciones
CREATE TABLE translations (
  id            BIGSERIAL PRIMARY KEY,
  key           TEXT NOT NULL,           -- 'hero.greeting', 'nav.projects', etc.
  language_code TEXT NOT NULL REFERENCES languages(code),
  value         TEXT NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(key, language_code)
);

-- Categorías de proyectos
CREATE TABLE categories (
  id         BIGSERIAL PRIMARY KEY,
  slug       TEXT UNIQUE NOT NULL,       -- 'frontend', 'fullstack', 'tooling'
  name_en    TEXT NOT NULL,
  name_es    TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Proyectos
CREATE TABLE projects (
  id          BIGSERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,      -- 'taskflow', 'shophub', etc.
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
  level       TEXT NOT NULL,             -- 'Advanced' | 'Intermediate'
  experience  TEXT NOT NULL,             -- '3+ years', etc.
  icon        TEXT NOT NULL,
  description TEXT DEFAULT '',
  sort_order  INTEGER DEFAULT 0
);

-- Experiencia laboral
CREATE TABLE experiences (
  id            BIGSERIAL PRIMARY KEY,
  role          TEXT NOT NULL,
  company       TEXT NOT NULL,
  period        TEXT NOT NULL,
  description   TEXT NOT NULL,
  achievements  TEXT[] DEFAULT '{}',
  is_current    BOOLEAN DEFAULT false,
  project_id    TEXT DEFAULT '',         -- referencia a project.slug
  sort_order    INTEGER DEFAULT 0
);

-- Configuración general (hero, redes sociales, etc.)
CREATE TABLE site_settings (
  id    BIGSERIAL PRIMARY KEY,
  key   TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL                   -- flexible para cualquier setting
);

-- Roles de usuario para admin
CREATE TABLE user_roles (
  id      BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role    TEXT NOT NULL DEFAULT 'admin',
  UNIQUE(user_id)
);
```

### RLS Policies

```sql
-- Público: SELECT en todas las tablas de contenido
CREATE POLICY "public_select" ON translations FOR SELECT USING (true);
CREATE POLICY "public_select" ON projects FOR SELECT USING (true);
CREATE POLICY "public_select" ON skills FOR SELECT USING (true);
CREATE POLICY "public_select" ON experiences FOR SELECT USING (true);
CREATE POLICY "public_select" ON categories FOR SELECT USING (true);
CREATE POLICY "public_select" ON site_settings FOR SELECT USING (true);

-- Admin: CRUD completo (solo si user_roles.role = 'admin')
CREATE POLICY "admin_all" ON translations FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));
-- (misma policy para projects, skills, experiences, categories, site_settings)
```

## 4. Supabase Storage

Bucket `images` (público) con estructura:

```
images/
├── profile/
│   └── profile.jpg
├── projects/
│   ├── taskflow.png
│   ├── shophub.png
│   └── ...
└── skills/
    ├── react.svg
    ├── typescript.svg
    └── ...
```

- Lectura pública (sin auth)
- Escritura solo admin (verificado via RLS equivalente o token de servicio)

## 5. Rutas y Componentes del CMS

### Layout del CMS

- `AdminLayout`: Sidebar con navegación + Header con avatar y cerrar sesión
- `ProtectedRoute`: Verifica sesión activa + rol admin, redirige a `/admin/login` si no

### Rutas página por página

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/admin/login` | `LoginPage` | Formulario email + password con Supabase Auth |
| `/admin` | `DashboardPage` | Cards con stats (total proyectos, skills, etc.) |
| `/admin/projects` | `ProjectsList` `ProjectForm` | CRUD proyectos + ImageUpload para screenshot |
| `/admin/skills` | `SkillsList` `SkillForm` | CRUD skills |
| `/admin/experiences` | `ExperiencesList` `ExperienceForm` | CRUD experiencias con editor de achievements |
| `/admin/translations` | `TranslationsPage` | Editor lado a lado EN/ES con búsqueda |
| `/admin/settings` | `SettingsPage` | Editar hero description, redes sociales, etc. |

### Componentes reutilizables del CMS

| Componente | Propósito |
|-----------|-----------|
| `AdminLayout` | Sidebar + Header + content area |
| `ProtectedRoute` | Guard de ruta con verificación de auth + rol |
| `DataTable` | Tabla genérica con sort, búsqueda, paginación |
| `ImageUpload` | Drag & drop + upload a Supabase Storage + preview |
| `TranslationEditor` | Editor de traducciones lado a lado |
| `ConfirmDialog` | Confirmación para eliminar |
| `EmptyState` | Estado vacío para listas |

## 6. Librerías Nuevas

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "react-router-dom": "^7.x",
    "react-hook-form": "^7.x"
  }
}
```

## 7. Estructura de Archivos Nueva

```
src/
├── lib/
│   └── supabase.ts              ← Cliente Supabase
├── hooks/
│   ├── useProjects.ts           ← Fetch projects desde Supabase
│   ├── useSkills.ts             ← Fetch skills desde Supabase
│   ├── useExperiences.ts        ← Fetch experiences desde Supabase
│   └── useTranslations.ts       ← Fetch translations desde Supabase
├── admin/
│   ├── AdminLayout.tsx          ← Layout del CMS
│   ├── ProtectedRoute.tsx       ← Guard de ruta
│   ├── components/
│   │   ├── DataTable.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── TranslationEditor.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── EmptyState.tsx
│   └── pages/
│       ├── LoginPage.tsx
│       ├── DashboardPage.tsx
│       ├── ProjectsList.tsx
│       ├── ProjectForm.tsx
│       ├── SkillsList.tsx
│       ├── SkillForm.tsx
│       ├── ExperiencesList.tsx
│       ├── ExperienceForm.tsx
│       ├── TranslationsPage.tsx
│       └── SettingsPage.tsx
├── components/
│   └── sections/
│       ├── Hero.tsx              ← Refactor: usar useTranslations
│       ├── Projects.tsx          ← Refactor: usar useProjects
│       ├── Skills.tsx            ← Refactor: usar useSkills
│       └── Experience.tsx        ← Refactor: usar useExperiences
└── data/                         ← SE ELIMINA (o queda como fallback)
```

## 8. Flujo de Migración de Datos

1. Crear proyecto Supabase desde dashboard
2. Ejecutar SQL migration (tablas + RLS)
3. Insertar seed data desde los archivos actuales:
   - `translations.ts` → tabla `translations`
   - `projects.ts` → tabla `projects`
   - `skills.ts` → tabla `skills`
   - `experiences.ts` → tabla `experiences`
4. Subir imágenes a Storage
5. Configurar Auth (habilitar email/password)
6. Crear usuario admin y asignarle rol en `user_roles`

## 9. Consideraciones

- **Fallback offline:** Los hooks de Supabase devolverán datos vacíos si hay error de conexión (se pueden mantener los archivos `data/*.ts` como import opcional)
- **Caching:** Las secciones públicas pueden cachear datos con `useMemo` + estado local (no se necesita SWR/React Query inicialmente)
- **Lazy loading CMS:** `React.lazy()` para todas las rutas `/admin/*` — el código del CMS no se carga en la landing
- **Env vars:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (públicas), `SUPABASE_SERVICE_KEY` (solo migraciones)

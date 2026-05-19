# Language Switcher — ES/EN

## Goal
Add a language toggle in the Navbar that switches all visible text between Spanish and English. No i18n library. Technology names (React, TypeScript, etc.) stay in English.

## Architecture

### LanguageContext (src/context/LanguageContext.tsx)
- Stores `language: 'es' | 'en'`
- Persists to `localStorage('lang')`
- Provides `t(key)` function that returns translated string

### useLanguage hook
- Returns `{ language, setLanguage, toggleLanguage, t }`
- `t(key)` looks up `translations[language][key]`, falls back to key if missing

### translations.ts (src/data/translations.ts)
- Plain object: `{ en: { key: string }, es: { key: string } }`
- Keys organized by section: `hero.greeting`, `contact.send`, `nav.projects`, etc.
- Technology descriptions in skills are NOT translated (tech names stay in English)
- Only supporting text (headings, labels, placeholders, buttons, aria-labels) gets translated

### LanguageSwitcher component (src/components/ui/LanguageSwitcher.tsx)
- Inline SVG flags: El Salvador flag (ES) and USA flag (EN)
- Shows active language highlighted, click toggles
- Placed in Navbar, right side before "Let's Work Together" button
- No dropdown — simple side-by-side clickable

### SVG Flags
- Inline SVGs in the component file (no external assets)
- ES: blue/white stripes with coat of arms simplified
- US: red/white stripes with blue canton and white stars simplified

## Files to modify

### New files
- `src/context/LanguageContext.tsx` — context, provider, hook, `t()` function
- `src/data/translations.ts` — all translated strings
- `src/components/ui/LanguageSwitcher.tsx` — toggle UI with SVG flags

### Modified files
- `src/main.tsx` — wrap app with LanguageProvider
- `src/components/layout/Navbar.tsx` — add LanguageSwitcher, translate links & button
- `src/components/sections/Hero.tsx` — translate all text
- `src/components/sections/Projects.tsx` — translate section headings, filter labels
- `src/components/sections/Skills.tsx` — translate section headings only (tech names stay)
- `src/components/sections/Contact.tsx` — translate all text
- `src/components/layout/Footer.tsx` — translate text
- `src/components/ai/AIAssistant.tsx` — translate all text
- `src/data/skills.ts` — no changes (tech names & descriptions stay in English)
- `src/data/projects.ts` — translate project descriptions
- `src/data/experiences.ts` — no changes (section removed)

## Translation scope

### Will be translated
- Hero: greeting, role title, description, buttons, aria-labels
- Projects: section heading, subtitle, filter "All", category labels
- Skills: section heading, subtitle only
- Contact: section heading, subtitle, form placeholders, labels, buttons, status messages
- Navbar: nav links, CTA button, aria-labels
- Footer: copyright, aria-label, link text
- AI Assistant: header, status, placeholder, button, empty state, error messages
- Project descriptions in data/projects.ts
- Gemini error/fallback messages

### NOT translated (stay in English)
- Technology names: React, TypeScript, Tailwind CSS, Vite, etc.
- Skill descriptions (data/skills.ts)
- Skill levels (Advanced, Intermediate) — these are part of the progress bar logic
- Company name "JDK Outstanding Technologies"
- Brand initials "OM"

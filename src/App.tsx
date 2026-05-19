import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Contact } from '@/components/sections/Contact'
import { AIAssistant } from '@/components/ai/AIAssistant'
import { ScrollPathLayout } from '@/components/animations/ScrollPathLayout'
import { TimelineStep } from '@/components/animations/TimelineStep'

const AdminLogin = lazy(() => import('@/admin/pages/LoginPage'))
const AdminDashboard = lazy(() => import('@/admin/pages/DashboardPage'))
const AdminLayout = lazy(() => import('@/admin/AdminLayout'))
const ProtectedRoute = lazy(() => import('@/admin/ProtectedRoute'))
const ProjectsList = lazy(() => import('@/admin/pages/ProjectsList'))
const ProjectForm = lazy(() => import('@/admin/pages/ProjectForm'))
const SkillsList = lazy(() => import('@/admin/pages/SkillsList'))
const SkillForm = lazy(() => import('@/admin/pages/SkillForm'))
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
          <Suspense fallback={<AdminFallback />}>
            <ProtectedRoute />
          </Suspense>
        }>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:slug/edit" element={<ProjectForm />} />
            <Route path="skills" element={<SkillsList />} />
            <Route path="skills/new" element={<SkillForm />} />
            <Route path="skills/:id/edit" element={<SkillForm />} />
            <Route path="translations" element={<TranslationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

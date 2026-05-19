import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Experience } from '@/components/sections/Experience'
import { Contact } from '@/components/sections/Contact'
import { AIAssistant } from '@/components/ai/AIAssistant'

export default function App() {
  return (
    <Layout>
      <Hero />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
      <AIAssistant />
    </Layout>
  )
}

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

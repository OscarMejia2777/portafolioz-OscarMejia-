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
        <TimelineStep side="left" fullBleed={true}>
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

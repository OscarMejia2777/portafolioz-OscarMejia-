import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS } from '@/data/projects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { useLanguage } from '@/context/LanguageContext'

const CATEGORIES = ['all', 'frontend', 'fullstack', 'tooling'] as const

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardAnim = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function Projects() {
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const filtered = useMemo(
    () => PROJECTS.filter((p) => activeFilter === 'all' || p.category === activeFilter),
    [activeFilter]
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
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeFilter === cat
                  ? 'bg-primary text-bg'
                  : 'bg-surface/30 text-text/60 hover:text-white backdrop-blur-sm'
              }`}
            >
              {t('projects.' + cat)}
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
                  <div className="text-4xl font-bold text-white/10 group-hover:scale-110 transition-transform duration-500">
                    {project.title.charAt(0)}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text/50 mb-4 line-clamp-2">
                    {t('project.' + project.id)}
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

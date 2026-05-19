import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS } from '@/data/projects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { staggerContainer, scaleIn } from '@/animations/variants'

const CATEGORIES = ['all', 'frontend', 'fullstack', 'tooling'] as const

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const filtered = useMemo(
    () => PROJECTS.filter((p) => activeFilter === 'all' || p.category === activeFilter),
    [activeFilter]
  )

  return (
    <section id="work" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Selected Work"
          title="Projects I've Built"
          subtitle="A collection of projects showcasing my skills and experience."
        />

        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeFilter === cat
                  ? 'bg-primary text-bg'
                  : 'bg-surface text-text/60 hover:text-white border border-white/5'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.article
                key={project.id}
                variants={scaleIn}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all"
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
                    {project.description}
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

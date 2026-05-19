import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjects } from '@/hooks/useProjects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import { ProjectsSkeleton } from '@/components/skeletons/ProjectsSkeleton'

interface Category {
  id: number
  slug: string
  name_en: string
}

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
  const { t, lang, transLoading } = useLanguage()
  const { projects, loading: projectsLoading } = useProjects(lang)
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

  if (transLoading || projectsLoading) return <ProjectsSkeleton />

  return (
    <section id="projects" className="pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label={t('projects.label')}
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
        />

        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          <button
            onClick={() => setActiveFilter('all')}
            aria-pressed={activeFilter === 'all'}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-primary text-bg'
                : 'bg-surface/30 text-text/60 hover:text-white backdrop-blur-sm'
            }`}
          >
            {t('projects.all')}
          </button>
          {categories.map((cat) => (
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
              {t('projects.' + cat.slug)}
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

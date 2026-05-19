import { motion } from 'framer-motion'
import { useSkills } from '@/hooks/useSkills'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { staggerContainer, fadeIn } from '@/animations/variants'
import { TechIcon } from '@/components/ui/TechIcon'
import { useLanguage } from '@/context/LanguageContext'
import { SkillsSkeleton } from '@/components/skeletons/SkillsSkeleton'

export function Skills() {
  const { t, lang, transLoading } = useLanguage()
  const { skills, loading: skillsLoading } = useSkills(lang)

  if (transLoading || skillsLoading) return <SkillsSkeleton />

  return (
    <section id="skills" className="pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label={t('skills.label')}
          title={t('skills.title')}
          subtitle={t('skills.subtitle')}
        />

        <motion.div
          className="flex flex-wrap justify-center gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {skills.map((skill) => {
            const barWidth = skill.level === 'Advanced' ? '90%' : skill.level === 'Intermediate' ? '65%' : '40%'
            return (
              <motion.div
                key={skill.name}
                variants={fadeIn}
                className="group relative bg-surface/20 backdrop-blur-sm rounded-xl p-5 transition-all w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] max-w-[400px]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <TechIcon name={skill.name} className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-semibold text-white group-hover:text-primary transition-colors truncate">
                        {skill.name}
                      </h3>
                      <span className="text-[11px] font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                        {skill.level}
                      </span>
                    </div>
                    <span className="text-[11px] text-text/30">{skill.experience}</span>
                    {skill.description && (
                      <p className="text-sm text-text/50 mt-2 leading-relaxed">
                        {skill.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: barWidth }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

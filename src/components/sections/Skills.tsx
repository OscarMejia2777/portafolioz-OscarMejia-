import { motion } from 'framer-motion'
import { SKILLS } from '@/data/skills'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { staggerContainer, fadeIn } from '@/animations/variants'
import { TechIcon } from '@/components/ui/TechIcon'
import { useLanguage } from '@/context/LanguageContext'

export function Skills() {
  const { t } = useLanguage()
  const skillKey = (name: string) => name.toLowerCase().replace(/\s+/g, '')

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
          {SKILLS.map((skill) => (
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
                      {t(`skill.${skillKey(skill.name)}.level`)}
                    </span>
                  </div>
                  <span className="text-[11px] text-text/30">{t(`skill.${skillKey(skill.name)}.exp`)}</span>
                  {skill.description && (
                    <p className="text-sm text-text/50 mt-2 leading-relaxed">
                      {t(`skill.${skillKey(skill.name)}.desc`)}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  whileInView={{
                    width:
                      skill.level === 'Advanced' ? '90%' :
                      skill.level === 'Intermediate' ? '65%' :
                      '40%',
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

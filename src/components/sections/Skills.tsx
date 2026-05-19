import { motion } from 'framer-motion'
import { SKILLS } from '@/data/skills'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { staggerContainer, fadeIn } from '@/animations/variants'

export function Skills() {
  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Tech Stack"
          title="Technologies I Work With"
          subtitle="The tools and frameworks I use to build modern web applications."
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {SKILLS.map((skill) => (
            <motion.div
              key={skill.name}
              variants={fadeIn}
              className="group relative bg-surface rounded-xl p-6 border border-white/5 hover:border-primary/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-2xl text-primary">
                    {skill.icon}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                    {skill.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                      {skill.level}
                    </span>
                    <span className="text-xs text-text/30">{skill.experience}</span>
                  </div>
                  {skill.description && (
                    <p className="text-sm text-text/50 mt-3 leading-relaxed">
                      {skill.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">
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

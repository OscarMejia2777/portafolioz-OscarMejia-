import { motion } from 'framer-motion'
import { EXPERIENCES } from '@/data/experiences'
import { SKILLS } from '@/data/skills'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { staggerContainer, fadeInLeft, fadeInRight } from '@/animations/variants'

export function Experience() {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Experience"
          title="Skills & Career"
          subtitle="My professional journey and the technologies I work with."
        />

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {SKILLS.map((skill) => (
            <motion.div
              key={skill.name}
              variants={fadeInLeft}
              className="p-5 rounded-xl bg-surface border border-white/5 text-center group hover:border-primary/20 transition-all"
            >
              <span className="material-symbols-outlined text-3xl text-primary/60 group-hover:text-primary transition-colors">
                {skill.icon}
              </span>
              <h3 className="mt-3 font-semibold text-white">{skill.name}</h3>
              <p className="text-xs text-text/40 mt-1">{skill.level}</p>
              <p className="text-xs text-text/30">{skill.experience}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary to-transparent" />

          <motion.div
            className="space-y-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={exp.company}
                variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                className={`relative flex flex-col md:flex-row gap-6 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute left-4 md:left-1/2 top-0 w-2 h-2 rounded-full bg-primary -translate-x-1/2 mt-2 ring-4 ring-bg" />

                <div className="md:w-1/2 pl-10 md:pl-0 md:pr-10 md:text-right">
                  {i % 2 === 0 && (
                    <>
                      <span className="text-xs text-primary font-medium">{exp.period}</span>
                      <h3 className="text-lg font-semibold text-white mt-1">{exp.role}</h3>
                      <p className="text-sm text-text/50">{exp.company}</p>
                      <p className="mt-3 text-sm text-text/60">{exp.description}</p>
                    </>
                  )}
                </div>

                <div className="md:w-1/2 pl-10 md:pl-10">
                  {i % 2 !== 0 && (
                    <>
                      <span className="text-xs text-primary font-medium">{exp.period}</span>
                      <h3 className="text-lg font-semibold text-white mt-1">{exp.role}</h3>
                      <p className="text-sm text-text/50">{exp.company}</p>
                      <p className="mt-3 text-sm text-text/60">{exp.description}</p>
                    </>
                  )}

                  <ul className="mt-4 space-y-2">
                    {exp.achievements.map((ach, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-text/50">
                        <span className="material-symbols-outlined text-xs mt-0.5 text-primary">
                          check_circle
                        </span>
                        {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { EXPERIENCES } from '@/data/experiences'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { staggerContainer, fadeInLeft, fadeInRight } from '@/animations/variants'

export function Experience() {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Experience"
          title="Career Journey"
          subtitle="My professional trajectory and key achievements."
        />

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

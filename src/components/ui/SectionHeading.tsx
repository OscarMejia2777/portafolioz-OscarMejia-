import { motion } from 'framer-motion'
import { fadeIn } from '@/animations/variants'

interface SectionHeadingProps {
  label?: string
  title: string
  subtitle?: string
}

export function SectionHeading({ label, title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      className="text-center mb-16"
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {label && (
        <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
      {subtitle && <p className="text-text/60 max-w-2xl mx-auto">{subtitle}</p>}
    </motion.div>
  )
}

import React from 'react'
import { motion } from 'framer-motion'

function Pulsing({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={`rounded-md bg-white/10 ${className ?? ''}`}
      style={style}
      animate={{ opacity: [0.25, 0.55, 0.25] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function HeroSkeleton() {
  return (
    <section className="relative pt-12 pb-24">
      <div className="w-full max-w-6xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="shrink-0">
            <div className="relative w-48 h-48 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden">
              <Pulsing className="absolute inset-0 rounded-full" />
            </div>
          </div>

          <div className="text-center lg:text-left w-full lg:max-w-xl space-y-4">
            <Pulsing className="h-10 sm:h-12 w-3/4" />
            <Pulsing className="h-8 w-1/2" />
            <div className="space-y-2 pt-2">
              <Pulsing className="h-4 w-full" />
              <Pulsing className="h-4 w-5/6" />
              <Pulsing className="h-4 w-2/3" />
            </div>
            <div className="flex items-center gap-3 pt-4 justify-center lg:justify-start">
              <Pulsing className="h-11 w-32 rounded-lg" />
              <Pulsing className="h-11 w-32 rounded-lg" />
              <Pulsing className="h-11 w-11 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

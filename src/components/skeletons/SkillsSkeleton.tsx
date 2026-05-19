import { motion } from 'framer-motion'

function Pulsing({ className }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-md bg-white/10 ${className ?? ''}`}
      animate={{ opacity: [0.25, 0.55, 0.25] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function SkillsSkeleton() {
  return (
    <section className="pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <Pulsing className="h-4 w-24 mx-auto rounded-full" />
          <Pulsing className="h-8 w-64 mx-auto" />
          <Pulsing className="h-4 w-96 mx-auto max-w-full" />
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-surface/20 backdrop-blur-sm rounded-xl p-5 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] max-w-[400px]"
            >
              <div className="flex items-start gap-3">
                <Pulsing className="w-10 h-10 rounded-lg shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Pulsing className="h-5 w-28" />
                    <Pulsing className="h-5 w-24 rounded-full" />
                  </div>
                  <Pulsing className="h-3 w-20" />
                  <Pulsing className="h-3 w-full" />
                </div>
              </div>
              <Pulsing className="mt-3 h-1 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
